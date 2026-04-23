import os
import logging
import warnings

from flask import Flask, send_from_directory
from flask_cors import CORS

os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "2")
os.environ.setdefault("TF_ENABLE_ONEDNN_OPTS", "0")
warnings.filterwarnings("ignore", category=FutureWarning, module="google.api_core")

from routes.attendance import attendance_bp
from routes.register import register_bp
from routes.records import records_bp

app = Flask(__name__, static_folder="build", static_url_path="")
CORS(app)

logging.getLogger("werkzeug").setLevel(logging.WARNING)

app.register_blueprint(attendance_bp)
app.register_blueprint(register_bp)
app.register_blueprint(records_bp)

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    file_path = os.path.join(app.static_folder, path)

    if path != "" and os.path.exists(file_path):
        return send_from_directory(app.static_folder, path)

    return send_from_directory(app.static_folder, "index.html")

if __name__ == "__main__":
    host = "0.0.0.0"
    port = 5000
    print(f"Attendance server running at http://127.0.0.1:{port}")
    app.run(host=host, port=port, debug=False, use_reloader=False)