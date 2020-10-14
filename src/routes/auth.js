const express = require("express");
const router = express.Router();
const isAuth = require("../middlewares/auth");
const AuthController = require("../controllers/Auth.controller");
const auth = require("../middlewares/auth");

module.exports = (io) => {
  let authController;

  io.on("connection", (socket) => {
    authController = new AuthController(socket);
  });

  /** login */
  router.post("/login", async ({ body: { userName, password } }, res) => {
    const { status, data } = await authController.login(userName, password);
    res.status(status).send(data);
  });

  router.post("/logout", isAuth, async ({ userId }, res) => {
    const { status } = await authController.logout(userId);
    res.status(status).send();
  });

  return router;
};
