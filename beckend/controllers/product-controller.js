const uuid = require("uuid");
const path = require("path");
const ApiError = require("../error/ApiError");
const db = require("../db");

class ProductController {
  async createProduct(req, res, next) {
    try {
      let { selectedCategorieId, selectedMarkId, price } = req.body;
      let fileName = "";

      if (req.files) {
        const { file } = req.files;
        fileName = uuid.v4() + ".jpg";
        file.mv(path.resolve(__dirname, "..", "static", fileName));
      }

      const product = await db.query(
        "insert into products(category_id, mark_id, price, img) values ($1, $2, $3, $4) RETURNING *",
        [selectedCategorieId, selectedMarkId, price, fileName]
      );
      return res.json(product.rows[0]);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async getProducts(req, res, next) {
    try {
      const page = req.query.page || 0;
      const limit = req.query.limit || 0;
      const userId = req.query.userId || 0;
      const search = req.query.search || "";

      const products = await db.query(
        `select t.product_id, t.category_id, price, mark_id, img, brand_name, mark, category_name, basket_id  from (select p.*, b.brand_name, m.mark, category_name
      from products p, categories c, marks m, brands b
      where p.category_id = c.category_id 
      and p.mark_id = m.mark_id
      ${
        search && search !== "undefined"
          ? `	  and (product_id in (select product_id from product_properties 
        where lower(value) like lower('%${search}%')) or ( lower(brand_name) like lower('%${search}%')) or ( lower(mark) like lower('%${search}%')))`
          : ``
      }
      and m.brand_id = b.brand_id) t
      left join  basket on  basket.product_id  = t.product_id 
        and basket.user_id = ${userId}
	  order by product_id desc
      ${page != 0 ? `limit ${limit} offset ${(page - 1) * limit}` : ""}`
      );

      return res.json(products.rows);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async getCategoryProduct(req, res, next) {
    try {
      const page = req.query.page || 0;
      const limit = req.query.limit || 0;
      const userId = req.query.userId || 0;
      const search = req.query.search || "";
      const category = req.params.category;
      const products = await db.query(
        `select t.product_id, t.category_id, price, mark_id, img, brand_name, mark, category_name, basket_id  from (select p.*, b.brand_name, m.mark, category_name
        from products p, categories c, marks m, brands b
        where p.category_id = c.category_id 
        and p.mark_id = m.mark_id
        and m.brand_id = b.brand_id
        ${
          search
            ? `	  and (product_id in (select product_id from product_properties 
          where lower(value) like lower('%${search}%')) or ( lower(brand_name) like lower('%${search}%')) or ( lower(mark) like lower('%${search}%')))`
            : ``
        }        
		    and p.category_id = ${category}) t
		    left join  basket on  basket.product_id  = t.product_id 
        and basket.user_id = ${userId}
         order by product_id desc
        ${page != 0 ? `limit ${limit} offset ${(page - 1) * limit}` : ""}`
      );

      return res.json(products.rows);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async getOneProduct(req, res, next) {
    try {
      const id = req.params.id;
      const userId = req.query.userId || 0;
      const product = await db.query(
        `select t.product_id, t.category_id, price, mark_id, img, brand_name, mark, category_name, basket_id  from (select p.*, b.brand_name, m.mark, category_name
      from products p, categories c, marks m, brands b
      where p.category_id = c.category_id 
      and p.mark_id = m.mark_id
      and m.brand_id = b.brand_id
     and product_id = $1) t
    left join  basket on  basket.product_id  = t.product_id ${
      userId > 0 ? `and basket.user_id = ${userId}` : `and user_id=0`
    }`,
        [id]
      );
      return res.json(product.rows[0]);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async getProductProperties(req, res, next) {
    try {
      const { id } = req.body;
      const propuct_properties = await db.query(
        `select pp.product_property_id, description, value 
  from product_properties pp, properties p, products 
  where pp.product_id = products.product_id 
  and p.property_id = pp.property_id
  and products.product_id = $1 order by product_property_id`,
        [id]
      );
      return res.json(propuct_properties.rows);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async updateProduct(req, res, next) {
    try {
      const id = req.params.id;
      const { selectedMarkId, selectedCategorieId, price } = req.body;
      let fileName = "";

      if (req.files) {
        const { file } = req.files;
        fileName = uuid.v4() + ".jpg";
        file.mv(path.resolve(__dirname, "..", "static", fileName));
      }

      const product = await db.query(
        "update products set mark_id = $1, category_id=$2, price=$3, img=$4 where product_id = $5",
        [selectedMarkId, selectedCategorieId, price, fileName, id]
      );
      return res.json(product.rows[0]);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async deleteProduct(req, res, next) {
    try {
      const id = req.params.id;
      const properties = await db.query(
        "delete from product_properties where product_id = $1",
        [id]
      );
      const products = await db.query(
        "DELETE FROM products where product_id = $1",
        [id]
      );
      return res.json([]);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new ProductController();
