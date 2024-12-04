const Router = require("express");
const router = new Router();
const brandController = require("../controllers/brand-controller");
//const authMiddleware = require("../middleware/authMiddleware");

router.post("/", brandController.createBrand);
router.get("/", brandController.getBrands);
router.get("/count", brandController.getBrandCount);
router.patch("/:id", brandController.updateBrand);
router.delete("/:id", brandController.deleteBrand);

module.exports = router;
