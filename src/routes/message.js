const express = require("express");
const router = express.Router();
const isAuth = require("../middlewares/auth");
const MessageController = require("../controllers/Message.controller");

module.exports = (io) => {
  let messageController;

  io.on("connection", (socket) => {
    messageController = new MessageController(socket);
  });

  /** Create message */
  router.post("/", isAuth, async ({ body: { from, to, message } }, res) => {
    const { status, data } = await messageController.create(from, to, message);
    res.status(status).send(data);
  });

  /** Get messsages for two users */
  router.get(
    "/:user1Id/:user2Id",
    isAuth,
    async ({ params: { user1Id, user2Id } }, res) => {
      const { status, data } = await messageController.getByUserId(
        user1Id,
        user2Id
      );
      res.status(status).send(data);
    }
  );

  return router;
};
