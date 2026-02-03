import express from "express";
import Todo from "../models/Todo.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all todos for current user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create todo
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    if (!title) return res.status(400).json({ message: "Title required" });

    const todo = await Todo.create({
      user: req.user.id,
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : undefined
    });

    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update todo
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Not found" });
    if (todo.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    const updates = req.body;
    Object.assign(todo, updates);
    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete todo
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Not found" });
    if (todo.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    await todo.remove();
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
