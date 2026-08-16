const express = require("express");

const {
    login,
    logout,
} = require("../controllers/userController");

const router = express.Router();
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;