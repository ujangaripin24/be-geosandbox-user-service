const { Op } = require('sequelize');
const { DetailUsers } = require('../models')

const GetAllUsersService = async ({ page = 1, size = 10, search = "" }) => {
    const limit = parseInt(size);
    const offset = (page - 1) * limit;

    const where = search ? {
        [Op.or]: [
            { username: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } }
        ]
    } : {};

    const { rows, count } = await DetailUsers.findAndCountAll({
        attributes: ['uuid', 'username', 'email', 'firstName', 'lastName', 'phone', 'gender', 'address', 'link_pict'],
        where,
        offset,
        limit,
        order: [['createdAt', 'DESC']]
    });

    const totalPages = Math.ceil(count / limit);
    return {
        data: rows,
        size: limit,
        page: parseInt(page),
        totalPages,
        totalData: count
    }
}

module.exports = {
    GetAllUsersService
}