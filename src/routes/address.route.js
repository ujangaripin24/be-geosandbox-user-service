const express = require("express");
const { validationResult } = require("express-validator");
const { CreateAddressController, GetDetailUserAddressController, DeleteDetailUserAddressController } = require("../controllers/address.controller");
const { CreateAddressUserValidator } = require("../validations/address.validation");
const { authenticateTokenGuard } = require("../middlewares/guard.middleware");
const { checkAddressOwnership } = require("../middlewares/address.middleware");
const router = express.Router();

router.post('/user/create-address', authenticateTokenGuard, CreateAddressUserValidator, (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    } else {
        next()
    }
}, CreateAddressController);

router.get('/user/address', authenticateTokenGuard, GetDetailUserAddressController);
router.delete('/user/address/delete/:uuid', authenticateTokenGuard, checkAddressOwnership, DeleteDetailUserAddressController)

module.exports = router;