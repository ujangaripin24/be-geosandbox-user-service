const { body } = require("express-validator");
const db = require("../models/index");
const DetailUsers = db.DetailUsers;

const UpdateUserValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email tidak boleh kosong")
    .isEmail()
    .withMessage("Email tidak valid")
    .custom(async (a) => {
      try {
        const existingUser = await DetailUsers.findOne({ where: { email: a } });
        if (existingUser) {
          throw new Error("email sudah terdaftar");
        }
        return true;
      } catch (error) {
        if (error.message === "email sudah terdaftar") {
          throw error;
        }
        console.error("Database error during email validation:", error.message);
        throw new Error("Gagal memverifikasi email pada database");
      }
    }),
  body("username").notEmpty().withMessage("username tidak boleh kosong"),
  body("firstName").notEmpty().withMessage("firstName tidak boleh kosong"),
  body("lastName").notEmpty().withMessage("lastName tidak boleh kosong"),
  body("phone").notEmpty().withMessage("phone tidak boleh kosong"),
  body("gender").notEmpty().withMessage("gender tidak boleh kosong"),
  body("link_pict").notEmpty().withMessage("link_pict tidak boleh kosong"),
];

module.exports = { UpdateUserValidator };
