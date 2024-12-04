const Router = require("express");
const router = new Router();
const basketController = require("../controllers/basket-controller");
// const authMiddleware = require("../middleware/authMiddleware");

router.post("/", basketController.addProductInBasket);
router.get("/:id", basketController.getBasket);
router.patch("/:id", basketController.updateProductInBasket);
router.delete("/:id", basketController.deleteProductFormBasket);

module.exports = router;
