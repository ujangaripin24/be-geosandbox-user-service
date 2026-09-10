const { Op } = require("sequelize");
const { DetailUsers } = require("../models");

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
      "gender",
    ],
  });
  return user;
};

const UserUpdateService = async (uuid, payload) => {
  let user = await DetailUsers.findOne({
    where: { uuid }
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

module.exports = {
  GetAllUsersService,
  GetUserByUUIDService,
  UserUpdateService,
};
