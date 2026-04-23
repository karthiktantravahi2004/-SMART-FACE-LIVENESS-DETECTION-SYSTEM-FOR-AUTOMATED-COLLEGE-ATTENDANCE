import React, { useEffect, useRef } from 'react';

const WebcamFeed = React.forwardRef(({ className }, ref) => {
  const videoRef = useRef(null);

  useEffect(() => {
    let stream = null;

    const startVideo = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user"
          }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera error:", err);
      }
    };

    startVideo();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  React.useImperativeHandle(ref, () => ({
    getScreenshot: (options = {}) => {
      if (!videoRef.current || videoRef.current.readyState !== 4) return null;

      const targetWidth = options.width || 480;
      const quality = typeof options.quality === 'number' ? options.quality : 0.55;
      const scale = targetWidth / videoRef.current.videoWidth;
      const targetHeight = Math.max(1, Math.round(videoRef.current.videoHeight * scale));

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      return canvas.toDataURL('image/jpeg', quality);
    }
  }));

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className={className}
    />
  );
});

export default WebcamFeed;