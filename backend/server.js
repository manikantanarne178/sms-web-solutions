import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import axios from "axios";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

console.log("GROQ KEY EXISTS:", !!process.env.GROQ_API_KEY);

app.get("/", (req, res) => {
  res.send("FREE AI Backend running 🚀");
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.json({ reply: "Message missing" });
    }

    const completion = await groq.chat.completions.create({
     model: "llama-3.1-8b-instant",

      messages: [
        {
          role: "system",
  content: `
You are SMS AI, the official assistant of SMS Digital Solutions.

Company details:
- Company Name: SMS Digital Solutions
- We build professional websites and digital solutions for businesses and individuals.
- Services include:
  • Business websites
  • Landing pages
  • Portfolio websites
  • E-commerce websites
  • Custom web applications
- Our goal is to help businesses grow online with modern, fast, and affordable solutions.
- We do NOT share pricing in chat.
- If user asks about cost or price, politely redirect them to WhatsApp or Email.
- Tone: friendly, professional, simple English with light Telugu mix.

When user asks "tell me about your company" or similar,
you MUST explain SMS Digital Solutions clearly.
`

        },
        {
          role: "user",
          content: String(message)
        }
      ],
      temperature: 0.7
    });

    res.json({
      reply:
        completion.choices?.[0]?.message?.content ||
        "AI did not respond"
    });
  } catch (err) {
    console.error(
      "❌ GROQ FULL ERROR:",
      err?.response?.data || err?.message || err
    );

    res.json({
      reply: "⚠️ AI error (Groq backend)"
    });
  }
});
// ===============================
// WHATSAPP WEBHOOK VERIFICATION
// ===============================

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


// ===============================
// RECEIVE WHATSAPP MESSAGES
// ===============================

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

        // 🔥 Use YOUR EXISTING GROQ AI
        const completion = await groq.chat.completions.create({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content: `
You are SMS AI, the official assistant of SMS Digital Solutions.
Do not share pricing in chat.
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
          completion.choices?.[0]?.message?.content ||
          "Hello 👋 How can we help you?";

        // 🔥 SEND REPLY BACK TO WHATSAPP
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
    console.error("❌ WhatsApp Error:", err.response?.data || err.message);
    res.sendStatus(500);
  }
});

app.listen(PORT, () => {
  console.log(`✅ FREE AI running at http://localhost:${PORT}`);
});
