const { TblAddressUsers, DetailUsers } = require('../models');

const CreateAddressService = async (uuid, body) => {
    let user = await DetailUsers.findOne({
        where: { uuid_user: uuid }
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

const GetDetailUserAddress = async (uuid) => {
    let user = await DetailUsers.findOne({
        where: { uuid_user: uuid },
        attributes: ['username', 'email'],
        include: [{
            model: TblAddressUsers,
            as: 'addresses',
            attributes: ['uuid', 'negara', 'address', 'kota', 'provinsi', 'kode_pos']
        }]
    });

    if (!user) {
        throw new Error("User not found");
    }

    return {
        username: user.username,
        email: user.email,
        detail: user.addresses
    };
}

module.exports = { CreateAddressService, GetDetailUserAddress };
