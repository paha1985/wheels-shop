const Router = require("express");
const router = new Router();
const categoriesController = require("../controllers/categories-controller.js");
//const authMiddleware = require("../middleware/authMiddleware");

router.post("/", categoriesController.createCategorie);
router.get("/", categoriesController.getCategories);
router.patch("/", categoriesController.updateCategorie);
router.delete("/:id", categoriesController.deleteCategorie);
router.get("/count", categoriesController.getCategoryCount);

module.exports = router;
