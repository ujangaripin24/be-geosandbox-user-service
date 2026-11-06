const express = require("express");
const multer = require("multer");
const {
  GetAllUsersController,
  GetUserDetailController,
  UserUpdateController,
  UploadPicsProfileController,
  UpdatePicsProfileController,
  DeletePicsProfileController,
} = require("../controllers/user.controller");
const {
  authenticateTokenGuard,
  authenticateTokenRole,
} = require("../middlewares/guard.middleware");
const { UpdateUserValidator } = require("../validations/user.validation");
const { validationResult } = require("express-validator");
const { version } = require("../../package.json");

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // Maksimal 5MB
});

router.get("/users/health", (req, res) => {
  res.status(200).json({
    status: 200,
    versionApp: version,
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
router.get("/users/get-all", GetAllUsersController);
router.get(
  "/users/detail/:uuid",
  authenticateTokenGuard,
  GetUserDetailController,
);
router.put(
  "/users/update",
  authenticateTokenGuard,
  UpdateUserValidator,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      next();
    }
  },
  UserUpdateController,
);

router.post(
  "/users/upload-profile",
  authenticateTokenGuard,
  upload.any(),
  UploadPicsProfileController,
);
router.put(
  "/users/upload-profile",
  authenticateTokenGuard,
  upload.any(),
  UploadPicsProfileController,
);
router.put(
  "/users/update-profile-pic",
  authenticateTokenGuard,
  upload.any(),
  UpdatePicsProfileController,
);
router.delete(
  "/users/delete-profile-pic",
  authenticateTokenGuard,
  DeletePicsProfileController,
);

module.exports = router;

