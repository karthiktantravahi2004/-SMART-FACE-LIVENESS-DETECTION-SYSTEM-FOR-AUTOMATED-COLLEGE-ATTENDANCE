import cv2
import numpy as np
from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2, preprocess_input

# Load model once
model = MobileNetV2(
    weights="imagenet",
    include_top=False,
    pooling="avg",
    input_shape=(160, 160, 3)
)

# Load cascade once (not inside function)
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
        faces = cascade.detectMultiScale(
            gray,
            scaleFactor=1.03,
            minNeighbors=2,
            minSize=(30, 30)
        )

    if len(faces) == 0:
        return None

    return max(faces, key=lambda f: f[2] * f[3])


def _rotate_frame(frame, angle):
    h, w = frame.shape[:2]
    center = (w // 2, h // 2)
    mat = cv2.getRotationMatrix2D(center, angle, 1.0)
    return cv2.warpAffine(frame, mat, (w, h), flags=cv2.INTER_LINEAR)


def detect_face(frame):
    # Try upright first, then mild rotations for tilted head/camera scenarios.
    for angle in (0, -20, 20, -35, 35):
        candidate = frame if angle == 0 else _rotate_frame(frame, angle)
        gray = cv2.cvtColor(candidate, cv2.COLOR_BGR2GRAY)
        gray = cv2.equalizeHist(gray)

        face_box = _find_face_box(gray)
        if face_box is None:
            continue

        x, y, w, h = face_box

        # Add a small margin around the detected face for stable embedding extraction.
        pad = int(0.15 * max(w, h))
        x1 = max(0, x - pad)
        y1 = max(0, y - pad)
        x2 = min(candidate.shape[1], x + w + pad)
        y2 = min(candidate.shape[0], y + h + pad)

        face = candidate[y1:y2, x1:x2]
        if face.size == 0:
            continue

        return cv2.resize(face, (160, 160))

    return None


def get_embedding(face):
    face = preprocess_input(face)
    face = np.expand_dims(face, axis=0)

    emb = model.predict(face, verbose=0)[0]

    norm = np.linalg.norm(emb)
    return emb / norm if norm != 0 else emb
