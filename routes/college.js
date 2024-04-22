const express = require("express");
const router = express.Router();

const {
  createUser,
  getAllAssistants,
  getAllStudents,
  assignSubjectsforAssistant,
  getAllSubjectsForAssistant,
  removeSubjectfromAssistant,
  revomeSectionsfromAssistant,
} = require("../controllers/college");
const { protect, allowedTo } = require("../middlewares/protect");

router.use(protect, allowedTo("manager"));

router.post("/", createUser);
router.get("/assistants", getAllAssistants);
router.get("/students", getAllStudents);

router.post(
  "/assign-subjects/:assistantId/:subjectId",
  assignSubjectsforAssistant
);
router.delete(
  "/remove-subject/:assistantId/:subjectId",
  removeSubjectfromAssistant
);
router.put(
  "/remove-section/:assistantId/:subjectId",
  revomeSectionsfromAssistant
);
router.get("/assistants-subjects", getAllSubjectsForAssistant);

module.exports = router;
