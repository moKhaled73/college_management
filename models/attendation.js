const mongoose = require("mongoose");

const AttendationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
  },
  attend: [
    {
      type: Date,
      default: Date.now(),
    },
  ],
  NumberOfAttend: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Attendation", AttendationSchema);
