const { Op } = require("sequelize");
const { DetailUsers } = require("../models");
const { removeFileFromS3, uploadBufferToS3 } = require("../pkg/storage/storage-s3.pkg");


const GetAllUsersService = async ({ page = 1, size = 10, search = "" }) => {
  let limit = parseInt(size);
  let offset = (page - 1) * limit;

  let where = search
    ? {
      [Op.or]: [
        { username: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ],
    }
    : {};

  let { rows, count } = await DetailUsers.findAndCountAll({
    attributes: [
      "uuid",
      "username",
      "email",
      "firstName",
      "lastName",
      "phone",
      "gender",
      "link_pict",
    ],
    where,
    offset,
    limit,
    order: [["createdAt", "DESC"]],
  });

  let totalPages = Math.ceil(count / limit);
  return {
    data: rows,
    size: limit,
    page: parseInt(page),
    totalPages,
    totalData: count,
  };
};

const GetUserByUUIDService = async (uuid) => {
  let user = await DetailUsers.findOne({
    where: { uuid },
    attributes: [
      "uuid",
      "username",
      "email",
      "firstName",
      "lastName",
      "phone",
      "gender",
      "link_pict",
    ],
  });
  return user;
};

const UserUpdateService = async (uuid, payload) => {
  let user = await DetailUsers.findOne({
    where: { uuid },
  });
  if (!user) {
    throw new Error("User not found");
  }
  let editableFields = [
    "username",
    "email",
    "firstName",
    "lastName",
    "phone",
    "gender",
    "link_pict",
  ];

  for (let field of editableFields) {
    if (Object.prototype.hasOwnProperty.call(payload, field)) {
      user[field] = payload[field];
    }
  }

  await user.save();
  return user;
};

const UploadPicsProfileService = async (uuid, file) => {
  let MAX_FILE_SIZE = 5 * 1024 * 1024;

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Ukuran file tidak boleh lebih dari 5MB");
  }

  let user = await DetailUsers.findOne({ where: { uuid } });
  if (!user) {
    throw new Error("User not found");
  }

  let isReplacing = Boolean(user.link_pict);
  if (isReplacing) {
    await removeFileFromS3(user.link_pict);
  }

  let { objectKey, fileUrl } = await uploadBufferToS3(uuid, file);
  user.link_pict = fileUrl;
  await user.save();

  return {
    uuid: user.uuid,
    username: user.username,
    link_pict: user.link_pict,
    key: objectKey,
    isReplaced: isReplacing,
  };
};

const DeletePicsProfileService = async (uuid) => {
  let user = await DetailUsers.findOne({ where: { uuid } });
  if (!user) {
    throw new Error("User not found");
  }

  if (!user.link_pict) {
    throw new Error("Foto profil belum tersedia atau sudah dihapus");
  }

  await removeFileFromS3(user.link_pict);
  user.link_pict = "";
  await user.save();

  return {
    uuid: user.uuid,
    username: user.username,
    link_pict: user.link_pict,
  };
};

module.exports = {
  GetAllUsersService,
  GetUserByUUIDService,
  UserUpdateService,
  UploadPicsProfileService,
  DeletePicsProfileService,
};


