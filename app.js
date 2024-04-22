require("dotenv").config();
require("express-async-errors");
const cors = require("cors");
const express = require("express");
const app = express();
const connectDB = require("./config/db");
const userRoute = require("./routes/user");
const collegeRoute = require("./routes/college");
const assistantRoute = require("./routes/assistant");
const studentRoute = require("./routes/student");
const subjectRoute = require("./routes/subject");
const taskRoute = require("./routes/task");

const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

// middeleware
app.use(express.json());
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }));

// routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/college", collegeRoute);
app.use("/api/v1/assistant", assistantRoute);
app.use("/api/v1/student", studentRoute);
app.use("/api/v1/subject", subjectRoute);
app.use("/api/v1/task", taskRoute);

// error handler
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

// connect to database
connectDB();

// start server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});
