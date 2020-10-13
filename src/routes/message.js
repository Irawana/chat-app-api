const express = require("express");
const router = express.Router();
const isAuth = require("../middlewares/auth");
const MessageController = require("../controllers/Message.controller");

module.exports = (socket) => {
  const messageController = new MessageController(socket);

  /** Create message */
  router.post("/", isAuth, async ({ body: { from, to, message } }, res) => {
    res.send(await messageController.create(from, to, message));
  });

  /** Get messsages for two users */
  router.get(
    "/:user1Id/:user2Id",
    isAuth,
    async ({ params: { user1Id, user2Id } }, res) => {
      res.send(await messageController.getByUserId(user1Id, user2Id));
    }
  );

  return router;
};
