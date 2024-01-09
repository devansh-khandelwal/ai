import React, { createContext, useState } from "react";
import { useSpeechSynthesis } from "react-speech-kit";
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { speak, cancel } = useSpeechSynthesis();
  const [volume, setVolume] = useState(50);
  const [messages, setMessages] = useState([
    { text: "Hi, how can I help you today?", isUser: false },
  ]);
  const [newMessage, setNewMessage] = useState(null);
  const [speechRecognition, setSpeechRecognition] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [oldChatsReceived, setOldChatsReceived] = useState(false);

  const [flag, setflag] = useState(false);

  return (
    <AppContext.Provider
      value={{
        messages,
        setMessages,
        newMessage,
        setNewMessage,
        speechRecognition,
        setSpeechRecognition,
        isListening,
        setIsListening,
        flag,
        setflag,
        oldChatsReceived,
        setOldChatsReceived,
        volume,
        setVolume,
        speak,
        cancel,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
