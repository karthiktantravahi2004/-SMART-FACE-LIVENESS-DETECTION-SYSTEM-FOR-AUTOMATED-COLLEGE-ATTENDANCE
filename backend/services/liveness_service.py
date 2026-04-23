import numpy as np
import cv2

def check_liveness(face, prev_gray):
    gray = cv2.cvtColor(face, cv2.COLOR_BGR2GRAY)

    gray = cv2.GaussianBlur(gray, (5, 5), 0)

    if prev_gray is None:
        return False, gray, 0.0

    diff = cv2.absdiff(prev_gray, gray)
    score = np.mean(diff)

    is_live = score > 1.2

    return is_live, gray, float(score)