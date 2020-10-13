const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../helpers/db");
const config = require("../../config");

//TODO: convert this to functional module and hadle errors in a common place
/**
 * User controller
 */
class UserController {
  /**
   * Create user
   *
   * @param {Object} userData
   */
  async create(userData) {
    const user = new User(userData);

    try {
      if (await User.findOne({ username: user.username })) {
        //Return error if an user already exists for the username
        return {
          status: 400,
          message: `Username '${user.username}' is already exists`,
        };
      }

      //Hash password
      user.password = bcrypt.hashSync(userData.password, 10);
      //Save user to db
      const createdUser = await user.save();
      console.log(`user ${createdUser.id} is created`);

      return {
        status: 201,
      };
    } catch (err) {
      return this._handleError(err);
    }
  }

  /**
   *  Login user
   *
   * @param {Object} authData
   */
  async login({ username, password }) {
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

        return {
          status: 200,
          data: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            isLoggedIn: true,
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
      return this._handleError(err);
    }
  }

  /**
   * Get all users
   */
  async getAll() {
    try {
      const users = await User.find();

      return {
        status: 200,
        data: users,
      };
    } catch (err) {
      return this._handleError(err);
    }
  }

  //Handle errors
  _handleError(err) {
    if (err.name == "ValidationError") {
      return {
        status: 400,
        message: err,
      };
    } else {
      return {
        status: 500,
        message: "Internal server error",
      };
    }
  }
}

module.exports = UserController;
