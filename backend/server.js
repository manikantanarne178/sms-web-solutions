import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Groq from "groq-sdk";
import axios from "axios";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/* =========================
   MONGODB CONNECTION
   ========================= */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

/* =========================
   SCHEMAS
   ========================= */
const chatSchema = new mongoose.Schema({
  sessionId: String,
  messages: [
    {
      role: String,
      content: String
    }
  ]
});

const leadSchema = new mongoose.Schema({
  sessionId: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

const analyticsSchema = new mongoose.Schema({
  sessionId: String,
  messageCount: { type: Number, default: 0 },
  lastActive: Date
});

/* =========================
   MODELS
   ========================= */
const Chat = mongoose.model("Chat", chatSchema);
const Lead = mongoose.model("Lead", leadSchema);
const Analytics = mongoose.model("Analytics", analyticsSchema);

/* =========================
   GROQ SETUP
   ========================= */
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

console.log("GROQ KEY EXISTS:", !!process.env.GROQ_API_KEY);

/* =========================
   ROOT ROUTE
   ========================= */
app.get("/", (req, res) => {
  res.send("FREE AI Backend running 🚀");
});

/* =========================
   CHAT ROUTE
   ========================= */
app.post("/chat", async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message) {
      return res.json({ reply: "Message missing" });
    }

    if (!sessionId) {
      return res.json({ reply: "Session missing" });
    }

    let chat = await Chat.findOne({ sessionId });

    if (!chat) {
      chat = new Chat({
        sessionId,
        messages: []
      });
    }

    chat.messages.push({
      role: "user",
      content: message
    });

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
You are SMS AI, official assistant of SMS Digital Solutions.
Do not share pricing.
If user asks price, politely redirect to WhatsApp.
Tone: professional, friendly.
`
        },
        ...chat.messages
      ],
      temperature: 0.7
    });

    const aiReply =
      completion?.choices?.[0]?.message?.content ||
      "Hello 👋 How can we help you?";

    chat.messages.push({
      role: "assistant",
      content: aiReply
    });

    await chat.save();

    await Analytics.findOneAndUpdate(
      { sessionId },
      {
        $inc: { messageCount: 1 },
        lastActive: new Date()
      },
      { upsert: true }
    );

    if (
      message.toLowerCase().includes("price") ||
      message.toLowerCase().includes("cost") ||
      message.toLowerCase().includes("website")
    ) {
      await Lead.create({
        sessionId,
        message
      });
    }

    res.json({ reply: aiReply });

  } catch (err) {
    console.error("❌ FULL ERROR:", err);
    res.json({ reply: "AI error" });
  }
});

/* ===============================
   WHATSAPP WEBHOOK VERIFY
=============================== */
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verified");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

/* ===============================
   RECEIVE WHATSAPP MESSAGE
=============================== */
app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;

    if (body.object) {
      const message =
        body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

      if (message) {
        const from = message.from;
        const userText = message.text?.body;

        console.log("📩 WhatsApp User:", userText);

        const completion = await groq.chat.completions.create({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content: `
You are SMS AI, official assistant of SMS Digital Solutions.
Do not share pricing.
If asked about price, redirect to WhatsApp or Email.
Tone: friendly + light Telugu mix.
`
            },
            {
              role: "user",
              content: userText
            }
          ],
          temperature: 0.7
        });

        const aiReply =
          completion?.choices?.[0]?.message?.content ||
          "Hello 👋 How can we help you?";

        await axios.post(
          `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`,
          {
            messaging_product: "whatsapp",
            to: from,
            type: "text",
            text: { body: aiReply },
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      res.sendStatus(200);
    }
  } catch (err) {
    console.error("❌ WhatsApp FULL ERROR:", err.response?.data || err);
    res.sendStatus(500);
  }
});

/* =========================
   START SERVER
   ========================= */
app.listen(PORT, () => {
  console.log(`✅ FREE AI running at http://localhost:${PORT}`);
});
