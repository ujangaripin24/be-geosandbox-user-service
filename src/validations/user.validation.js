const { body } = require("express-validator");
const db = require("../models/index");
const DetailUsers = db.DetailUsers;

const UpdateUserValidator = [
  body("email")
    .optional()
    .isEmail()
    .withMessage("Email tidak valid")
    .bail()
    .custom(async (value, { req }) => {
      const existingUser = await DetailUsers.findOne({
        where: { email: value },
        attributes: ["uuid"],
      });

      if (
        existingUser &&
        String(existingUser.uuid) !== String(req.user?.uuid)
      ) {
        throw new Error("email sudah terdaftar");
      }

      return true;
    }),
  body("username").optional().notEmpty().withMessage("username tidak boleh kosong"),
  body("firstName").optional().notEmpty().withMessage("firstName tidak boleh kosong"),
  body("lastName").optional().notEmpty().withMessage("lastName tidak boleh kosong"),
  body("phone").optional().notEmpty().withMessage("phone tidak boleh kosong"),
  body("gender").optional().notEmpty().withMessage("gender tidak boleh kosong"),
  body("link_pict").optional().notEmpty().withMessage("link_pict tidak boleh kosong"),
];

module.exports = { UpdateUserValidator };
