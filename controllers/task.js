const Task = require("../models/task");
const { StatusCodes } = require("http-status-codes");
const assistantSubjects = require("../models/assistantSubjects");

const createTask = async (req, res) => {
  const { content, deadline } = req.body;
  const assistantId = req.user._id;
  const subjectId = req.params.subjectId;
  const task = await Task.create({
    content,
    deadline,
    assistant: assistantId,
    subject: subjectId,
  });
  res.status(StatusCodes.OK).json(task);
};

const getTasks = async (req, res) => {
  const assistantId = req.user._id;
  const subjectId = req.params.subjectId;
  const tasks = await Task.find({
    assistant: assistantId,
    subject: subjectId,
  });
  res.status(StatusCodes.OK).json(tasks);
};

const getTasksForStudent = async (req, res) => {
  const studentId = req.user._id;
  const subjectId = req.params.subjectId;
  const assistantId = req.params.assistantId;

  const student = await User.findById(studentId);
  if (!student) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error("Student not found");
  }

  const assistant = await User.findById(assistantId);
  if (!assistant) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error("Assistant not found");
  }

  const subject = await Subject.findById(subjectId);
  if (!subject) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error("Subject not found");
  }

  const checkSection = await assistantSubjects.findOne({
    user: assistantId,
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

  const tasks = await Task.find({
    assistant: assistantId,
    subject: subjectId,
  });
  res.status(StatusCodes.OK).json(task);
};

const updateTask = async (req, res) => {
  const { content, deadline } = req.body;
  const taskId = req.params.taskId;
  const task = await Task.findByIdAndUpdate(
    taskId,
    { content, deadline },
    { new: true }
  );
  res.status(StatusCodes.OK).json(task);
};

const deleteTask = async (req, res) => {
  const taskId = req.params.taskId;
  const task = await Task.findByIdAndDelete(taskId);
  res.status(StatusCodes.OK).json(task);
};

module.exports = {
  createTask,
  getTasks,
  getTasksForStudent,
  updateTask,
  deleteTask,
};
