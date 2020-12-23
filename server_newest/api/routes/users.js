const express = require("express");

const UsersController = require("./../controllers/users");
const checkAuth = require("./../middleware/checkAuth");

const router = express.Router();

router.get("/", checkAuth, UsersController.getAll);
router.get("/:userId", checkAuth, UsersController.getOne);
router.post("/", UsersController.create);
router.patch("/:userId", checkAuth, UsersController.update);
router.delete("/:userId", checkAuth, UsersController.delete);

router.get("/confirm/:verifyToken", UsersController.confirmation);
router.post("/confirm/resend", UsersController.resend);
router.post("/login", UsersController.login);
router.post("/login/refresh", UsersController.refresh);
router.post("/recovery", UsersController.recovery);
router.post("/forgot", UsersController.forgot);

module.exports = router;
