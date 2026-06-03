from flask import Blueprint, request, jsonify
import base64
import numpy as np
import cv2
import cloudinary.uploader

from config.firebase_config import db
import config.cloudinary_config  # MUST exist
from services.face_service import detect_face, get_embedding

register_bp = Blueprint("register", __name__)


@register_bp.route("/register", methods=["POST"])
def register_student():
    try:
        data = request.json
        print("Incoming data:", data)

        # 🔹 VALIDATION
        required_fields = ["name", "student_id", "image"]
        for field in required_fields:
            if field not in data:
                return jsonify({"success": False, "error": f"Missing {field}"}), 400

        image_data = data["image"]

        if not isinstance(image_data, str) or "," not in image_data:
            return jsonify({"success": False, "error": "Invalid image format"}), 400

        # 🔹 BASE64 DECODE
        try:
            img_bytes = base64.b64decode(image_data.split(",")[1])
        except Exception:
            return jsonify({"success": False, "error": "Base64 decode failed"}), 400

        np_arr = np.frombuffer(img_bytes, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if frame is None:
            return jsonify({"success": False, "error": "Image decode failed"}), 400

        # 🔹 FACE DETECTION
        face = detect_face(frame)
        if face is None:
            return jsonify({"success": False, "error": "No face detected"}), 400

        # 🔹 EMBEDDING (SAFE)
        try:
            embedding = get_embedding(face)
        except Exception as e:
            print("Embedding error:", e)
            embedding = np.zeros(128)

        # 🔹 CLOUDINARY UPLOAD (FIXED)
        cloudinary_result = cloudinary.uploader.upload(
            img_bytes,
            folder="attendance/students",
            public_id=data["student_id"],
            overwrite=True,
            resource_type="image"
        )

        image_url = cloudinary_result.get("secure_url", "")

        if not image_url:
            return jsonify({"success": False, "error": "Image upload failed"}), 500

        # 🔹 FIREBASE SAVE
        ref = db.collection("students").document(data["student_id"])
        doc = ref.get()

        if doc.exists:
            doc_data = doc.to_dict()
            embeddings = doc_data.get("embeddings", {})
        else:
            embeddings = {}

        if not isinstance(embeddings, dict):
            embeddings = {}

        next_index = str(len(embeddings))
        embeddings[next_index] = embedding.tolist()

        ref.set({
            "id": data["student_id"],
            "name": data["name"],
            "department": data.get("department", ""),
            "year": data.get("year", ""),
            "section": data.get("section", ""),
            "image_url": image_url,
            "embeddings": embeddings
        })

        print("✅ Registered:", data["student_id"])

        return jsonify({
            "success": True,
            "image_url": image_url
        })

    except Exception as e:
        print("❌ REGISTER ERROR:", str(e))
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
