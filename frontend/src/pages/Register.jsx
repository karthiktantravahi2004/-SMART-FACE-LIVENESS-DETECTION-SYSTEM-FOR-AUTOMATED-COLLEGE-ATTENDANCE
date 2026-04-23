import React, { useState, useRef } from "react";
import WebcamFeed from "../components/WebcamFeed";
import api from "../services/api";

export default function Register() {
  const webcamRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    student_id: "",
    department: "Computer Science",
    year: "1st Year",
    section: "A",
  });

  const [status, setStatus] = useState({
    message: "System Ready",
    type: "info",
  });

  const [capturedImage, setCapturedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCapture = () => {
    if (!formData.name || !formData.student_id) {
      setStatus({ message: "Enter name & roll number first", type: "error" });
      return;
    }

    const imageSrc = webcamRef.current?.getScreenshot();

    if (!imageSrc || !imageSrc.startsWith("data:image")) {
      setStatus({ message: "Camera capture failed", type: "error" });
      return;
    }

    setCapturedImage(imageSrc);
    setStatus({ message: "Image captured successfully", type: "success" });
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setStatus({ message: "Retake image", type: "info" });
  };

  const handleRegister = async () => {
    if (isProcessing) return;

    if (!capturedImage) {
      setStatus({ message: "Capture image first", type: "error" });
      return;
    }

    setIsProcessing(true);
    setStatus({ message: "Registering...", type: "info" });

    try {
      const payload = {
        ...formData,
        image: capturedImage,
      };

      const result = await api.registerStudent(payload);

      if (result.success) {
        setStatus({
          message: `Registered: ${formData.student_id}`,
          type: "success",
        });

        setFormData({
          name: "",
          student_id: "",
          department: "Computer Science",
          year: "1st Year",
          section: "A",
        });

        setCapturedImage(null);
      } else {
        setStatus({
          message: result.error || "Registration failed",
          type: "error",
        });
      }
    } catch (err) {
      setStatus({ message: "Server error", type: "error" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="p-6 max-w-6xl mx-auto">
      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-2">Enroll New Identity</h1>
      <p className="text-gray-500 mb-6">
        Create a biometric profile using facial capture
      </p>

      <div className="grid md:grid-cols-2 gap-10">
        {/* LEFT FORM */}
        <div className="space-y-5">
          {/* NAME */}
          <div>
            <label className="text-sm text-gray-600">Full Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Alexander Pierce"
              className="w-full p-3 border-b focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* ROLL */}
          <div>
            <label className="text-sm text-gray-600">Roll Number</label>
            <input
              name="student_id"
              value={formData.student_id}
              onChange={(e) => {
                let val = e.target.value
                  .toUpperCase()
                  .replace(/[^A-Z0-9]/g, "");
                if (val.length <= 12) {
                  setFormData({ ...formData, student_id: val });
                }
              }}
              placeholder="e.g. CS-2024-081"
              className="w-full p-3 border-b focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* DROPDOWNS */}
          <div className="grid grid-cols-3 gap-4">
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="p-3 border rounded bg-gray-50"
            >
              <option>Computer Science</option>
              <option>IT</option>
              <option>ECE</option>
              <option>EEE</option>
            </select>

            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="p-3 border rounded bg-gray-50"
            >
              <option>1st Year</option>
              <option>2nd Year</option>
              <option>3rd Year</option>
              <option>4th Year</option>
            </select>

            <select
              name="section"
              value={formData.section}
              onChange={handleChange}
              className="p-3 border rounded bg-gray-50"
            >
              <option>A</option>
              <option>B</option>
              <option>C</option>
            </select>
          </div>

          {/* BUTTONS */}
          {!capturedImage ? (
            <button
              onClick={handleCapture}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold"
            >
              📷 Capture Biometric
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleRetake}
                className="w-1/3 bg-gray-300 py-3 rounded-lg"
              >
                Retake
              </button>
              <button
                onClick={handleRegister}
                className="w-2/3 bg-green-600 text-white py-3 rounded-lg"
              >
                Register
              </button>
            </div>
          )}

          {/* STATUS */}
          <div className="p-3 rounded bg-gray-100 text-sm">
            {status.message}
          </div>
        </div>

        {/* CAMERA */}
        <div className="relative bg-black rounded-xl overflow-hidden">
          {!capturedImage ? (
            <>
              <WebcamFeed ref={webcamRef} className="w-full h-[350px]" />

              {/* SCAN LINE */}
              <div className="absolute top-0 left-0 w-full h-[3px] bg-orange-500 animate-pulse"></div>

              {/* STATUS */}
              <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded text-sm">
                DETECTING_FACE...
              </div>
            </>
          ) : (
            <img
              src={capturedImage}
              className="w-full h-[350px] object-cover"
              alt="Captured"
            />
          )}
        </div>
      </div>
    </main>
  );
}
