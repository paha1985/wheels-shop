const ApiError = require("../error/ApiError");
const db = require("../db");

class MarkController {
  async createMark(req, res, next) {
    try {
      const { brand_id, mark, user_id, category_id } = req.body;
      const marks = await db.query(
        "insert into marks( brand_id, mark,  user_id, category_id ) values ($1, $2, $3, $4) RETURNING *",
        [brand_id, mark, user_id, category_id]
      );
      return res.json(marks.rows[0]);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async getMarks(req, res, next) {
    try {
      const { page, limit } = req.query;
      const marks = await db.query(
        `select m.mark_id, b.brand_name, m.mark, u.login, m.cu_date, m.brand_id, c.category_name, c.category_id
      from marks m, brands b, users u, categories c
      where m.brand_id = b.brand_id 
      and u.user_id = m.user_id 
      and m.category_id = c.category_id ${
        page != 0 ? `limit ${limit} offset ${(page - 1) * limit}` : ""
      }`
      );
      return res.json(marks.rows);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async getMarkCount(req, res, next) {
    try {
      const count = await db.query(`select count(*) count from marks`);
      return res.json(count.rows);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async getMarksByCategory(req, res, next) {
    try {
      const id = req.params.id;
      const marks = await db.query(
        `select m.mark_id, b.brand_name, m.mark, u.login, m.cu_date, m.brand_id, c.category_name, c.category_id
      from marks m, brands b, users u, categories c
      where m.brand_id = b.brand_id 
      and u.user_id = m.user_id 
      and m.category_id = c.category_id 
      and c.category_id = ${id}`
      );
      return res.json(marks.rows);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async updateMark(req, res, next) {
    try {
      const { brand_id, mark, user_id, category_id } = req.body;
      const mark_id = req.params.id;

      const marks = await db.query(
        "update marks set brand_id = $1, mark = $2, user_id = $3, category_id = $4 where mark_id = $5",
        [brand_id, mark, user_id, category_id, mark_id]
      );
      return res.json(marks.rows);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async deleteMark(req, res, next) {
    try {
      const id = req.params.id;
      const marks = await db.query("DELETE FROM marks where mark_id = $1", [
        id,
      ]);
      return res.json([]);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new MarkController();
