const Subject = require("../models/subject");
const { StatusCodes } = require("http-status-codes");
const ApiFeatures = require("../utils/apiFeatures");

const createSubject = async (req, res) => {
  const { name, code, band } = req.body;

  const subjectExist = await Subject.findOne({ code });
  if (subjectExist) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error("Subject already exists");
  }

  const newSubject = await Subject.create({
    name,
    code,
    band,
  });

  res.status(StatusCodes.CREATED).json({ newSubject });
};

const getSubjects = async (req, res) => {
  const newApiFeatures = new ApiFeatures(Subject.find(), req.query)
    .filter()
    .sort()
    .search();

  const { mongooseQuery } = newApiFeatures;
  const subjects = await mongooseQuery;

  res.status(StatusCodes.OK).json({ subjects });
};

const getSubject = async (req, res) => {
  const { id } = req.params;
  const subject = await Subject.findById(id);
  if (!subject) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error("Subject not found");
  }
  res.status(StatusCodes.OK).json({ subject });
};

const updateSubject = async (req, res) => {
  const { id } = req.params;
  const { name, code, bandNumber } = req.body;
  const subject = await Subject.findByIdAndUpdate(
    id,
    {
      name,
      code,
      bandNumber,
    },
    { new: true }
  );
  if (!subject) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error("Subject not found");
  }
  res.status(StatusCodes.OK).json({ subject });
};

const deleteSubject = async (req, res) => {
  const { id } = req.params;
  const subject = await Subject.findByIdAndDelete(id);
  if (!subject) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error("Subject not found");
  }
  res.status(StatusCodes.OK).json({ subject });
};

module.exports = {
  createSubject,
  getSubjects,
  getSubject,
  updateSubject,
  deleteSubject,
};
