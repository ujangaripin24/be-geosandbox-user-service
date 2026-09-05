const express = require('express');
const { GetAllUsersController } = require('../controllers/user.controller');

const router = express.Router();

router.get('/users/health', (req, res) => {
    res.status(200).json({
        status: 200,
        message: "[SERVICE-USER] Server Berhasil Berjalan",
        date: new Date().toISOString().replace('T', ' ').substring(0, 19)
    });
});

router.get('/users/get-all', GetAllUsersController);

module.exports = router;