const Router = require("express");
const router = new Router();
const propertiesController = require("../controllers/properties-controller.js");
//const authMiddleware = require("../middleware/authMiddleware");

router.post("/", propertiesController.createProperty);
router.get("/:id", propertiesController.getProperties);
router.patch("/", propertiesController.updateProperty);
router.delete("/:id", propertiesController.deleteProperty);

module.exports = router;
