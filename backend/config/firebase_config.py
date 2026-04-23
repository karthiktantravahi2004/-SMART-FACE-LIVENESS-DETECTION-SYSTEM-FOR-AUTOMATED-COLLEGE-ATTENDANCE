# config/firebase_config.py

import firebase_admin
from firebase_admin import credentials, firestore

# -------- INIT FIREBASE --------
def init_firebase():
    if not firebase_admin._apps:
        cred = credentials.Certificate("firebase_key.json")  # <-- your key file
        firebase_admin.initialize_app(cred)

    return firestore.client()


# -------- EXPORT DB --------
db = init_firebase()