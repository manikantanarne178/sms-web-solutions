import { useState, useRef, useEffect } from "react";

import "./chat.css";

type Message = {
  from: "user" | "bot";
  text: string;
};

type Language = "en" | "te" | "hi" | "ta" | "kn" | "ml";

const API_URL = "https://sms-web-solutions.onrender.com/chat";
const WHATSAPP_LINK = "https://wa.me/918074407557";
const EMAIL = "smswebsolutions3@gmail.com";

/* =========================
   SESSION ID (AI MEMORY)
   ========================= */
const getSessionId = () => {
  let id = localStorage.getItem("sms_session");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("sms_session", id);
  }
  return id;
};

const sessionId = getSessionId();

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState<Language>("en");
  
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "bot",
      text: "Hi 👋 I’m SMS AI.\nHow can I help you today?"
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  /* =========================
     SMART LANGUAGE DETECTION
     ========================= */
  const detectLanguage = (text: string): Language => {
    const msg = text.toLowerCase();

    if (/[\u0C00-\u0C7F]/.test(text)) return "te";
    if (/[\u0900-\u097F]/.test(text)) return "hi";
    if (/[\u0B80-\u0BFF]/.test(text)) return "ta";
    if (/[\u0C80-\u0CFF]/.test(text)) return "kn";
    if (/[\u0D00-\u0D7F]/.test(text)) return "ml";

    if (
      msg.includes("meeru") ||
      msg.includes("naku") ||
      msg.includes("kavali") ||
      msg.includes("undi")
    )
      return "te";

    if (
      msg.includes("mujhe") ||
      msg.includes("chahiye") ||
      msg.includes("kaise") ||
      msg.includes("hai")
    )
      return "hi";

    if (
      msg.includes("unga") ||
      msg.includes("venum") ||
      msg.includes("irukku")
    )
      return "ta";

    if (
      msg.includes("beku") ||
      msg.includes("ide") ||
      msg.includes("nimma")
    )
      return "kn";

    if (
      msg.includes("venam") ||
      msg.includes("undu") ||
      msg.includes("njan")
    )
      return "ml";

    return "en";
  };

  /* =========================
     SEND MESSAGE
     ========================= */
const sendMessage = async (customText?: string) => {
  const text = customText ?? input;
  if (!text.trim()) return;

  const detectedLang = detectLanguage(text);
  setLanguage(detectedLang);

  const userMessage: Message = { from: "user", text };

  const updatedMessages: Message[] = [...messages, userMessage];
  setMessages(updatedMessages);

  setInput("");
  setTyping(true);

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
        language: detectedLang,
        sessionId
      })
    });

    if (!res.ok) throw new Error("Backend error");

    const data = await res.json();

    const botMessage: Message = {
      from: "bot",
      text: String(data.reply)
    };

    const newMessages: Message[] = [...updatedMessages, botMessage];
    setMessages(newMessages);

    // 🔥 WhatsApp redirect logic
    const lower = text.toLowerCase();

    if (
      lower.includes("price") ||
      lower.includes("cost") ||
      lower.includes("quotation") ||
      lower.includes("contact")
    ) {
      setTimeout(() => {
        window.open(WHATSAPP_LINK, "_blank");
      }, 2000);
    }

    if (newMessages.length >= 8) {
      setTimeout(() => {
        window.open(WHATSAPP_LINK, "_blank");
      }, 3000);
    }

  } catch {
    const errorMessage: Message = {
      from: "bot",
      text:
        "Sorry, something went wrong. Please contact us on WhatsApp."
    };

    setMessages(prev => [...prev, errorMessage]);
  }

  setTyping(false);
};


  return (
    <>
      <div className="chat-bubble" onClick={() => setOpen(!open)}>
        💬
      </div>

      {open && (
        <div className="chat-box">
          <div className="chat-header">
            Ask SMS AI ({language.toUpperCase()})
            <span onClick={() => setOpen(false)}>✕</span>
          </div>

          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.from}`}>
                {m.text.split("\n").map((line, j) => (
                  <div key={j}>{line}</div>
                  
                ))}
                
              </div>
            ))}

            {typing && (
              <div className="msg bot typing">
                SMS AI is typing...
              </div>
            )}
             <div ref={messagesEndRef} />
          </div>

          <div className="quick-replies">
            <button onClick={() => sendMessage("Tell me about your company")}>
              About
            </button>
            <button onClick={() => sendMessage("What services do you offer")}>
              Services
            </button>
            <button onClick={() => sendMessage("What is the price")}>
              Pricing
            </button>
            <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
            <a href={`mailto:${EMAIL}`}>
              Email
            </a>
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
            />
            <button onClick={() => sendMessage()}>Send</button>
          </div>
          
        </div>
      )}
    </>
  );
};

export default ChatWidget;
