const express = require('express');

const router = express.Router();

router.get('/health', (req, res) => {
    res.status(200).json({
        status: 200,
        message: "[SERVICE-USER] Server Berhasil Berjalan",
        date: new Date().toISOString().replace('T', ' ').substring(0, 19)
    });
});

module.exports = router;