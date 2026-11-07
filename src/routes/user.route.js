const express = require("express");
const multer = require("multer");
const {
  GetAllUsersController,
  GetUserDetailController,
  UserUpdateController,
  UploadPicsProfileController,
  DeletePicsProfileController,
  UploadCoverPicsProfileController,
  DeleteCoverPicsProfileController,
} = require("../controllers/user.controller");
const {
  authenticateTokenGuard,
  authenticateTokenRole,
} = require("../middlewares/guard.middleware");
const { UpdateUserValidator } = require("../validations/user.validation");
const { validationResult } = require("express-validator");
const { version } = require("../../package.json");
const { maxUploadFile } = require("../pkg/storage/storage-s3.pkg");
const { formatError } = require("../pkg/error-formatter.pkg");

const router = express.Router();


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

router.put(
  "/users/upload-profile",
  authenticateTokenGuard,
  (req, res, next) => {
    maxUploadFile.any()(req, res, (err) => {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res
            .status(400)
            .json(
              formatError("Ukuran file tidak boleh lebih dari 5MB", "file"),
            );
        }
        return res.status(400).json(formatError(err.message, "file"));
      }
      next();
    });
  },
  UploadPicsProfileController,
);

router.put(
  "/users/upload-cover-pics",
  authenticateTokenGuard,
  (req, res, next) => {
    maxUploadFile.any()(req, res, (err) => {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res
            .status(400)
            .json(
              formatError("Ukuran file tidak boleh lebih dari 5MB", "file"),
            );
        }
        return res.status(400).json(formatError(err.message, "file"));
      }
      next();
    });
  },
  UploadCoverPicsProfileController,
)

router.delete(
  "/users/delete/upload-profile",
  authenticateTokenGuard,
  DeletePicsProfileController,
);

router.delete(
  "/users/delete/upload-conver-pics",
  authenticateTokenGuard,
  DeleteCoverPicsProfileController
)

module.exports = router;


