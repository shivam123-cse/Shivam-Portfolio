const express = require("express");
const User = require("../models/User");
const Conversation = require("../models/Conversation");
const { protect, requireRole } = require("../middleware/auth");

const router = express.Router();

router.use(protect, requireRole("admin"));

// List all users
router.get("/users", async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json({ users });
});

// Update a user's role or active status
router.patch("/users/:id", async (req, res) => {
  const { role, isActive } = req.body;
  const update = {};
  if (role) update.role = role;
  if (typeof isActive === "boolean") update.isActive = isActive;

  const user = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select("-password");
  if (!user) return res.status(404).json({ message: "User not found." });
  res.json({ user });
});

// Delete a user
router.delete("/users/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted." });
});

// High-level analytics for the admin dashboard
router.get("/analytics", async (req, res) => {
  const [totalUsers, totalConversations, activeToday] = await Promise.all([
    User.countDocuments(),
    Conversation.countDocuments(),
    User.countDocuments({ lastLoginAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }),
  ]);

  const messageAgg = await Conversation.aggregate([
    { $project: { count: { $size: "$messages" } } },
    { $group: { _id: null, total: { $sum: "$count" } } },
  ]);

  res.json({
    totalUsers,
    totalConversations,
    activeToday,
    totalMessages: messageAgg[0]?.total || 0,
  });
});

module.exports = router;
