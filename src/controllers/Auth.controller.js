const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../utils/db");
const { handleError } = require("../utils/error");
const config = require("../../config");

/**
 * Auth controller
 */
class AuthController {
  constructor(io) {
    this.io = io;
  }

  /**
   * Login
   *
   * @param {String} username
   * @param {String} password
   */
  async login(username, password) {
    try {
      //Get user by username
      const user = await User.findOne({ username });

      //Compare password
      if (user && bcrypt.compareSync(password, user.password)) {
        //Generate json web token
        const accessToken = jwt.sign(
          { userId: user.id, username },
          config.ACCESS_TOKEN_SECRET,
          { expiresIn: "5d" } //TODO: reduce this after testing
        );

        //Publish an event when logged in
        this.io.on("connection", (socket) => {
          socket.emit("logged");
        });

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
        data: "Invalid username or password",
      };
    } catch (err) {
      return handleError(err);
    }
  }
}

module.exports = AuthController;
