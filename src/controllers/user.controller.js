const {
  GetAllUsersService,
  UserUpdateService,
  GetUserByUUIDService,
  UploadPicsProfileService,
  DeletePicsProfileService,
  UploadCoverPicsProfileService,
  DeleteCoverPicsProfileService,
} = require("../services/user.service");
const { formatError } = require("../pkg/error-formatter.pkg");
const {
  deliverMessageData,
} = require("../pkg/message-broker/message-broker.pkg");
const { getUploadedFile } = require("../pkg/storage/storage-s3.pkg");

const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];



const GetAllUsersController = async (req, res, next) => {
  const { page, size, search } = req.query;

  try {
    const getAllUsersService = await GetAllUsersService({ page, size, search });
    if (!getAllUsersService.data || getAllUsersService.data.length === 0) {
      return res.status(500).json(formatError("tidak ada data", "data"));
    }
    return res
      .status(200)
      .json({ message: "Get All Users", data: getAllUsersService });
  } catch (error) {
    return res.status(500).json(formatError(error.message, "server"));
  }
};

const GetUserDetailController = async (req, res) => {
  try {
    let { uuid } = req.params;
    let result = await GetUserByUUIDService(uuid);
    return res.status(200).json({ message: "Get All Users", data: result });
  } catch (error) {
    return res.status(500).json(formatError(error.message, "server"));
  }
};

const UserUpdateController = async (req, res, next) => {
  try {
    let uuid = req.user.uuid;
    console.log("User Update Controller: ", uuid);
    let body = req.body;
    let updatedUser = await UserUpdateService(uuid, body);
    await deliverMessageData(["user_update", "gis_user_update"], {
      uuid: updatedUser.uuid,
      username: updatedUser.username,
      email: updatedUser.email,
    });
    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    return res.status(500).json(formatError(error.message, "server"));
  }
};

const UploadPicsProfileController = async (req, res, next) => {
  try {
    const uuid = req.user.uuid;
    const file = getUploadedFile(req);

    if (!file) {
      return res
        .status(400)
        .json(formatError("File gambar wajib diunggah", "file"));
    }

    if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
      return res
        .status(400)
        .json(
          formatError(
            "Format file tidak didukung. Gunakan JPG, JPEG, PNG, atau WEBP",
            "file",
          ),
        );
    }

    const result = await UploadPicsProfileService(uuid, file);
    return res.status(200).json({
      message: result.isReplaced
        ? "Foto profil berhasil diperbarui"
        : "Foto profil berhasil diunggah",
    });
  } catch (error) {
    if (error.message.includes("Ukuran file")) {
      return res.status(400).json(formatError(error.message, "file"));
    }
    return res.status(500).json(formatError(error.message, "server"));
  }
};

const UploadCoverPicsProfileController = async (req, res, next) => {
  try {
    const uuid = req.user.uuid;
    const file = getUploadedFile(req);

    console.log("[user.controller] uuid: ", uuid)
    console.log("[user.controller] file: ", file)

    if (!file) {
      return res
        .status(400)
        .json(formatError("File gambar wajib diunggah", "file"));
    }

    if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
      return res
        .status(400)
        .json(
          formatError(
            "Format file tidak didukung. Gunakan JPG, JPEG, PNG, atau WEBP",
            "file",
          ),
        );
    }

    const result = await UploadCoverPicsProfileService(uuid, file);
    return res.status(200).json({
      message: result.isReplaced
        ? "Foto sampul berhasil diperbarui"
        : "Foto sampul berhasil diupdate",
    });
  } catch (error) {
    if (error.message.includes("Ukuran file")) {
      return res.status(400).json(formatError(error.message, "file"));
    }
    return res.status(500).json(formatError(error.message, "server"));
  }
};

const DeletePicsProfileController = async (req, res, next) => {
  try {
    const uuid = req.user.uuid;
    const result = await DeletePicsProfileService(uuid);
    return res.status(200).json({
      message: "Foto profil berhasil dihapus",
      data: result,
    });
  } catch (error) {
    if (error.message.includes("belum tersedia")) {
      return res.status(404).json(formatError(error.message, "link_pict"));
    }
    return res.status(500).json(formatError(error.message, "server"));
  }
};

const DeleteCoverPicsProfileController = async (req, res, next) => {
  try {
    const uuid = req.user.uuid;
    const result = await DeleteCoverPicsProfileService(uuid);
    return res.status(200).json({
      message: "Foto sampul berhasil dihapus",
      data: result,
    });
  } catch (error) {
    if (error.message.includes("belum tersedia")) {
      return res.status(404).json(formatError(error.message, "link_cover_pics"));
    }
    return res.status(500).json(formatError(error.message, "server"));
  }
};

module.exports = {
  GetAllUsersController,
  GetUserDetailController,
  UserUpdateController,
  UploadPicsProfileController,
  UploadCoverPicsProfileController,
  DeletePicsProfileController,
  DeleteCoverPicsProfileController
};

