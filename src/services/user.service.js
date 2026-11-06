const path = require("path");
const { Op } = require("sequelize");
const { DetailUsers } = require("../models");
const {
  rustfsClient,
  ensureBucketExists,
  S3_BUCKET,
  S3_ENDPOINT,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("../config/storage-s3.config");

const extractObjectKey = (linkPict) => {
  if (!linkPict || typeof linkPict !== "string") return null;
  const bucketPrefix = `/${S3_BUCKET}/`;
  const idx = linkPict.indexOf(bucketPrefix);
  if (idx !== -1) {
    return linkPict.substring(idx + bucketPrefix.length);
  }
  return linkPict;
};

const removeFileFromS3 = async (linkPict) => {
  const oldKey = extractObjectKey(linkPict);
  if (!oldKey) return;
  try {
    await rustfsClient.send(
      new DeleteObjectCommand({
        Bucket: S3_BUCKET,
        Key: oldKey,
      }),
    );
  } catch (err) {
    console.warn(`[RustFS] Gagal menghapus file lama (${oldKey}): ${err.message}`);
  }
};

const uploadBufferToS3 = async (uuid, file) => {
  if (!file || !file.buffer) {
    throw new Error("File gambar tidak ditemukan");
  }

  await ensureBucketExists(S3_BUCKET);

  const ext = path.extname(file.originalname || "").toLowerCase() || ".jpg";
  const objectKey = `profile-pictures/${uuid}-${Date.now()}${ext}`;

  await rustfsClient.send(
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: objectKey,
      Body: file.buffer,
      ContentType: file.mimetype || "image/jpeg",
    }),
  );

  const cleanEndpoint = S3_ENDPOINT.replace(/\/$/, "");
  const fileUrl = `${cleanEndpoint}/${S3_BUCKET}/${objectKey}`;
  return { objectKey, fileUrl };
};

const GetAllUsersService = async ({ page = 1, size = 10, search = "" }) => {
  const limit = parseInt(size);
  const offset = (page - 1) * limit;

  const where = search
    ? {
        [Op.or]: [
          { username: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
        ],
      }
    : {};

  const { rows, count } = await DetailUsers.findAndCountAll({
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

  const totalPages = Math.ceil(count / limit);
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
  const editableFields = [
    "username",
    "email",
    "firstName",
    "lastName",
    "phone",
    "gender",
    "link_pict",
  ];

  for (const field of editableFields) {
    if (Object.prototype.hasOwnProperty.call(payload, field)) {
      user[field] = payload[field];
    }
  }

  await user.save();
  return user;
};

const UploadPicsProfileService = async (uuid, file) => {
  let user = await DetailUsers.findOne({ where: { uuid } });
  if (!user) {
    throw new Error("User not found");
  }

  if (user.link_pict) {
    await removeFileFromS3(user.link_pict);
  }

  const { objectKey, fileUrl } = await uploadBufferToS3(uuid, file);
  user.link_pict = fileUrl;
  await user.save();

  return {
    uuid: user.uuid,
    username: user.username,
    link_pict: user.link_pict,
    key: objectKey,
  };
};

const UpdatePicsProfileService = async (uuid, file) => {
  let user = await DetailUsers.findOne({ where: { uuid } });
  if (!user) {
    throw new Error("User not found");
  }

  if (user.link_pict) {
    await removeFileFromS3(user.link_pict);
  }

  const { objectKey, fileUrl } = await uploadBufferToS3(uuid, file);
  user.link_pict = fileUrl;
  await user.save();

  return {
    uuid: user.uuid,
    username: user.username,
    link_pict: user.link_pict,
    key: objectKey,
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
  UpdatePicsProfileService,
  DeletePicsProfileService,
};

