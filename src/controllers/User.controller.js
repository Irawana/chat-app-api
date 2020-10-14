const bcrypt = require("bcrypt");
const { User } = require("../utils/db");
const { handleError } = require("../utils/error");

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
          data: `Username '${user.username}' is already exists`,
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
      return handleError(err);
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
      return handleError(err);
    }
  }
}

module.exports = UserController;
