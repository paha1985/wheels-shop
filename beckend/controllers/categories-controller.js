const ApiError = require("../error/ApiError");
const db = require("../db");

class categoriesController {
  async createCategorie(req, res, next) {
    try {
      const { category_name, user_id } = req.body;
      const category = await db.query(
        "insert into categories( category_name, user_id ) values ($1, $2) RETURNING *",
        [category_name, user_id]
      );
      return res.json(category.rows[0]);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async getCategories(req, res, next) {
    try {
      const { page, limit } = req.query;
      const category = await db.query(
        `select * from categories c, users u where u.user_id = c.user_id ${
          page != 0 ? `limit ${limit} offset ${(page - 1) * limit}` : ""
        }`
      );
      return res.json(category.rows);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async getCategoryCount(req, res, next) {
    try {
      const categories = await db.query(
        `select count(*) count from categories`
      );
      return res.json(categories.rows);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async updateCategorie(req, res, next) {
    try {
      const { category_name, category_id, user_id } = req.body;
      const category = await db.query(
        "update categories set category_name = $1, user_id=$2 where category_id = $3 RETURNING *",
        [category_name, category_id, user_id]
      );
      return res.json(category.rows);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async deleteCategorie(req, res, next) {
    try {
      const id = req.params.id;
      const category = await db.query(
        "DELETE FROM categories where category_id = $1",
        [id]
      );
      return res.json([]);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new categoriesController();
