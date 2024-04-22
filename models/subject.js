const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unquie: true,
    },
    code: {
      type: String,
      required: true,
      unquie: true,
    },
    band: {
      type: String,
      enum: ["first", "second", "third", "fourth"],
      default: "first",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Subject", SubjectSchema);
