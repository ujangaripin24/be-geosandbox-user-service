const { body } = require("express-validator");

const CreateCompanyValidator = [
  body("name").notEmpty().withMessage("Nama perusahaan tidak boleh kosong"),
  body("address").notEmpty().withMessage("Alamat perusahaan tidak boleh kosong"),
  body("link_location_company")
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage("link_location_company harus berupa teks"),
  body("instagram")
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage("instagram harus berupa teks"),
  body("tiktok")
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage("tiktok harus berupa teks"),
  body("facebook")
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage("facebook harus berupa teks"),
  body("website")
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage("website harus berupa teks"),
];

const UpdateCompanyValidator = [
  body("name")
    .optional()
    .notEmpty()
    .withMessage("Nama perusahaan tidak boleh kosong"),
  body("address")
    .optional()
    .notEmpty()
    .withMessage("Alamat perusahaan tidak boleh kosong"),
  body("link_location_company")
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage("link_location_company harus berupa teks"),
  body("instagram")
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage("instagram harus berupa teks"),
  body("tiktok")
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage("tiktok harus berupa teks"),
  body("facebook")
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage("facebook harus berupa teks"),
  body("website")
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage("website harus berupa teks"),
];

module.exports = {
  CreateCompanyValidator,
  UpdateCompanyValidator,
};

