
import express from "express";
import Task from "../models/Task.js";
import { protect } from "../middleware/authMiddleware.js";
import { io } from "../server.js";

const router = express.Router();


// CREATE TASK
router.post("/", protect, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title required" });
    }


    const task = await Task.create({
      title,
      description,
       status: "todo",
      user: req.user._id,
    });

    // 🔥 Real-time event
    io.emit("taskCreated", task);

    res.status(201).json(task);

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
}catch (error) {
  console.log("TASK ERROR:", error);
  res.status(500).json({ message: error.message });
}
});


// GET ALL TASKS
router.get("/", protect, async (req, res) => {
  try {

    const tasks = await Task.find({ user: req.user._id });

    res.json(tasks);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// GET SINGLE TASK
router.get("/:id", protect, async (req, res) => {
  try {

    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// UPDATE TASK
router.put("/:id", protect, async (req, res) => {
  try {

    const { title, description, status } = req.body;

    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;

    const updatedTask = await task.save();

    // 🔥 Real-time event
    io.emit("taskUpdated", updatedTask);

    res.json(updatedTask);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// DELETE TASK
router.delete("/:id", protect, async (req, res) => {
  try {

    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await task.deleteOne();

    // 🔥 Real-time event
    io.emit("taskDeleted", req.params.id);

    res.json({ message: "Task deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// UPDATE STATUS
router.patch("/:id/status", protect, async (req, res) => {
  try {

    const { status } = req.body;


     const allowedStatus = ["todo","in-progress","done"]

    if(!allowedStatus.includes(status)){
      return res.status(400).json({message:"Invalid status"})
    }


    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.status = status;

    const updatedTask = await task.save();

    // 🔥 Real-time event
    io.emit("taskStatusUpdated", updatedTask);

    res.json(updatedTask);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;