from config.firebase_config import db

def add_student(student):
    print("➡️ Writing to Firestore:", student["student_id"])
    db.collection("students").document(student["id"]).set(student)
    print("✅ Firestore write done")

def get_all_students():
    docs = db.collection("students").stream()
    students = []
    for doc in docs:
        students.append(doc.to_dict())
    return students