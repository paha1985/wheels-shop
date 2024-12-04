const ApiError = require("../error/ApiError");
const db = require("../db");

class BasketController {
  async addProductInBasket(req, res, next) {
    try {
      const { productId, userId, quantity } = req.body;
      const basket = await db.query(
        "insert into basket( product_id, user_id, quantity ) values ($1, $2, $3) RETURNING *",
        [productId, userId, quantity]
      );
      return res.json(basket.rows[0]);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async getBasket(req, res, next) {
    const id = req.params.id;

    try {
      const basket = await db.query(
        `	select p.product_id, p.category_id, price, img, brand_name, mark, category_name, basket_id, quantity
		from products p, categories c, marks m, brands b, basket 
		where basket.user_id = ${id}
		and p.product_id = basket.product_id
		and p.category_id = c.category_id 
      	and p.mark_id = m.mark_id
      	and m.brand_id = b.brand_id `
      );
      return res.json(basket.rows);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async getSumOfBasket(req, res) {
    try {
      const id = req.params.id;
      const sum = await db.query(
        `select sum(p.price * b.quantity) sum from basket b, products p where b.user_id = ${id} and p.product_id = b.product_id`
      );
      return res.json(sum.rows[0]);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async updateProductInBasket(req, res) {
    try {
      const { quantity } = req.body;
      const id = req.params.id;
      const basket = await db.query(
        `update basket set quantity = ${quantity} where basket_id = $1 RETURNING *`,
        [id]
      );
      return res.json(basket.rows);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async deleteProductFormBasket(req, res) {
    try {
      const id = req.params.id;
      const basket = await db.query("DELETE FROM basket where basket_id = $1", [
        id,
      ]);
      return res.json([]);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new BasketController();
