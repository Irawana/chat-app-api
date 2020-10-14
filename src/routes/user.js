const express = require("express");
const router = express.Router();
const isAuth = require("../middlewares/auth");
const UserController = require("../controllers/User.controller");

const userController = new UserController();

/** Register user */
router.post("/", async ({ body }, res) => {
  const { status, data } = await userController.create(body);
  res.status(status).send(data);
});

/** Get all users */
router.get("/", isAuth, async (req, res) => {
  const { status, data } = await userController.getAll();
  res.status(status).send(data);
});

module.exports = router;
