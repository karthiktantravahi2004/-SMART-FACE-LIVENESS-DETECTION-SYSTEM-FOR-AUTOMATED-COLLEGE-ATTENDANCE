from config.firebase_config import db
from utils.date_utils import get_today, get_time

def mark_attendance(student, lat=None, lon=None):

    today = get_today()
    doc_id = f"{student['id']}_{today}"

    ref = db.collection("attendance").document(doc_id)

    if ref.get().exists:
        return False

    ref.set({
        "name": student["name"],
        "id": student["id"],
        "date": today,
        "time": get_time(),
        "status": "present",
        "latitude": lat,
        "longitude": lon
    })

    return True


def get_all_records():
    docs = db.collection("attendance").stream()
    return [doc.to_dict() for doc in docs]