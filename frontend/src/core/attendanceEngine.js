import { useState, useRef } from "react";
import api from "../services/api";

export const useAttendanceEngine = (webcamRef) => {
  const [engineState, setEngineState] = useState("Idle");
  const [logs, setLogs] = useState([]);
  const [currentIdentity, setCurrentIdentity] = useState(null);

  const buffer = useRef([]);
  const noFaceStreak = useRef(0);
  const isRunning = useRef(false);
  const isCooldown = useRef(false);
  const isAwaitingNext = useRef(false);
  const analyzeGraceUntil = useRef(0);

  const resetAnalyzeState = () => {
    analyzeGraceUntil.current = 0;
  };

  // ✅ FIXED LOOP (no ghost loops, no stacking)
  const loop = async () => {
    if (!isRunning.current) return;

    if (!isAwaitingNext.current) {
      await processTick();
    }

    setTimeout(loop, 250);
  };

  const startEngine = () => {
    if (isRunning.current) return;

    isRunning.current = true;
    isAwaitingNext.current = false;
    resetAnalyzeState();
    setCurrentIdentity(null);
    setEngineState("Starting...");

    // small transition
    setTimeout(() => {
      if (isRunning.current) setEngineState("Detecting...");
    }, 500);

    loop();
  };

  const nextIdentity = () => {
    if (!isRunning.current) return;

    isCooldown.current = false;
    isAwaitingNext.current = false;
    buffer.current = [];
    noFaceStreak.current = 0;
    resetAnalyzeState();
    setCurrentIdentity(null);
    setEngineState("Detecting...");
  };

  const stopEngine = () => {
    isRunning.current = false;
    isAwaitingNext.current = false;
    buffer.current = [];
    noFaceStreak.current = 0;
    resetAnalyzeState();
    setEngineState("Stopped");
  };

  const processTick = async () => {
    if (isCooldown.current || isAwaitingNext.current || !webcamRef.current)
      return;

    const image = webcamRef.current.getScreenshot({
      width: 640,
      quality: 0.72,
    });
    if (!image) return;

    let res;
    try {
      res = await api.processFrame(image);
    } catch (e) {
      console.error("API ERROR:", e);
      return;
    }

    if (!res || res.status === "skip") return;

    // -------- FACE --------
    if (!res.face_detected) {
      noFaceStreak.current += 1;

      if (noFaceStreak.current >= 5) {
        resetAnalyzeState();
        setEngineState("No Face");
      }
      return;
    }

    noFaceStreak.current = 0;

    // -------- LIVENESS --------
    if (res.spoof_detected) {
      setEngineState("Spoof Detected");
      buffer.current = [];
      resetAnalyzeState();
      return;
    }

    if (res.collecting_embeddings) {
      setEngineState("Stabilizing Face...");
      return;
    }

    // -------- NOT RECOGNIZED --------
    if (!res.recognized) {
      if (Date.now() < analyzeGraceUntil.current) {
        setEngineState("Analyzing...");
      } else {
        resetAnalyzeState();
        setEngineState("Scanning...");
      }
      return;
    }

    const id = res.identity?.id;

    if (!id) {
      if (Date.now() < analyzeGraceUntil.current) {
        setEngineState("Analyzing...");
      } else {
        resetAnalyzeState();
        setEngineState("Scanning...");
      }
      return;
    }

    // -------- STABLE MATCH --------
    if (res.stable) {
      await confirmIdentity(
        res.identity,
        res.attendance_marked,
        res.attendance_status,
      );
      return; // ❗ STOP THIS TICK
    }

    // -------- ANALYZING WINDOW --------
    analyzeGraceUntil.current = Date.now() + 1200;
    setEngineState("Analyzing...");
  };

  const confirmIdentity = async (
    identity,
    attendanceMarked = true,
    attendanceStatus = "marked",
  ) => {
    // ❗ HARD LOCK ENGINE (prevents loop spam)
    isCooldown.current = true;
    isAwaitingNext.current = true;

    buffer.current = [];
    resetAnalyzeState();

    setCurrentIdentity(identity);

    setEngineState(
      attendanceMarked ? `✔ Attendance Marked` : `✔ Already Marked`,
    );

    // ✅ UPDATE LEFT PANEL
    setLogs((prev) =>
      [
        {
          name: identity.name,
          time: new Date().toLocaleTimeString(),
          status:
            attendanceStatus === "already_marked"
              ? "Already Marked"
              : "Attendance Marked",
        },
        ...prev,
      ].slice(0, 5),
    );

    return;
  };

  return {
    engineState,
    startEngine,
    stopEngine,
    nextIdentity,
    isRunning: isRunning.current,
    isAwaitingNext: isAwaitingNext.current,
    logs,
    currentIdentity,
  };
};
