const express = require("express");
const router = express.Router();

const {
  getStudentInfo,
  getAllSubject,
  getAttendation,
} = require("../controllers/student");
const { protect, allowedTo } = require("../middlewares/protect");

router.use(protect, allowedTo("student"));
router.get("/", getStudentInfo);
router.get("/subjects", getAllSubject);
router.get("/attendation/:subjectId", getAttendation);

module.exports = router;
