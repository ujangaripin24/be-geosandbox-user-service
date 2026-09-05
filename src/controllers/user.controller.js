const { GetAllUsersService } = require("../services/user.service");
const { formatError } = require("../pkg/error-formatter.pkg");

const GetAllUsersController = async (req, res, next) => {
  const { page, size, search } = req.query;

  try {
    const getAllUsersService = await GetAllUsersService({ page, size, search });
    if (!getAllUsersService.data || getAllUsersService.data.length === 0) {
      return res.status(500).json(formatError("tidak ada data", "data"));
    }
    return res.status(200).json({ message: "Get All Users", data: getAllUsersService });
  } catch (error) {
    return res.status(500).json(formatError(error.message, "server"));
  }
}

module.exports = {
  GetAllUsersController
}