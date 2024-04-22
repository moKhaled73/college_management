const User = require("../models/user");
const Subject = require("../models/subject");
const AssistantSubjects = require("../models/assistantSubjects");
const { StatusCodes } = require("http-status-codes");
const QRcode = require("qrcode");
const ApiFeatures = require("../utils/apiFeatures");

const createUser = async (req, res) => {
  // check for every new user if its student or not and if his email already exist
  for (const user of req.body) {
    const { email, role, section, band } = user;
    if ((!role || role === "student") && !section && !band) {
      res.status(StatusCodes.BAD_REQUEST);
      throw new Error("Student must have section and band");
    }
    const userExist = await User.findOne({ email });
    if (userExist) {
      res.status(StatusCodes.BAD_REQUEST);
      throw new Error("User already exists");
    }
  }

  // create new users
  let newUsers = await User.create(req.body);

  // generate QR code for students
  for (const user of newUsers) {
    if (user.role === "student") {
      const qrCode = await QRcode.toDataURL(user._id.toString());
      user.QRcode = qrCode;
      await user.save();
    }
  }

  res.status(StatusCodes.CREATED).json(newUsers);
};

const getAllAssistants = async (req, res) => {
  const newApiFeatures = new ApiFeatures(
    User.find({ role: "assistant" }),
    req.query
  )
    .filter()
    .sort()
    .search()
    .removePassword();

  const { mongooseQuery } = newApiFeatures;
  const assistants = await mongooseQuery;

  res.status(StatusCodes.OK).json(assistants);
};

const getAllStudents = async (req, res) => {
  const newApiFeatures = new ApiFeatures(
    User.find({ role: "student" }),
    req.query
  )
    .filter()
    .sort()
    .search()
    .removePassword();

  const { mongooseQuery } = newApiFeatures;
  const students = await mongooseQuery;
  res.status(StatusCodes.OK).json(students);
};

const assignSubjectsforAssistant = async (req, res) => {
  const assistantId = req.params.assistantId; // id of assistant
  const subjectId = req.params.subjectId; // id of subject
  const sections = req.body.sections; // array of sections

  // check is subject exist
  const subject = await Subject.findById(subjectId);
  if (!subject) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error("Subject not found");
  }

  // check is assistant exist
  const assistant = await User.find({ _id: assistantId, role: "assistant" });
  if (!assistant) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error("Assistant not found");
  }

  // Check is assistant already have this subject and section
  const checkAssistant = await AssistantSubjects.findOne({
    assistant: { $ne: assistantId },
    subject: subjectId,
    sections: { $in: sections },
  });
  if (checkAssistant) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error("Assistant already have this subject and section");
  }

  // check is assistant already have this subject
  const assistantSubjectExist = await AssistantSubjects.findOne({
    assistant: assistantId,
    subject: subjectId,
  });

  if (assistantSubjectExist === null) {
    // here create new assistant for this subject and sections
    const newAssistantSubject = await AssistantSubjects.create({
      assistant: assistantId,
      subject: subjectId,
      sections: sections,
    });
    res.status(StatusCodes.CREATED).json(newAssistantSubject);
  } else {
    // here update section array for this assistant and subject
    const updateAssistantSubject = await AssistantSubjects.findOneAndUpdate(
      { assistant: assistantId, subject: subjectId },
      { $addToSet: { sections: sections } },
      { new: true }
    );
    res.status(StatusCodes.CREATED).json(updateAssistantSubject);
  }
};

const removeSubjectfromAssistant = async (req, res) => {
  const assistantId = req.params.assistantId;
  const subjectId = req.params.subjectId;
  const assistantSubject = await AssistantSubjects.findOneAndDelete({
    assistant: assistantId,
    subject: subjectId,
  });
  res.status(StatusCodes.OK).json(assistantSubject);
};

const revomeSectionsfromAssistant = async (req, res) => {
  const assistantId = req.params.assistantId;
  const subjectId = req.params.subjectId;
  const sections = req.body.sections;
  const assistantSubject = await AssistantSubjects.findOneAndUpdate(
    { assistant: assistantId, subject: subjectId },
    { $pull: { sections: { $in: sections } } },
    { new: true }
  );
  res.status(StatusCodes.OK).json(assistantSubject);
};

const getAllSubjectsForAssistant = async (req, res) => {
  const assistantSubjects = await AssistantSubjects.find()
    .populate({
      path: "subject",
      model: "Subject",
      select: "name -_id",
    })
    .populate({
      path: "assistant",
      model: "User",
      select: "name -_id",
    });
  res.status(StatusCodes.OK).json(assistantSubjects);
};

module.exports = {
  createUser,
  getAllAssistants,
  getAllStudents,
  assignSubjectsforAssistant,
  getAllSubjectsForAssistant,
  removeSubjectfromAssistant,
  revomeSectionsfromAssistant,
};
