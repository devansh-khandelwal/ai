import React, { useEffect, useContext, useState, useRef } from "react";
import "./Messages.css";
import { AppContext } from "../../utils/Context";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/Axios";

const ChatMsg = ({ token }) => {
  const [user, setUser] = useState("");

  const {
    messages,
    setMessages,
    setNewMessage,
    setSpeechRecognition,
    newMessage,
    oldChatsReceived,
    setOldChatsReceived,
    volume,
    speak,
  } = useContext(AppContext);

  let navigate = useNavigate();

  useEffect(() => {
    if (oldChatsReceived === false && user) {
      getOldChats();
    }
  }, [user]);

  try {
    if (user === "") {
      var temp = JSON.parse(token);
      setUser(temp);
      console.log(user);
    }
  } catch (err) {
    console.log("no defined user: ", err);
    navigate("/");
  }

  const chatRef = useRef(null);
  useEffect(() => {
    if (chatRef.current) {
      console.log("scrollHeight:", chatRef.current.scrollHeight);
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const getOldChats = async () => {
    console.log("get old chats for user: ");
    console.log(user);
    if (user) {
      console.log("hello user");
      await axios
        .post("/api/getUserConvo", {
          token: user.token,
          userId: user._id,
        })
        .then(function (response) {
          var oldMessages = response.data.data;
          console.log(oldMessages);
          oldMessages.reverse();

          oldMessages.forEach((ele) => {
            setMessages((messages) => [
              ...messages,
              { text: ele.message, isUser: true },
            ]);
            setMessages((messages) => [
              ...messages,
              { text: ele.reply, isUser: false },
            ]);
          });
        })
        .catch((err) => {
          console.log(err);
          alert("some error occured in fetchinng old convos");
        });
    }
    setOldChatsReceived(true);
  };

  useEffect(() => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleSendMessage(transcript);
      console.log("Recognized speech!");
    };
    setSpeechRecognition(recognition);
  }, []);

  useEffect(() => {
    const socket = io("http://localhost:8080/");
    socket.on("connected", () => console.log("connected"));

    if (newMessage) {
      console.log("Question: " + newMessage);
      var req = {
        userId: user._id,
        message: newMessage,
      };

      setTimeout(() => {
        socket.emit("request", req);
        socket.on("reply", (reply) => {
          console.log("Reply: " + reply);
          setMessages((messages) => [
            ...messages,
            { text: reply, isUser: false },
          ]);
          tts(reply);
        });
      }, 60);
    }
    setNewMessage(null);
  }, [newMessage]);

  const handleSendMessage = (msg) => {
    setMessages((messages) => [...messages, { text: msg, isUser: true }]);
    setNewMessage(msg);
  };
  const tts = (reply) => {
    speak({ text: reply, volume });
  };

  return (
    <div className="chat_bot">
      <div className="chat-container">
        <div className="chat-messages" ref={chatRef}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={message.isUser ? "user-message" : "bot-message"}
            >
              {message.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatMsg;
