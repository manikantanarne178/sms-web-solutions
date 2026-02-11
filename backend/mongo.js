import mongoose from "mongoose";

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
export const Chat = mongoose.model("Chat", chatSchema);
export const Lead = mongoose.model("Lead", leadSchema);
export const Analytics = mongoose.model("Analytics", analyticsSchema);
