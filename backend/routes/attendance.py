from flask import Blueprint, request, jsonify
import time
import logging
import numpy as np

from utils.image_utils import decode_base64
from services.face_service import detect_face, get_embedding
from services.liveness_service import check_liveness
from services.matcher_service import match_face
from database.attendance_db import mark_attendance

attendance_bp = Blueprint("attendance", __name__)

prev_gray = None
last_identity = None
last_time = 0
recent_predictions = []
embedding_buffer = []
static_face_counter = 0
no_face_counter = 0
last_matched_id = None
matched_streak = 0

logging.basicConfig(level=logging.INFO)


def confirm_identity(student_id):
    global recent_predictions

    recent_predictions.append(student_id)

    if len(recent_predictions) > 5:
        recent_predictions.pop(0)

    return recent_predictions.count(student_id) >= 3


@attendance_bp.route("/process-frame", methods=["POST"])
def process_frame():

    global prev_gray, last_identity, last_time, embedding_buffer, static_face_counter, no_face_counter, last_matched_id, matched_streak

    try:
        data = request.json
        frame = decode_base64(data.get("image"))

        if frame is None:
            no_face_counter += 1
            return jsonify({"face_detected": False})

        face = detect_face(frame)

        if face is None:
            no_face_counter += 1
            if no_face_counter >= 6:
                prev_gray = None
                embedding_buffer = []
                static_face_counter = 0
                last_matched_id = None
                matched_streak = 0
            return jsonify({"face_detected": False})

        no_face_counter = 0

        is_live, prev_gray, motion_score = check_liveness(face, prev_gray)

        if is_live:
            static_face_counter = 0
        else:
            static_face_counter += 1

        spoof_flag = static_face_counter >= 24 and motion_score < 0.5

        if spoof_flag:
            embedding_buffer = []
            return jsonify({
                "face_detected": True,
                "spoof_detected": True,
                "recognized": False,
                "identity": None
            })

        # Build a short rolling embedding window so recognition uses stable face vectors.
        embedding = get_embedding(face)
        embedding_buffer.append(embedding)
        if len(embedding_buffer) > 5:
            embedding_buffer.pop(0)

        if len(embedding_buffer) < 3:
            return jsonify({
                "face_detected": True,
                "spoof_detected": False,
                "recognized": False,
                "identity": None,
                "collecting_embeddings": True
            })

        stacked = np.array(embedding_buffer)
        stable_embedding = np.mean(stacked, axis=0)
        norm = np.linalg.norm(stable_embedding)
        if norm != 0:
            stable_embedding = stable_embedding / norm

        student = match_face(stable_embedding)

        if student:
            current_id = student["id"]
            if current_id == last_matched_id:
                matched_streak += 1
            else:
                last_matched_id = current_id
                matched_streak = 1
        else:
            last_matched_id = None
            matched_streak = 0

        if student and (matched_streak >= 2 or confirm_identity(student["id"])):
            lat = request.json.get("latitude")
            lon = request.json.get("longitude")

            attendance_marked = mark_attendance(student, lat, lon)
            embedding_buffer = []
            static_face_counter = 0
            last_matched_id = None
            matched_streak = 0

            return jsonify({
                "face_detected": True,
                "spoof_detected": False,
                "recognized": True,
                "stable": True,
                "identity": student,
                "attendance_marked": attendance_marked,
                "attendance_status": "marked" if attendance_marked else "already_marked"
            })

        return jsonify({
            "face_detected": True,
            "spoof_detected": False,
            "recognized": student is not None,
            "stable": False,
            "identity": student
        })

    except Exception as e:
        return jsonify({
            "face_detected": False,
            "error": str(e)
        })