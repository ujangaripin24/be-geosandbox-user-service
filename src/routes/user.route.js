const express = require("express");
const {
  GetAllUsersController,
  GetUserDetailController,
  UserUpdateController,
} = require("../controllers/user.controller");
const {
  authenticateTokenGuard,
  authenticateTokenRole,
} = require("../middlewares/guard.middleware");

const router = express.Router();

router.get("/users/health", (req, res) => {
  res.status(200).json({
    status: 200,
    message: "[SERVICE-USER] Server Berhasil Berjalan",
    date: new Date().toISOString().replace("T", " ").substring(0, 19),
  });
});
router.get(
  "/user/profile/admin",
  authenticateTokenGuard,
  authenticateTokenRole(["admin"]),
  (req, res, next) => {
    return res.status(200).json({
      message: "Admin role access",
    });
  },
);
router.get(
  "/user/profile/user",
  authenticateTokenGuard,
  authenticateTokenRole(["user"]),
  (req, res, next) => {
    return res.status(200).json({
      message: "User role access",
    });
  },
);
router.get("/users/get-all", authenticateTokenGuard, GetAllUsersController);
router.get("/users/detail/:uuid", GetUserDetailController);
router.put("/users/update/:uuid", authenticateTokenGuard, UserUpdateController);

module.exports = router;
