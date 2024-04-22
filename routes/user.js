const express = require("express");
const router = express.Router();

const { updateUserName, updateUserPassword } = require("../controllers/user");
const { login } = require("../controllers/auth");
const { protect, allowedTo } = require("../middlewares/protect");

router.post("/login", login);

router.use(protect, allowedTo("manager", "assistant", "student"));
router.put("/update-name", updateUserName);
router.put("/update-password", updateUserPassword);

module.exports = router;
