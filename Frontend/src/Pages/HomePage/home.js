import { React, useContext, useEffect } from "react";
import videobg from "./../../videos/bg_video.mp4";
import Vector from "./../../images/Vector.svg";
import "./home.css";
import VideoComponent from "./../../components/VideoOutput_1/VideoComponent";
import ChatButton from "./../../components/Buttons/ChatButton/ChatButton";
import ChatMsg from "./../../components/Messages/Messages";
import PauseButton from "./../../components/Buttons/PauseButton/PauseButton";
import { AppContext } from "./../../utils/Context";
import VideoComponent2 from "./../../components/VideoOutput_2/VideoComponent2";
import InputBox from "./../../components/Input/Input";
import { useNavigate } from "react-router-dom";

const Home = ({ token }) => {
  let navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, []);

  const { flag } = useContext(AppContext);
  const Video = () => {
    return (
      <div>
        <div className="vid_container">
          <VideoComponent />
        </div>
        <div className="chat_container">
          <div className="chat_msg">
            <ChatMsg token={token} />
            <ChatButton />
          </div>
          <PauseButton />
        </div>
      </div>
    );
  };

  const Chat = () => {
    return (
      <div>
        <div className="chat_box">
          <ChatMsg token={token} />
          <InputBox />
        </div>
        <div className="chat_container">
          <VideoComponent2 />
          <PauseButton />
        </div>
      </div>
    );
  };

  return (
    <div className="chat">
      <video autoPlay loop muted>
        <source src={videobg} type="video/mp4"></source>
      </video>
      <div className="navbar">
        <img className="img" src={Vector} alt="vector" />
      </div>
      <div className="main_container">{flag ? Chat() : Video()}</div>
    </div>
  );
};

export default Home;
