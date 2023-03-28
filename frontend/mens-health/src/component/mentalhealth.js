import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/chatBot.css";

const ChatBotComponent = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isError, setIsError] = useState(false);

  const conversation = [
    {
      role: "system",
      content:
        "You are an AI language model trained to provide empathetic, informative, and supportive responses related to men's mental health. Keep in mind that you are not a professional therapist, but you can offer guidance and resources.",
    },
    {
      role: "assistant",
      content:
        "Welcome to Men's Mental Health Support! I'm here to listen and offer support for any concerns you have related to mental health. Please feel free to share what's on your mind, and I'll do my best to help you. Remember, I am an AI language model and not a professional therapist, but I'll try to provide guidance and resources that may assist you. If you're in a crisis or need urgent professional help, please contact a mental health professional or a helpline in your area.",
    },
  ];

  useEffect(() => {
    const welcomeMessage = {
      id: 0,
      message: conversation[1].content,
      user: false,
    };
    setMessages([welcomeMessage]);
  }, []);

  const formatConversation = () => {
    return conversation
      .concat(
        messages.map((message) => ({
          role: message.user ? "user" : "assistant",
          content: message.message,
        }))
      )
      .map((message) => `${message.role}: ${message.content}`)
      .join("\n");
  };

  const askQuestion = async () => {
    setIsError(false);
    const formattedConversation = formatConversation();
    const response = await axios.post(
      //"https://api.openai.com/v1/engines/text-davinci-003/completions",
      {
        prompt: `${formattedConversation}\nuser: ${inputValue}\nassistant:`,
        temperature: 0.7,
        max_tokens: 2000,
        top_p: 1,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${"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"}`,
        },
      }
    );
    if (response.data.choices.length > 0) {
      const message = {
        id: messages.length,
        message: inputValue,
        user: true,
      };
      const botMessage = {
        id: messages.length + 1,
        message: response.data.choices[0].text.trim(),
        user: false,
      };
      setMessages([...messages, message, botMessage]);
    }
    setInputValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      sendMessage();
    }
  };

  const sendMessage = () => {
    if (inputValue.trim() !== "") {
      askQuestion();
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">Men's Mental Health AI Chatbot</div>
      <div className="chatbot-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chatbot-message ${msg.user ? "user" : "bot"}`}
          >
            {msg.message}
          </div>
        ))}
        {isError && (
          <div className="chatbot-message bot">
            Sorry, there was an error with the chatbot. Please try again later.
          </div>
        )}
      </div>
      <div className="chatbot-input">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="What's on your mind..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="input-group-append">
            <button
              className="btn btn-primary"
              type="button"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBotComponent;
