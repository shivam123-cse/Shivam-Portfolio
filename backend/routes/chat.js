const express = require("express");
const OpenAI = require("openai");
const multer = require("multer");
const rateLimit = require("express-rate-limit");
const Conversation = require("../models/Conversation");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

const router = express.Router();
const upload = multer({ limits: { fileSize: 8 * 1024 * 1024 } }); // 8MB max

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const chatLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
  max: Number(process.env.RATE_LIMIT_MAX) || 60,
  keyGenerator: (req) => req.user?.id || req.ip,
  message: { message: "Rate limit exceeded. Please slow down." },
});

// List all conversations for the logged-in user
router.get("/conversations", protect, async (req, res) => {
  const conversations = await Conversation.find({ user: req.user._id })
    .sort({ updatedAt: -1 })
    .select("title updatedAt createdAt");
  res.json({ conversations });
});

// Get a single conversation with full message history
router.get("/conversations/:id", protect, async (req, res) => {
  const conversation = await Conversation.findOne({ _id: req.params.id, user: req.user._id });
  if (!conversation) return res.status(404).json({ message: "Conversation not found." });
  res.json({ conversation });
});

// Create a new empty conversation
router.post("/conversations", protect, async (req, res) => {
  const conversation = await Conversation.create({ user: req.user._id, title: "New conversation", messages: [] });
  res.status(201).json({ conversation });
});

// Delete a conversation
router.delete("/conversations/:id", protect, async (req, res) => {
  await Conversation.deleteOne({ _id: req.params.id, user: req.user._id });
  res.json({ message: "Conversation deleted." });
});

// Send a message (optionally with an image) and get an AI response
router.post("/conversations/:id/messages", protect, chatLimiter, upload.single("image"), async (req, res) => {
  try {
    const conversation = await Conversation.findOne({ _id: req.params.id, user: req.user._id });
    if (!conversation) return res.status(404).json({ message: "Conversation not found." });

    const { text } = req.body;
    const imageFile = req.file;

    const userMessage = { role: "user", text: text || "" };
    if (imageFile) {
      userMessage.imageUrl = `data:${imageFile.mimetype};base64,${imageFile.buffer.toString("base64")}`;
    }
    conversation.messages.push(userMessage);
    if (conversation.messages.length === 1 && text) {
      conversation.title = text.slice(0, 40);
    }

    // Build message history for OpenAI (last 10 turns for context window control)
    const history = conversation.messages.slice(-10).map((m) => {
      if (m.imageUrl) {
        return {
          role: m.role,
          content: [
            { type: "text", text: m.text || "Describe this image." },
            { type: "image_url", image_url: { url: m.imageUrl } },
          ],
        };
      }
      return { role: m.role, content: m.text };
    });

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o",
      messages: [
        { role: "system", content: "You are AuroraChat, a helpful, concise, and friendly AI assistant." },
        ...history,
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const aiText = completion.choices[0]?.message?.content?.trim() || "I couldn't generate a response.";
    conversation.messages.push({ role: "assistant", text: aiText });
    await conversation.save();

    await User.findByIdAndUpdate(req.user._id, { $inc: { messageCount: 1 } });

    res.json({ reply: aiText, conversation });
  } catch (err) {
    console.error("Chat error:", err.message);
    res.status(500).json({ message: "Failed to generate a response. Please try again." });
  }
});

module.exports = router;
