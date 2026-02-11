import { useState } from "react";
import "./chat.css";

type Message = {
  from: "user" | "bot";
  text: string;
};

const API_URL = "https://sms-web-solutions.onrender.com/chat";

const WHATSAPP_LINK = "https://wa.me/91XXXXXXXXXX"; // replace number
const EMAIL = "contact@smsdigital.com"; // replace email

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "bot",
      text:
        "Hi 👋 I’m SMS AI.\n" +
        "Nenu meeku mana services gurinchi clarity ivvadaniki vachanu 😊\n" +
        "How can I help you today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  /* =========================
     LOCAL FALLBACK LOGIC
     ========================= */
  const getBotReply = (text: string): string => {
    const msg = text.toLowerCase();

    if (msg.includes("about") || msg.includes("company") || msg.includes("tell")) {
      return (
        "🏢 **SMS Digital Solutions**\n\n" +
        "We help businesses grow online 🌐\n" +
        "• Websites\n• Landing Pages\n• Portfolios\n• E-commerce\n• Custom Web Apps\n\n" +
        "Nenu awareness kosam matrame 😊\n" +
        "Detailed discussion kosam WhatsApp / Email lo contact cheyandi."
      );
    }

    if (msg.includes("service")) {
      return (
        "🚀 Mana services:\n\n" +
        "• Business Websites\n" +
        "• Startup Landing Pages\n" +
        "• Personal Portfolios\n" +
        "• Online Stores\n\n" +
        "Meeru em plan chestunnaru? 😊"
      );
    }

    if (
      msg.includes("price") ||
      msg.includes("cost") ||
      msg.includes("budget")
    ) {
      return (
        "💰 Pricing project requirements batti change avtundi.\n\n" +
        "Exact cost telusukovalante WhatsApp lo matladadam best 📱"
      );
    }

    if (msg.includes("contact")) {
      return (
        "📞 Contact cheyandi:\n\n" +
        "WhatsApp or Email lo easy ga reach avvachu 😊\n" +
        `📧 ${EMAIL}`
      );
    }

    return (
      "😊 Mee message ardham ayyindi.\n" +
      "Nenu basic clarity ivvagalanu.\n" +
      "Detailed discussion kosam WhatsApp lo matladadam better 👍"
    );
  };

  /* =========================
     SEND MESSAGE (FINAL)
     ========================= */
  const sendMessage = async (customText?: string) => {
    const text = customText ?? input;
    if (!text.trim()) return;

    setMessages(prev => [...prev, { from: "user", text }]);
    setInput("");
    setTyping(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });

      if (!res.ok) throw new Error("Backend error");

      const data = await res.json();

      setMessages(prev => [
        ...prev,
        {
          from: "bot",
          text:
            typeof data.reply === "string"
              ? data.reply
              : getBotReply(text)
        }
      ]);
    } catch {
      // 🔥 graceful fallback (NO scary error)
      setMessages(prev => [
        ...prev,
        {
          from: "bot",
          text: getBotReply(text)
        }
      ]);
    }

    setTyping(false);
  };

  /* =========================
     UI
     ========================= */
  return (
    <>
      <div className="chat-bubble" onClick={() => setOpen(!open)}>
        💬
      </div>

      {open && (
        <div className="chat-box">
          <div className="chat-header">
            Ask SMS AI
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
                SMS AI is typing<span className="dots">...</span>
              </div>
            )}
          </div>

          {/* QUICK REPLIES */}
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
