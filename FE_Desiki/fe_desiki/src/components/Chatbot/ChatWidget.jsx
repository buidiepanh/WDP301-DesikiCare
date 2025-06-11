import React, { useEffect, useState, useRef } from "react";
import "./ChatWidget.css";

const ChatWidget = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const messagesEndRef = useRef(null);

  const API_CONFIG = "https://8329-118-69-70-166.ngrok-free.app/api/Chatbot/chatbotConfigs";

  useEffect(() => {
    fetch(API_CONFIG)
      .then(async (res) => {
        const contentType = res.headers.get("content-type");
        console.log("📦 Content-Type:", contentType);

        if (!res.ok) throw new Error("Lỗi phản hồi từ server");

        if (contentType && contentType.includes("text/html")) {
          throw new Error("Phản hồi không hợp lệ");
        }

        const data = await res.json();
        console.log("✅ Dữ liệu chatbot:", data);

        const active = data.chatbotConfigs.find(
          (c) => !c.isDeactivated && c.template === "default"
        );

        if (active) {
          setMessages([{ from: "bot", text: active.initPrompt }]);
        } else {
          setMessages([{ from: "bot", text: "Không tìm thấy chatbot mặc định." }]);
        }
      })
      .catch((err) => {
        console.error("❌ Lỗi khi gọi chatbotConfigs:", err.message);
        setMessages([
          { from: "bot", text: "Không thể tải chatbot. Vui lòng thử lại sau." },
        ]);
      });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const trimmed = userInput.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { from: "user", text: trimmed }]);
    setUserInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Tôi chưa hiểu. Bạn vui lòng hỏi lại." },
      ]);
    }, 1000);
  };

  return (
    <div className="chat-widget-container">
      <div className="chat-widget-header">
        <span>Hỗ trợ khách hàng</span>
        <button className="chat-close-button" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="chat-widget-body">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.from}`}>
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-widget-footer">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Nhập câu hỏi..."
        />
        <button onClick={handleSend}>Gửi</button>
      </div>
    </div>
  );
};

export default ChatWidget;
