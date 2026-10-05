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

const GetDetailUserAddress = async (uuid) => {
    let user = await DetailUsers.findOne({
        where: { uuid: uuid },
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
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        gender: user.gender,
        link_pict: user.link_pict,
        detail: user.addresses
    };
}

const DeleteDetailAddressService = async (uuid) => {
    let userAddress = await TblAddressUsers.findOne({
        where: { uuid: uuid }
    });

    if (!userAddress) {
        throw new Error("User Address not found");
    }

    await userAddress.destroy();

    return "Data service berhasil dihapus";
}

module.exports = { CreateAddressService, GetDetailUserAddress, DeleteDetailAddressService };
