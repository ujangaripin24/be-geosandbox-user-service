const {
  GetAllUsersService,
  UserUpdateService,
  GetUserByUUIDService,
} = require("../services/user.service");
const { formatError } = require("../pkg/error-formatter.pkg");
const {
  deliverMessageData,
} = require("../pkg/message-broker/message-broker.pkg");

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
    await deliverMessageData("user_update", {
      uuid: updatedUser.uuid,
      username: updatedUser.username,
      email: updatedUser.email,
    });
    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    return res.status(500).json(formatError(error.message, "server"));
  }
};


module.exports = {
  GetAllUsersController,
  GetUserDetailController,
  UserUpdateController,
};
