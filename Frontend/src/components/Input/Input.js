import React, { useState, useContext } from "react";
import "./Input.css";
import { AppContext } from "../../utils/Context";

function InputBox() {
  const { setNewMessage, setMessages } = useContext(AppContext);

  const [question, setQuestion] = useState("");
  const submitQuestion = (event) => {
    setQuestion(event.target.value);
  };

  const showQuestion = () => {
    setMessages((messages) => [...messages, { text: question, isUser: true }]);
    setNewMessage(question);
    setQuestion("");
    document.querySelector("input").defaultValue = "";
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && question) {
      showQuestion();
    }
  };

  return (
    <div className="chat_input">
      <input
        id="input"
        placeholder="Enter your message"
        onChange={submitQuestion}
        value={question}
        onKeyPress={(event) => {
          handleKeyPress(event);
        }}
        className="input"
      ></input>
      <button onClick={showQuestion}>
        <div>
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="Microphone">
              <rect width="40" height="40" rx="11" fill="#297BCA" />
              <path
                id="Shape"
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M29.2853 20.2857C29.2853 20.5736 29.1562 20.8303 28.9546 20.9973C28.8981 21.0441 28.8359 21.0838 28.7693 21.1152L11.9764 29.4812C11.6511 29.6432 11.2632 29.5834 10.9977 29.3302C10.7322 29.0771 10.643 28.6819 10.7726 28.3333L13.7641 20.2857L10.7726 12.238C10.643 11.8894 10.7322 11.4942 10.9977 11.2411C11.2632 10.9879 11.6511 10.9281 11.9764 11.0901L28.7692 19.4561C28.8363 19.4877 28.8989 19.5277 28.9557 19.5749C28.9974 19.6095 29.0358 19.6478 29.0705 19.6893C29.2043 19.8491 29.2853 20.0576 29.2853 20.2857ZM24.5464 19.3746L13.2135 13.7287L15.3122 19.3746L24.5464 19.3746ZM15.3122 21.1967L24.5464 21.1967L13.2135 26.8426L15.3122 21.1967Z"
                fill="white"
              />
            </g>
          </svg>
        </div>
      </button>
    </div>
  );
}

export default InputBox;
