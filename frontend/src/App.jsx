import { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
const BOT_AVATAR = "🤖";
const USER_AVATAR = "🧑";

const initialMessages = [
  {
    id: 1,
    role: "assistant",
    text: "Hey there! 👋 I'm your assistant. How can I help you today?",
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  },
];

function TypingIndicator() {
  return (
    <div className="typing-indicator">
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
}

function Message({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`message-row ${isUser ? "user-row" : "assistant-row"}`}>
      {!isUser && <div className="avatar bot-avatar">{BOT_AVATAR}</div>}
      <div className={`bubble ${isUser ? "user-bubble" : "assistant-bubble"}`}>
        <p className="bubble-text">{msg.text}</p>
        <span className="bubble-time">{msg.time}</span>
      </div>
      {isUser && <div className="avatar user-avatar">{USER_AVATAR}</div>}
    </div>
  );
}

export default function App() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const getTime = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  /*const simulateBotReply = () => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "assistant",
          text: "Got it! Let me think about that.",
          time: getTime(),
        },
      ]);
      setIsTyping(false);
    }, 1400);
  };*/

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg = {
      id: Date.now(),
      role: "user",
      text: trimmed,
      time: getTime(),
    };
    socket.emit("message", userMsg.text);
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    setInput("");

    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    //simulateBotReply();
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  useEffect(() => {
    let socketInstance = io("http://localhost:3000");
    setSocket(socketInstance);

    /*socketInstance.on("ai-response-message", (response) => {
      setIsTyping(false);
      const botMessage = {
        id: Date.now() + 1,
        text: response,
        timestamp: new Date().toLocaleTimeString(),
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
    });*/
    socketInstance.on("ai-response-message", ({ response }) => {
      setIsTyping(false);

      const botMessage = {
        id: Date.now() + 1,
        role: "assistant",
        text: response,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, botMessage]);
    });
  }, []);
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg-deep: #0d0f14;
          --bg-surface: #13161e;
          --bg-card: #1a1e2a;
          --bg-input: #1f2333;
          --accent: #6c63ff;
          --user-bubble: linear-gradient(135deg, #6c63ff 0%, #8b5cf6 100%);
          --bot-bubble: #1f2333;
          --text-primary: #e8eaf0;
          --text-muted: #4a4f6a;
          --border: rgba(108, 99, 255, 0.18);
          --font-main: 'Sora', sans-serif;
        }

        html, body, #root { height: 100%; width: 100%; background: var(--bg-deep); font-family: var(--font-main); color: var(--text-primary); }

        .chat-shell { display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 16px; }
        .chat-window { display: flex; flex-direction: column; width: 100%; max-width: 780px; height: min(88vh, 820px); background: var(--bg-surface); border-radius: 24px; border: 1px solid var(--border); overflow: hidden; position: relative; }

        .chat-header { display: flex; align-items: center; gap: 14px; padding: 18px 24px; background: var(--bg-card); border-bottom: 1px solid var(--border); }
        .header-icon { width: 44px; height: 44px; border-radius: 14px; background: linear-gradient(135deg, var(--accent), #8b5cf6); display: flex; align-items: center; justify-content: center; font-size: 20px; }

        .messages-area { flex: 1; overflow-y: auto; padding: 24px 20px; display: flex; flex-direction: column; gap: 14px; }
        .message-row { display: flex; align-items: flex-end; gap: 10px; }
        .user-row { flex-direction: row-reverse; }

        .avatar { width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
        .bot-avatar { background: var(--bg-input); border: 1px solid var(--border); }
        .user-avatar { background: linear-gradient(135deg, var(--accent), #8b5cf6); }

        .bubble { max-width: 68%; padding: 12px 16px; border-radius: 18px; }
        .user-bubble { background: var(--user-bubble); border-bottom-right-radius: 4px; }
        .assistant-bubble { background: var(--bot-bubble); border: 1px solid var(--border); border-bottom-left-radius: 4px; }
        .bubble-text { font-size: 14.5px; line-height: 1.6; }
        .bubble-time { font-size: 10px; opacity: 0.5; margin-top: 4px; display: block; }

        .typing-indicator span { width: 7px; height: 7px; border-radius: 50%; background: #a89eff; display: inline-block; animation: bounce 1.3s infinite; margin: 0 2px; }
        @keyframes bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }

        .input-zone { padding: 16px 20px 20px; background: var(--bg-card); border-top: 1px solid var(--border); }
        .input-row { display: flex; align-items: center; gap: 12px; background: var(--bg-input); border: 1.5px solid var(--border); border-radius: 16px; padding: 8px 12px; }
        
        .chat-input { flex: 1; background: transparent; border: none; outline: none; color: var(--text-primary); resize: none; max-height: 120px; font-family: inherit; padding: 8px 0; }

        /* --- FIXED SEND BUTTON & ICON --- */
        .send-btn {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--accent), #8b5cf6);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          padding: 0;
          transition: transform 0.2s;
        }
        .send-btn:hover:not(:disabled) { transform: scale(1.05); }
        .send-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        
        .send-icon {
          width: 20px;
          height: 20px;
          fill: #ffffff !important; /* Force white color */
          display: block;
        }

        .input-hint { text-align: center; font-size: 11px; color: var(--text-muted); margin-top: 8px; }
      `}</style>

      <div className="chat-shell">
        <div className="chat-window">
          <header className="chat-header">
            <div className="header-icon">🤖</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>Nova Assistant</div>
              <div style={{ fontSize: "12px", color: "#4ade80" }}>online</div>
            </div>
          </header>

          <div className="messages-area">
            {messages.map((msg) => (
              <Message key={msg.id} msg={msg} />
            ))}

            {isTyping && (
              <div className="message-row">
                <div className="avatar bot-avatar">{BOT_AVATAR}</div>
                <div className="bubble assistant-bubble">
                  <TypingIndicator />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="input-zone">
            <div className="input-row">
              <textarea
                ref={inputRef}
                className="chat-input"
                placeholder="Type a message..."
                value={input}
                rows={1}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = `${Math.min(
                    e.target.scrollHeight,
                    120
                  )}px`;
                }}
                onKeyDown={handleKeyDown}
              />
              <button
                className="send-btn"
                onClick={handleSend}
                disabled={!input.trim()}
              >
                {/* Fixed SVG with explicit fill */}
                <svg
                  className="send-icon"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z"
                    fill="white"
                  />
                </svg>
              </button>
            </div>
            <p className="input-hint">
              Enter to send • Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
