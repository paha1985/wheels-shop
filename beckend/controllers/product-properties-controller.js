const ApiError = require("../error/ApiError");
const db = require("../db");

class ProductPropertiesController {
  async createProductProperty(req, res, next) {
    try {
      const { product_id, property_id, value } = req.body;
      const product_property = await db.query(
        "insert into product_properties( product_id, property_id, value ) values ($1, $2, $3) RETURNING *",
        [product_id, property_id, value]
      );
      return res.json(product_property.rows[0]);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async getProductProperties(req, res, next) {
    try {
      const id = req.params.id;
      const propuct_properties = await db.query(
        `select pp.*, p.description from (select pp.product_property_id, pp.property_id, value 
      from product_properties pp, products 
      where pp.product_id = products.product_id 
      and products.product_id = $1 ) pp 
      right join (select * from properties where category_id = (select category_id from products where product_id = $1)) p on p.property_id = pp.property_id`,
        [id]
      );

      return res.json(propuct_properties.rows);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async deleteProductProperties(req, res) {
    try {
      const id = req.params.id;
      const productProperties = await db.query(
        "DELETE FROM product_properties where product_id = $1",
        [id]
      );
      return res.json([]);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new ProductPropertiesController();
