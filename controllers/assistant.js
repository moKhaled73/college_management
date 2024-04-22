const User = require("../models/user");
const Subject = require("../models/subject");
const AssistantSubjects = require("../models/assistantSubjects");
const Attendation = require("../models/attendation");
const { StatusCodes } = require("http-status-codes");
const user = require("../models/user");

const attendForUser = async (req, res) => {
  const assistantId = req.user._id; // id of assistant
  const studentId = req.params.studentId; // id of student
  const subjectId = req.params.subjectId; // id of subject

  // check if subject exist
  const subject = await Subject.findById(subjectId);
  if (!subject) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error("Subject not found");
  }

  // check if assistant exist
  const student = await User.findById(studentId);
  if (!student) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error("Student not found");
  }

  // check if student belong to this assistant for this subject
  const checkSection = await AssistantSubjects.findOne({
    assistant: assistantId,
    subject: subjectId,
    sections: student.section,
  });
  if (!checkSection) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error("Student not belong to this assistant for this subject");
  }

  if (student.band !== subject.band) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error("Student and subject not belong to same band");
  }

  // check if student already attend for this subject before
  const studentAttendSubject = await Attendation.findOne({
    student: studentId,
    subject: subjectId,
  });
  if (studentAttendSubject === null) {
    // here create new attend for this student in this subject
    const newAttend = await Attendation.create({
      student: studentId,
      subject: subjectId,
      attend: [Date.now()],
    });
    newAttend.NumberOfAttend = newAttend.attend.length;
    await newAttend.save();
    res.status(StatusCodes.OK).json(newAttend);
  } else {
    const lastAttend = studentAttendSubject.attend.slice(-1)[0];

    // get the date of the friday day after the last attend
    const dateOfLastAttend = new Date(lastAttend);
    const dayOfWeek = dateOfLastAttend.getDay();
    const diffBetweenFridayAndLastAttend =
      5 - dayOfWeek + (dayOfWeek === 5 ? 7 : 0);
    const weekEnd = dateOfLastAttend.setDate(
      dateOfLastAttend.getDate() + diffBetweenFridayAndLastAttend
    );

    if (Date.now() < weekEnd) {
      res.status(StatusCodes.BAD_REQUEST);
      throw new Error("Student already attend for this subject in this week");
    }
    const updatedAttend = await Attendation.findByIdAndUpdate(
      { student: studentId, subject: subjectId },
      {
        $push: {
          attend: Date.now(),
        },
      },
      {
        new: true,
      }
    );
    updatedAttend.NumberOfAttend = updatedAttend.attend.length;
    await updatedAttend.save();
    res.status(StatusCodes.OK).json(updatedAttend);
  }
};

const getAllSubjectForAssistant = async (req, res) => {
  const subjects = await AssistantSubjects.find({ assistant: req.user._id })
    .select("subject -_id")
    .populate({
      path: "subject",
      model: "Subject",
    });
  res.status(StatusCodes.OK).json(subjects);
};

const getAllSectionsForAssistant = async (req, res) => {
  const assistantId = req.user._id;
  const subjectId = req.params.subjectId;

  const sections = await AssistantSubjects.findOne({
    assistant: assistantId,
    subject: subjectId,
  }).select("sections -_id");
  res.status(StatusCodes.OK).json(sections);
};

const getStudentsForSection = async (req, res) => {
  const assistantId = req.user._id;
  const subjectId = req.params.subjectId;
  const section = req.query.section;

  // check if subject exist
  const subject = await Subject.findById(subjectId);
  if (!subject) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error("Subject not found");
  }

  // check if assistant exist
  const assistant = await User.findById(assistantId);
  if (!assistant) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error("Assistant not found");
  }

  // check if section belong to this assistant
  const checkSection = await AssistantSubjects.findOne({
    assistant: assistantId,
    subject: subjectId,
    sections: section,
  });
  if (!checkSection) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error("Section not belong to this assistant for this subject");
  }

  const students = await User.find({
    section: section,
    band: subject.band,
  }).select("-password");
  res.status(StatusCodes.OK).json(students);
};

module.exports = {
  attendForUser,
  getAllSectionsForAssistant,
  getStudentsForSection,
  getAllSubjectForAssistant,
};
