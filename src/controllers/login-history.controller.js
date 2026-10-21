const {
  GetAllLoginHistoryService,
} = require("../services/login-history.service");

const GetAllLoginHistoryController = async (req, res) => {
  try {
    const uuid_user = req.user?.uuid;
    const email = req.user?.email;

    if (!uuid_user) {
      return res.status(400).json({
        status: "error",
        message: "UUID User tidak ditemukan dalam token",
      });
    }

    const { page = 1, size = 10, search = "", sort, order } = req.query;

    const result = await GetAllLoginHistoryService({
      page,
      size,
      search,
      uuid_user,
      email,
      sort: sort || order || "DESC",
    });

    return res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = { GetAllLoginHistoryController };
