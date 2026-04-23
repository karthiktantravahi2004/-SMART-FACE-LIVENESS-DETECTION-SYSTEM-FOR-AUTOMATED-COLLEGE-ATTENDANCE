const api = {

  processFrame: async (base64Image) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    try {
      const res = await fetch(`/process-frame`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image }),
        signal: controller.signal
      });

      return await res.json();
    } catch {
      return { status: "skip" };
    } finally {
      clearTimeout(timeoutId);
    }
  },

  markAttendance: async (identity) => {
    try {
      // 🔥 GET GPS
      const getLocation = () => {
        return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve(pos.coords),
            (err) => reject(err),
            { enableHighAccuracy: true, timeout: 5000 }
          );
        });
      };

      let coords = null;

      try {
        coords = await getLocation();
      } catch {
        coords = { latitude: null, longitude: null };
      }

      const payload = {
        student_id: identity.id,
        name: identity.name,
        latitude: coords.latitude,
        longitude: coords.longitude
      };

      const res = await fetch(`/mark-attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      return await res.json();

    } catch {
      return { success: false };
    }
  },

  getRecords: async () => {
    const res = await fetch(`/records`);
    return await res.json();
  },

  getAbsentees: async () => {
    const res = await fetch(`/absentees`);
    return await res.json();
  },

  registerStudent: async (data) => {
    const res = await fetch(`/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  }
};

export default api;