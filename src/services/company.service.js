const { Op } = require("sequelize");
const { TblCompany } = require("../models");

const CreateCompanyService = async (body) => {
  const {
    name,
    address,
    link_location_company,
    instagram,
    tiktok,
    facebook,
    website,
  } = body;

  const newCompany = await TblCompany.create({
    name,
    address,
    link_location_company: link_location_company || null,
    instagram: instagram || null,
    tiktok: tiktok || null,
    facebook: facebook || null,
    website: website || null,
  });

  return newCompany;
};

const GetAllCompaniesService = async ({ page = 1, size = 10, search = "" } = {}) => {
  const limit = parseInt(size) || 10;
  const currentPage = parseInt(page) || 1;
  const offset = (currentPage - 1) * limit;

  const where = search
    ? {
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          { address: { [Op.iLike]: `%${search}%` } },
        ],
      }
    : {};

  const { rows, count } = await TblCompany.findAndCountAll({
    where,
    offset,
    limit,
    order: [["createdAt", "DESC"]],
  });

  const totalPages = Math.ceil(count / limit);
  return {
    data: rows,
    size: limit,
    page: currentPage,
    totalPages,
    totalData: count,
  };
};

const GetCompanyByUUIDService = async (uuid) => {
  const company = await TblCompany.findOne({
    where: { uuid },
  });

  if (!company) {
    throw new Error("Company not found");
  }

  return company;
};

const UpdateCompanyService = async (uuid, payload) => {
  const company = await TblCompany.findOne({
    where: { uuid },
  });

  if (!company) {
    throw new Error("Company not found");
  }

  const editableFields = [
    "name",
    "address",
    "link_location_company",
    "instagram",
    "tiktok",
    "facebook",
    "website",
  ];

  for (const field of editableFields) {
    if (Object.prototype.hasOwnProperty.call(payload, field)) {
      company[field] = payload[field];
    }
  }

  await company.save();
  return company;
};

const DeleteCompanyService = async (uuid) => {
  const company = await TblCompany.findOne({
    where: { uuid },
  });

  if (!company) {
    throw new Error("Company not found");
  }

  await company.destroy();
  return company;
};

module.exports = {
  CreateCompanyService,
  GetAllCompaniesService,
  GetCompanyByUUIDService,
  UpdateCompanyService,
  DeleteCompanyService,
};
