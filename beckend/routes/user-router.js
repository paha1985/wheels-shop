const Router = require("express");
const router = new Router();
const userController = require("../controllers/user-controller");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/registration", userController.createUser);
router.get("/", userController.getUsers);
router.patch("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

router.post("/login", userController.login);
router.get("/auth", authMiddleware, userController.check);

module.exports = router;
