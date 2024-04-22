const mongoose = require("mongoose");

const AssistantSubjectsSchema = new mongoose.Schema(
  {
    assistant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
    sections: [
      {
        type: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AssistantSubjects", AssistantSubjectsSchema);
