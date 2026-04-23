import numpy as np
from database.student_db import get_all_students

THRESHOLD = 0.78


def match_face(embedding):
    students = get_all_students()

    print("Students in DB:", len(students))

    if not students:
        return None

    best_student = None
    best_dist = float("inf")

    for s in students:
        embeddings_dict = s.get("embeddings", {})

        if not embeddings_dict:
            continue

        embs = np.array(list(embeddings_dict.values()), dtype=np.float32)
        if embs.size == 0:
            continue

        # Use the mean of top-k closest vectors for robust matching against noisy frames.
        dists = np.linalg.norm(embs - embedding, axis=1)
        top_k = min(3, len(dists))
        dist = float(np.mean(np.sort(dists)[:top_k]))

        if dist < best_dist:
            best_dist = dist
            best_student = s

    print("Best distance:", best_dist)

    if best_dist < THRESHOLD:
        return {
            "id": best_student["id"],
            "name": best_student["name"]
        }

    return None