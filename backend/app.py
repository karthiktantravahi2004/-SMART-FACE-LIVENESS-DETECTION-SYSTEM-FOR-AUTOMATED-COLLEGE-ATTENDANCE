import os
import logging
import warnings

from flask import Flask, send_from_directory
from flask_cors import CORS

# Optional: remove TensorFlow env (since you're not using it now)
# os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "2")
# os.environ.setdefault("TF_ENABLE_ONEDNN_OPTS", "0")

warnings.filterwarnings("ignore", category=FutureWarning)

# 🔥 SAFE IMPORTS (VERY IMPORTANT)
try:
    from routes.attendance import attendance_bp
    from routes.register import register_bp
    from routes.records import records_bp
except Exception as e:
    print("Import error:", e)

app = Flask(__name__, static_folder="build", static_url_path="")
CORS(app)

logging.getLogger("werkzeug").setLevel(logging.WARNING)

# 🔥 REGISTER BLUEPRINTS SAFELY
try:
    app.register_blueprint(attendance_bp)
    app.register_blueprint(register_bp)
    app.register_blueprint(records_bp)
except Exception as e:
    print("Blueprint error:", e)

# 🔥 SERVE REACT BUILD
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    file_path = os.path.join(app.static_folder, path)

    if path != "" and os.path.exists(file_path):
        return send_from_directory(app.static_folder, path)

    return send_from_directory(app.static_folder, "index.html")

# 🔥 HEALTH CHECK (IMPORTANT FOR RENDER)
@app.route("/health")
def health():
    return {"status": "ok"}, 200

# 🔥 RUN
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # IMPORTANT for Render
    print(f"Server running on port {port}")
    app.run(host="0.0.0.0", port=port, debug=False)
