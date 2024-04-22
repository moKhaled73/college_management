const express = require("express");
const router = express.Router();

const {
  createSubject,
  getSubjects,
  getSubject,
  updateSubject,
  deleteSubject,
} = require("../controllers/subject");
const { protect, allowedTo } = require("../middlewares/protect");

router.post("/", protect, allowedTo("manager"), createSubject);
router.get("/", protect, allowedTo("manager"), getSubjects);
router.get("/:id", protect, allowedTo("manager"), getSubject);
router.put("/:id", protect, allowedTo("manager"), updateSubject);
router.delete("/:id", protect, allowedTo("manager"), deleteSubject);

module.exports = router;
