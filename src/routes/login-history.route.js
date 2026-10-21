const express = require("express");
const {
  GetAllLoginHistoryController,
} = require("../controllers/login-history.controller");
const { authenticateTokenGuard } = require("../middlewares/guard.middleware");

const router = express.Router();

router.get(
  "/users/login-history",
  authenticateTokenGuard,
  GetAllLoginHistoryController,
);

module.exports = router;
