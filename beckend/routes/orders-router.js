const Router = require("express");
const router = new Router();
const ordersController = require("../controllers/orders-controller.js");
//const authMiddleware = require("../middleware/authMiddleware");

router.post("/", ordersController.createOrder);
router.post("/product/:id", ordersController.createOrderProduct);
router.get("/", ordersController.getOrders);
router.get("/positions/:id", ordersController.getOrderPositions);
router.get("/count", ordersController.getOrdersCount);
router.get("/:id", ordersController.getMarksByCategory);
router.patch("/:id", ordersController.updateOrder);
router.delete("/:id", ordersController.deleteMark);

module.exports = router;
