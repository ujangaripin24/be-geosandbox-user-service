const { formatError } = require("../pkg/error-formatter.pkg");
const { CreateAddressService } = require("../services/address.service");

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

module.exports = { CreateAddressController };
