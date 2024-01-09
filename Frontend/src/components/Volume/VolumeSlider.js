import React, { useContext } from "react";
import "./VolumeSlider.css";
import { AppContext } from "../../utils/Context";

const VolumeSlider = () => {
  const { volume, setVolume } = useContext(AppContext);

  const handleVolumeChange = (event) => {
    const newVolume = event.target.value;
    setVolume(newVolume);
  };

  return (
    <div className="volume-slider-container">
      <label className="volume-slider-label" htmlFor="volumeSlider">
        Volume
      </label>
      <input
        className="volume-slider-input"
        type="range"
        id="volumeSlider"
        name="volumeSlider"
        min="0"
        max="100"
        step="1"
        value={volume}
        onChange={handleVolumeChange}
      />
      <span className="volume-slider-value">{volume}%</span>
    </div>
  );
};

export default VolumeSlider;
