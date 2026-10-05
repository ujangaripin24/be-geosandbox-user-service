const { TblAddressUsers } = require("../models")
const { formatError } = require("../pkg/error-formatter.pkg")

const checkAddressOwnership = async (req, res, next) => {
    try {
        const { uuid } = req.params
        const uuid_user = req.user?.uuid

        if (!uuid) {
            return res.status(400).json(formatError("Parameter UUID tidak ditemukan", "uuid"))
        }

        if (!uuid_user) {
            return res.status(401).json(formatError("Unauthorized access", "auth"))
        }

        const address = await TblAddressUsers.findOne({
            where: { uuid }
        });

        if (!address) {
            return res.status(404).json(formatError("Address tidak ditemukan", "uuid"));
        }

        if (address.uuid_user !== uuid_user) {
            return res.status(403).json(formatError("Anda tidak memiliki akses untuk address ini", "forbidden"));
        }

        req.address = address;
        next();
    } catch (error) {
        console.error("Error in checkAddressOwnership middleware:", error.message);
        return res.status(500).json(formatError("Terjadi kesalahan pada server", "server"));
    }
}

module.exports = {
    checkAddressOwnership
};