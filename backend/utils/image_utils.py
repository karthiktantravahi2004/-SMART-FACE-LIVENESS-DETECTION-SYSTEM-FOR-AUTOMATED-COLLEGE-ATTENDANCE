# utils/image_utils.py

import base64
import cv2
import numpy as np

def decode_base64(img_base64):
    try:
        img_data = base64.b64decode(img_base64.split(",")[1])
        np_arr = np.frombuffer(img_data, np.uint8)
        return cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    except:
        return None