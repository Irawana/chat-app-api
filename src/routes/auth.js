const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/Auth.controller");

module.exports = (io) => {
  const authController = new AuthController(io);

  /** login */
  router.post(
    "/login",
    async ({ body: { username: userName, password } }, res) => {
      const { status, data } = await authController.login(userName, password);
      res.status(status).send(data);
    }
  );

  return router;
};
