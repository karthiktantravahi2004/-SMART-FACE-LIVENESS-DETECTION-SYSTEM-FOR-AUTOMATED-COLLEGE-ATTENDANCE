import cv2
import numpy as np

# Load cascade once
cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)

def _find_face_box(gray):
    faces = cascade.detectMultiScale(
        gray,
        scaleFactor=1.08,
        minNeighbors=4,
        minSize=(40, 40)
    )

    if len(faces) == 0:
        return None

    return max(faces, key=lambda f: f[2] * f[3])


def detect_face(frame):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    face_box = _find_face_box(gray)

    if face_box is None:
        return None

    x, y, w, h = face_box
    face = frame[y:y+h, x:x+w]

    if face.size == 0:
        return None

    return cv2.resize(face, (160, 160))


def get_embedding(face):
    # TEMP placeholder (no ML)
    return np.zeros(128)
