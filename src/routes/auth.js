const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/Auth.controller");

module.exports = (socket) => {
  const authController = new AuthController(socket);

  /** login */
  router.post("/login", async ({ body: { userName, password } }, res) => {
    const response = await authController.login(userName, password);

    res.send(response);
  });

  return router;
};
