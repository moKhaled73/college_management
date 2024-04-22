const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasksForStudent,
  getTasks,
  updateTask,
  deleteTask,
} = require("../controllers/task");
const { protect, allowedTo } = require("../middlewares/protect");

router.post("/:subjectId", protect, allowedTo("assistant"), createTask);
router.get("/student", protect, allowedTo("student"), getTasksForStudent);
router.get("/:subjectId", protect, allowedTo("assistant"), getTasks);
router.put("/:id", protect, allowedTo("assistant"), updateTask);
router.delete("/:id", protect, allowedTo("assistant"), deleteTask);

module.exports = router;
