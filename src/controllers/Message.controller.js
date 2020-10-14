const { Message } = require("../utils/db");
const { handleError } = require("../utils/error");

/**
 * Auth controller
 */
class MessageController {
  constructor(socket) {
    this.socket = socket;
  }

  /**
   * Create message
   *
   * @param {String} from
   * @param {String} to
   * @param {String} data
   */
  async create(from, to, data) {
    const message = new Message({ from, to, message: data });

    try {
      //Save message to db
      const createdMessage = await message.save();
      console.log(`message ${createdMessage.id} is created`);

      console.log(`io.from.${from}.to.${to}`);

      this.socket.broadcast.emit(`io.from.${from}.to.${to}`, { message: data });

      return {
        status: 201,
        data: createdMessage,
      };
    } catch (err) {
      return handleError(err);
    }
  }

  /**
   * Get messages by user id
   *
   * @param {String} user1Id
   * @param {String} user2Id
   */
  async getByUserId(user1Id, user2Id) {
    try {
      const query = {
        $or: [
          { from: user1Id, to: user2Id },
          { to: user1Id, from: user2Id },
        ],
      }; //TODO: fix query

      const messages = await Message.find(
        query,
        {},
        { sort: { createdAt: 1 } }
      );

      return {
        status: 200,
        data: messages,
      };
    } catch (err) {
      return handleError(err);
    }
  }
}

module.exports = MessageController;
