const { Message } = require("../helpers/db");

/**
 * Create message
 *
 * @param {Object} messageData
 */
const create = async (messageData) => {
  const message = new Message(messageData);

  try {
    //Save message to db
    const createdMessage = await message.save();
    console.log(`message ${createdMessage.id} is created`);

    return {
      status: 201,
      data: createdMessage,
    };
  } catch (err) {
    return _handleError(err);
  }
};

//Get messages by user id
const getByUserId = async ({ userId, params: { userId: chatUserId } }) => {
  try {
    const query = {
      $or: [
        { from: userId, to: chatUserId },
        { to: userId, from: chatUserId },
      ],
    };

    const messages = await Message.find(query, {}, { sort: { createdAt: 1 } });

    return {
      status: 200,
      data: messages,
    };
  } catch (err) {
    return _handleError(err);
  }
};

//Get latest message
/* const receiveLatest = async (req) => {
  try {
    const message = await Message.findOne(
      { to: req.userId },
      {},
      { sort: { created: -1 } }
    );
    console.log(message, "------------");
    //TODO: Need to change this to get the latest message received
    return {
      status: 200,
      data: message,
    };
  } catch (err) {
    return _handleError(err);
  }
}; */

//Handle errors
function _handleError(err) {
  if (err.name == "ValidationError") {
    return {
      status: 400,
      mesasge: err,
    };
  } else {
    return {
      status: 500,
      message: "Internal server error",
    };
  }
}

module.exports = {
  create,
  getByUserId,
};
