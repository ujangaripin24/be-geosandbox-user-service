const { body } = require("express-validator");

const CreateAddressUserValidator = [
    body("negara").notEmpty().withMessage("Negara tidak boleh kosong"),
    body("address").notEmpty().withMessage("Alamat tidak boleh kosong"),
    body("kota").notEmpty().withMessage("Kota tidak boleh kosong"),
    body("provinsi").notEmpty().withMessage("Provinsi tidak boleh kosong"),
    body("kode_pos").notEmpty().withMessage("Kode pos tidak boleh kosong"),
]

module.exports = { CreateAddressUserValidator };