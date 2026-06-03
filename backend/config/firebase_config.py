import os
import json
import firebase_admin
from firebase_admin import credentials, firestore

def init_firebase():
    if not firebase_admin._apps:
        firebase_json = os.getenv("FIREBASE_CREDENTIALS_JSON")
        cred = credentials.Certificate(json.loads(firebase_json))
        firebase_admin.initialize_app(cred)

    return firestore.client()

db = init_firebase()
