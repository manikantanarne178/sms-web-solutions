import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Groq from "groq-sdk";
import axios from "axios";
import ExcelJS from "exceljs";

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
      _id: false, // 🔥 prevents _id in subdocuments
      role: String,
      content: String
    }
  ]
});
const registrationSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  projectDetails: String,
  createdAt: { type: Date, default: Date.now }
});

const Registration = mongoose.model("Registration", registrationSchema);

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
  apiKey: process.env.GROQ_API_KEY?.trim()
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

    // Save user message
    chat.messages.push({
      role: "user",
      content: message
    });

    /* 🔥 SANITIZE MESSAGES BEFORE SENDING TO GROQ */
    const cleanMessages = chat.messages.map(m => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content)
    }));

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
        ...cleanMessages
      ],
      temperature: 0.7
    });

    const aiReply =
      completion?.choices?.[0]?.message?.content ||
      "Hello 👋 How can we help you?";

    // Save assistant reply
    chat.messages.push({
      role: "assistant",
      content: aiReply
    });

    await chat.save();

    // Update analytics
    await Analytics.findOneAndUpdate(
      { sessionId },
      {
        $inc: { messageCount: 1 },
        lastActive: new Date()
      },
      { upsert: true }
    );

    // Save lead if price-related
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
    console.error("❌ FULL ERROR:", err.response?.data || err);
    res.json({ reply: "AI error" });
  }
});
/* =========================
   EXPORT REGISTRATIONS
========================= */
app.get("/export-registrations", async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ createdAt: -1 });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Registrations");

    worksheet.columns = [
      { header: "Full Name", key: "fullName", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Phone", key: "phone", width: 20 },
      { header: "Project Details", key: "projectDetails", width: 40 },
      { header: "Date", key: "createdAt", width: 25 }
    ];

    registrations.forEach(reg => {
      worksheet.addRow(reg);
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=registrations.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    console.error("Export Error:", err);
    res.status(500).json({ message: "Export failed" });
  }
});

/* =========================
   REGISTER ROUTE
========================= */
app.post("/register", async (req, res) => {
  try {
    const { fullName, email, phone, projectDetails } = req.body;

    if (!fullName || !email || !phone) {
      return res.status(400).json({ message: "All fields required" });
    }

    await Registration.create({
      fullName,
      email,
      phone,
      projectDetails
    });

    res.json({ message: "Registration successful" });

  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server error" });
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
  console.log(`✅ FREE AI running at port ${PORT}`);
});
