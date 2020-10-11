const express = require("express");
const config = require("./config");
const isAuth = require("./src/middlewares/auth");
const UserController = require("./src/controllers/User.controller");

const app = express();
const userController = new UserController();

//Middlewares
app.use(express.json());

//Routes
//Register user
app.post("/user", async (req, res) => {
  res.send(await userController.create(req.body));
});

//Login user
app.get("/login", async (req, res) => {
  res.send(await userController.login(req.body));
});

//Get all users
app.get("/user", [isAuth], async (req, res) => {
  res.send(await userController.getAll());
});

//Send message

//Receive message

//Get message history

//Listen to the port
const port = config.PORT;
const server = app.listen(port, async () => {
  console.log(`${config.SERVICE_NAME} is running on port ${port}`);
});
