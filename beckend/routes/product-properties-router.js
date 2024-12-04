const Router = require("express");
const router = new Router();
const productPropertiesController = require("../controllers/product-properties-controller.js");
//const authMiddleware = require("../middleware/authMiddleware");

router.post("/", productPropertiesController.createProductProperty);
// router.get("/", productController.getProducts);
// router.post("/", productController.createProduct);
router.get("/:id", productPropertiesController.getProductProperties);
// router.patch("/", markController.updateMark);
router.delete("/:id", productPropertiesController.deleteProductProperties);

module.exports = router;
