import React, { useEffect, useRef } from "react";
import Webcam from "react-webcam";
import "./Camera.css";

const WebcamFeed = () => {
  const webcamRef = useRef(null);

  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        if (webcamRef.current) {
          webcamRef.current.video.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    };

    initCamera();

    return () => {
      if (webcamRef.current) {
        const stream = webcamRef.current.video.srcObject;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop());
        }
      }
    };
  }, []);

  return (
    <div className="webcam-container">
      <Webcam ref={webcamRef} />
    </div>
  );
};

export default WebcamFeed;
