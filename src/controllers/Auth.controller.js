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
          { expiresIn: "5d" }
        );

        user.isLoggedIn = true; //TODO
        user.save(); //TODO: test and remove if this is not needed

        //Publish an event when logged in
        this.socket.emit("logged");

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
        message: "Invalid username or password",
      };
    } catch (err) {
      return handleError(err);
    }
  }
}

module.exports = AuthController;
