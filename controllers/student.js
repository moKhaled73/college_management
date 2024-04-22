const User = require("../models/user");
const Subject = require("../models/subject");
const Attendation = require("../models/attendation");
const { StatusCodes } = require("http-status-codes");
const QRcode = require("qrcode");
const subject = require("../models/subject");

const getStudentInfo = async (req, res) => {
  const studentId = req.user._id;
  const student = await User.findById(studentId);
  res.status(StatusCodes.OK).json({ student });
};

const getAllSubject = async (req, res) => {
  const student = await User.findById(req.user._id);
  const subjects = await subject.find({ band: student.band });

  res.status(StatusCodes.OK).json(subjects);
};

const getAttendation = async (req, res) => {
  const studentId = req.user._id;
  const subjectId = req.params.subjectId;
  const attendation = await Attendation.findOne({
    student: studentId,
    subject: subjectId,
  })
    .populate({
      path: "student",
      model: "User",
    })
    .populate({
      path: "subject",
      model: "Subject",
    });

  if (!attendation) {
    return res
      .status(StatusCodes.OK)
      .send("you are not attend to this subject yet");
  }
  res.status(StatusCodes.OK).json(attendation);
};

module.exports = {
  getStudentInfo,
  getAllSubject,
  getAttendation,
};
