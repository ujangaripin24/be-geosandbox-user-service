const { body } = require("express-validator");

const CreateAddressUserValidator = [
    body("negara").notEmpty().withMessage("negara tidak boleh kosong"),
    body("address").notEmpty().withMessage("address tidak boleh kosong"),
    body("kota").notEmpty().withMessage("kota tidak boleh kosong"),
    body("provinsi").notEmpty().withMessage("provinsi tidak boleh kosong"),
    body("kode_pos").notEmpty().withMessage("kode_pos tidak boleh kosong"),
]

module.exports = { CreateAddressUserValidator };