const express = require("express");
const router = express.Router();
const isAuth = require("../middlewares/auth");
const UserController = require("../controllers/User.controller");

module.exports = () => {
  const userController = new UserController();

  /** Register user */
  router.post("/", async ({ body }, res) => {
    res.send(await userController.create(body));
  });

  /** Get all users */
  router.get("/", isAuth, async (req, res) => {
    res.send(await userController.getAll());
  });

  return router;
};
