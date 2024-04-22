const express = require("express");
const router = express.Router();

const {
  attendForUser,
  getStudentsForSection,
  getAllSectionsForAssistant,
  getAllSubjectForAssistant,
} = require("../controllers/assistant");

const { protect, allowedTo } = require("../middlewares/protect");

router.use(protect, allowedTo("assistant"));

router.get("/students/:subjectId", getStudentsForSection);
router.get("/sections/:subjectId", getAllSectionsForAssistant);
router.get("/subjects", getAllSubjectForAssistant);
router.put("/attend/:subjectId/:studentId", attendForUser);

module.exports = router;
