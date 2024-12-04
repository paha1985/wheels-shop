const ApiError = require("../error/ApiError");
const db = require("../db");

class OrdersController {
  async createOrder(req, res, next) {
    try {
      const { user_id, order_price, status } = req.body;
      const order = await db.query(
        "insert into orders( user_id, order_price, status ) values ($1, $2, $3) RETURNING *",
        [user_id, order_price, status]
      );
      return res.json(order.rows[0]);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async createOrderProduct(req, res, next) {
    try {
      const id = req.params.id;
      const order_id = req.body.order_id;
      const order_products = await db.query(
        `insert into order_products (order_id, product_id)
      select  $1, product_id from basket where user_id = $2`,
        [order_id, id]
      );
      await db.query(`delete from basket where user_id = $1`, [id]);
      return res.json(order_products.rows[0]);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async getOrders(req, res, next) {
    try {
      const { page, limit, user_id } = req.query;
      const orders = await db.query(
        `select * from orders ${
          user_id != 0 ? `where user_id = ${user_id}` : ""
        } order by order_date desc ${
          page != 0 ? `limit ${limit} offset ${(page - 1) * limit}` : ""
        }`
      );
      return res.json(orders.rows);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async getOrdersCount(req, res, next) {
    try {
      const user_id = req.query.user_id || 0;
      const count = await db.query(
        `select count(*) count from orders ${
          user_id === 0 ? "" : `where user_id=${user_id}`
        }`
      );
      return res.json(count.rows);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async getOrderPositions(req, res, next) {
    try {
      const id = req.params.id;
      const positions = await db.query(
        `  select b.brand_name||' '||m.mark as position_name
      from order_products o, products p, marks m, brands b
      where o.product_id = p.product_id 
      and p.mark_id = m.mark_id
      and m.brand_id = b.brand_id
    and o.order_id = $1`,
        [id]
      );
      return res.json(positions.rows);
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

  async updateOrder(req, res, next) {
    try {
      const { status } = req.body;
      const order_id = req.params.id;

      const orders = await db.query(
        "update orders set status = $1 where order_id = $2 RETURNING *",
        [status, order_id]
      );
      return res.json(orders.rows);
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

module.exports = new OrdersController();
