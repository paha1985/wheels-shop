const Router = require("express");
const router = new Router();
const productController = require("../controllers/product-controller.js");

router.get("/", productController.getProducts);
router.post("/", productController.createProduct);
router.get("/:id", productController.getOneProduct);
router.get("/category/:category", productController.getCategoryProduct);
router.patch("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
