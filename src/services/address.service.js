const { TblAddressUsers, DetailUsers } = require('../models');

const CreateAddressService = async (uuid, body) => {
    let user = await DetailUsers.findOne({
        where: { uuid: uuid }
    });

    if (!user) {
        throw new Error("User not found");
    }

    let { negara, address, kota, provinsi, kode_pos } = body;

    let newAddress = await TblAddressUsers.create({
        uuid_user: uuid,
        negara,
        address,
        kota,
        provinsi,
        kode_pos
    });

    console.log("Data service berhasil dibuat: ", newAddress);
    return newAddress;
}

module.exports = { CreateAddressService };
