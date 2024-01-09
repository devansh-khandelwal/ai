import React from "react";
import WebcamFeed from "../Camera/Camera";
import MuteButton from "../Buttons/MuteButton/MuteButton";
import VolumeSlider from "../Volume/VolumeSlider";
import "./VideoComponent.css";

const VideoComponent = () => {
  return (
    <div className="video-container">
      <div className="webcam-feed">
        <WebcamFeed />
      </div>
      <div className="controls">
        <div className="mute-button">
          <MuteButton />
        </div>
        <div className="volume-slider">
          <VolumeSlider />
        </div>
      </div>
    </div>
  );
};

export default VideoComponent;
