const ApiError = require("../error/ApiError");
const db = require("../db");

class BrandController {
  async createBrand(req, res, next) {
    try {
      const { brand_name, user_id } = req.body;
      const brand = await db.query(
        "insert into brands( brand_name, user_id ) values ($1, $2) RETURNING *",
        [brand_name, user_id]
      );
      return res.json(brand.rows[0]);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async getBrands(req, res, next) {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 16;
      const brands = await db.query(
        `select b.*, u.login from brands b, users u where b.user_id = u.user_id ${
          page != 0 ? `limit ${limit} offset ${(page - 1) * limit}` : ""
        }`
      );
      return res.json(brands.rows);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async getBrandCount(req, res, next) {
    try {
      const brands = await db.query(`select count(*) count from brands`);
      return res.json(brands.rows);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async updateBrand(req, res, next) {
    try {
      const { brand_name, brand_id, user_id } = req.body;
      const brands = await db.query(
        "update brands set brand_name = $1, user_id=$2 where brand_id = $3",
        [brand_name, user_id, brand_id]
      );
      return res.json(brands.rows);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async deleteBrand(req, res, next) {
    try {
      const id = req.params.id;
      const brands = await db.query("DELETE FROM brands where brand_id = $1", [
        id,
      ]);
      return res.json([]);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new BrandController();
