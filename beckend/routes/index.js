const Router = require("express");
const router = new Router();

const userRouter = require("./user-router");
const brandRouter = require("./brand-router");
const markRouter = require("./mark-router");
const productRouter = require("./product-router");
const categoriesRouter = require("./categories-router");
const propertiesRouter = require("./properties-router");
const productPropertiesRouter = require("./product-properties-router");
const basketRouter = require("./basket-router");
const ordersRouter = require("./orders-router");

router.use("/user", userRouter);
router.use("/brand", brandRouter);
router.use("/mark", markRouter);
router.use("/product", productRouter);
router.use("/categories", categoriesRouter);
router.use("/properties", propertiesRouter);
router.use("/product-properties", productPropertiesRouter);
router.use("/basket", basketRouter);
router.use("/orders", ordersRouter);

module.exports = router;
