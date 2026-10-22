const { Op, Sequelize } = require("sequelize");
const { TblUserLoginHistory } = require("../models");

const GetAllLoginHistoryService = async ({
  page = 1,
  size = 10,
  search = "",
  uuid_user,
  email,
  sort = "DESC",
}) => {
  const limit = parseInt(size);
  const offset = (page - 1) * limit;

  const sortDirection = ["ASC", "TERLAMA", "OLDEST"].includes(
    String(sort).trim().toUpperCase(),
  )
    ? "ASC"
    : "DESC";

  const userCondition = email
    ? { [Op.or]: [{ uuid_user }, { email }] }
    : { uuid_user };

  let where = userCondition;

  if (search) {
    where = {
      [Op.and]: [
        userCondition,
        Sequelize.where(Sequelize.cast(Sequelize.col("login_at"), "varchar"), {
          [Op.like]: `%${search}%`,
        }),
      ],
    };
  }

  const { rows, count } = await TblUserLoginHistory.findAndCountAll({
    where,
    offset,
    limit,
    order: [["login_at", sortDirection]],
    attributes: [
      "uuid",
      "email",
      "ip_address",
      "device",
      "browser",
      "os",
      "user_agent",
      "status",
      "failure_reason",
      "login_at",
    ],
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

module.exports = {
  GetAllLoginHistoryService,
};
