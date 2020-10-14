const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../utils/db");
const { handleError } = require("../utils/error");
const config = require("../../config");

/**
 * Auth controller
 */
class AuthController {
  constructor(socket) {
    this.socket = socket;
  }

  /**
   * Login
   *
   * @param {String} userName
   * @param {String} password
   */
  async login(userName, password) {
    try {
      //Get user by userName
      const user = await User.findOne({ username: userName });

      //Compare password
      if (user && bcrypt.compareSync(password, user.password)) {
        //Generate json web token
        const accessToken = jwt.sign(
          { userId: user.id, userName },
          config.ACCESS_TOKEN_SECRET,
          { expiresIn: "5d" } //TODO: reduce this after testing
        );

        user.isLoggedIn = true;
        user.save();

        //Publish an event when logged in
        this.socket.broadcast.emit("logged");

        return {
          status: 200,
          data: {
            user,
            accessToken,
          },
        };
      }

      //Return unauthorized error
      return {
        status: 401,
        data: "Invalid userName or password",
      };
    } catch (err) {
      return handleError(err);
    }
  }

  async logout(userId) {
    const user = await User.findOne({ _id: userId });
    user.isLoggedIn = false;
    user.save();

    this.socket.broadcast.emit("logout");

    return { status: 200 };
  }
}

module.exports = AuthController;
