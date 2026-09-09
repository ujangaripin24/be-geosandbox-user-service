const express = require("express");
const { validationResult } = require("express-validator");
const { CreateAddressController } = require("../controllers/address.controller");
const { CreateAddressUserValidator } = require("../validations/address.validation");
const { authenticateTokenGuard } = require("../middlewares/guard.middleware");
const router = express.Router();

router.post('/user/create-address', CreateAddressUserValidator, authenticateTokenGuard, (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    } else {
        next()
    }
}, CreateAddressController)

module.exports = router;