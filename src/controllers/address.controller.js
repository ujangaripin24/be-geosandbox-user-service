const { formatError } = require("../pkg/error-formatter.pkg");
const { CreateAddressService, GetDetailUserAddress } = require("../services/address.service");

const CreateAddressController = async (req, res, next) => {
    try {
        let uuid = req.user.uuid;
        let body = req.body;

        console.log("User Update Controller: ", uuid);
        console.log("User Update Controller: ", body);
        await CreateAddressService(uuid, body);
        return res.status(201).json({
            message: "Alamat berhasil ditambahkan."
        });
    } catch (error) {
        console.error("Error in CreateAddressController:", error);
        return res.status(500).json(formatError(error.message, "server"));
    }
}

const GetDetailUserAddressController = async (req, res, next) => {
    try {
        let uuid = req.user.uuid;
        let data = await GetDetailUserAddress(uuid);
        return res.status(200).json({
            message: "Detail alamat user berhasil diambil.",
            data
        });
    } catch (error) {
        console.error("Error in GetDetailUserAddressController:", error);
        if (error.message === "User not found") {
            return res.status(404).json(formatError(error.message, "user"));
        }
        return res.status(500).json(formatError(error.message, "server"));
    }
}

module.exports = { CreateAddressController, GetDetailUserAddressController };
