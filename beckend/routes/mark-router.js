const Router = require("express");
const router = new Router();
const markController = require("../controllers/mark-controller.js");
//const authMiddleware = require("../middleware/authMiddleware");

router.post("/", markController.createMark);
router.get("/", markController.getMarks);
router.get("/count", markController.getMarkCount);
router.get("/:id", markController.getMarksByCategory);
router.patch("/:id", markController.updateMark);
router.delete("/:id", markController.deleteMark);

module.exports = router;
