const { formatError } = require("../pkg/error-formatter.pkg");
const {
  deliverMessageData,
} = require("../pkg/message-broker/message-broker.pkg");
const {
  CreateCompanyService,
  GetAllCompaniesService,
  GetCompanyByUUIDService,
  UpdateCompanyService,
  DeleteCompanyService,
} = require("../services/company.service");

const CreateCompanyController = async (req, res, next) => {
  try {
    const body = req.body;
    const data = await CreateCompanyService(body);

    await deliverMessageData(["gis_company_updated_queue"], {
      event_type: "EVENT_CREATE_COMPANY_USER_SERVICE",
      uuid: data.uuid,
      name: data.name,
    });

    return res.status(201).json({
      message: "Company berhasil ditambahkan.",
    });
  } catch (error) {
    console.error("Error in CreateCompanyController:", error);
    return res.status(500).json(formatError(error.message, "server"));
  }
};

const GetAllCompaniesController = async (req, res, next) => {
  try {
    const { page, size, search } = req.query;
    const result = await GetAllCompaniesService({ page, size, search });
    return res.status(200).json({
      message: "Data company berhasil diambil.",
      data: result,
    });
  } catch (error) {
    console.error("Error in GetAllCompaniesController:", error);
    return res.status(500).json(formatError(error.message, "server"));
  }
};

const GetDetailCompanyController = async (req, res, next) => {
  try {
    const { uuid } = req.params;
    const data = await GetCompanyByUUIDService(uuid);
    return res.status(200).json({
      message: "Detail company berhasil diambil.",
      data,
    });
  } catch (error) {
    console.error("Error in GetDetailCompanyController:", error);
    if (error.message === "Company not found") {
      return res.status(404).json(formatError(error.message, "company"));
    }
    return res.status(500).json(formatError(error.message, "server"));
  }
};

const UpdateCompanyController = async (req, res, next) => {
  try {
    const { uuid } = req.params;
    const body = req.body;
    const data = await UpdateCompanyService(uuid, body);
    return res.status(200).json({
      message: "Company berhasil diperbarui.",
      data,
    });
  } catch (error) {
    console.error("Error in UpdateCompanyController:", error);
    if (error.message === "Company not found") {
      return res.status(404).json(formatError(error.message, "company"));
    }
    return res.status(500).json(formatError(error.message, "server"));
  }
};

const DeleteCompanyController = async (req, res, next) => {
  try {
    const { uuid } = req.params;
    await DeleteCompanyService(uuid);
    return res.status(200).json({
      message: "Company berhasil dihapus.",
    });
  } catch (error) {
    console.error("Error in DeleteCompanyController:", error);
    if (error.message === "Company not found") {
      return res.status(404).json(formatError(error.message, "company"));
    }
    return res.status(500).json(formatError(error.message, "server"));
  }
};

module.exports = {
  CreateCompanyController,
  GetAllCompaniesController,
  GetDetailCompanyController,
  UpdateCompanyController,
  DeleteCompanyController,
};
