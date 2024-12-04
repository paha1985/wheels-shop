const ApiError = require("../error/ApiError");
const db = require("../db");

class PropertiesController {
  async createProperty(req, res, next) {
    try {
      const { category_id, description, user_id } = req.body;
      const product_property = await db.query(
        "insert into properties( category_id, description, user_id ) values ($1, $2, $3) RETURNING *",
        [category_id, description, user_id]
      );
      return res.json(product_property.rows[0]);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async getProperties(req, res, next) {
    try {
      const id = req.params.id;
      const properties = await db.query(
        `select * from properties p, users u where p.user_id = u.user_id and category_id = ${id} order by property_id `
      );
      return res.json(properties.rows);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async updateProperty(req, res, next) {
    try {
      const { description, property_id, user_id } = req.body;
      const properties = await db.query(
        "update brands set description = $1, user_id=$2 where property_id = $3",
        [description, property_id, user_id]
      );
      return res.json(properties.rows);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async deleteProperty(req, res, next) {
    try {
      const id = req.params.id;
      const properties = await db.query(
        "DELETE FROM properties where property_id = $1",
        [id]
      );
      return res.json([]);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new PropertiesController();
