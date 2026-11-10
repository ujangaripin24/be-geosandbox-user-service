const express = require("express");
const { validationResult } = require("express-validator");
const {
  CreateCompanyController,
  GetAllCompaniesController,
  GetDetailCompanyController,
  UpdateCompanyController,
  DeleteCompanyController,
} = require("../controllers/company.controller");
const {
  CreateCompanyValidator,
  UpdateCompanyValidator,
} = require("../validations/company.validation");
const { authenticateTokenGuard } = require("../middlewares/guard.middleware");

const router = express.Router();

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post(
  "/company/create",
  authenticateTokenGuard,
  CreateCompanyValidator,
  handleValidation,
  CreateCompanyController,
);

router.get("/company/get-all", authenticateTokenGuard, GetAllCompaniesController);

router.get(
  "/company/detail/:uuid",
  authenticateTokenGuard,
  GetDetailCompanyController,
);

router.put(
  "/company/update/:uuid",
  authenticateTokenGuard,
  UpdateCompanyValidator,
  handleValidation,
  UpdateCompanyController,
);

router.delete(
  "/company/delete/:uuid",
  authenticateTokenGuard,
  DeleteCompanyController,
);

module.exports = router;

