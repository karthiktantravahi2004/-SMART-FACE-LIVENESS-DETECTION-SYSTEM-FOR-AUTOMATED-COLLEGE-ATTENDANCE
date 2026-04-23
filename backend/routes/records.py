# routes/records.py

from flask import Blueprint, jsonify
from database.attendance_db import get_all_records

records_bp = Blueprint("records", __name__)

@records_bp.route("/records")
def records():
    data = get_all_records()

    # 🔥 FIX: normalize field here
    fixed = []
    for r in data:
        fixed.append({
            "name": r.get("name"),
            "student_id": r.get("student_id") or r.get("id"),
            "department": r.get("department"),
            "date": r.get("date"),
            "time": r.get("time"),
            "status": r.get("status")
        })

    return jsonify(fixed)   # ✅ NO "root"


@records_bp.route("/absentees")
def absentees():
    return jsonify([])  # keep as is