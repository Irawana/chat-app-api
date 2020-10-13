const express = require("express");
var cors = require("cors");
const config = require("./config");
var router = require("./src/routes");
const isAuth = require("./src/middlewares/auth");
const UserController = require("./src/controllers/User.controller");
const messageController = require("./src/controllers/Message.controller");

//Create express app
const app = express();
//Instantiation socket.io
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const userController = new UserController();

//Middlewares
app.use(express.json());
app.use(cors());
app.use("/", router);

//Routes
//Register user
app.post("/user", async (req, res) => {
  res.send(await userController.create(req.body));
});

//Login user
app.post("/login", async (req, res) => {
  res.send(await userController.login(req.body));
});

//Get all users
app.get("/users", [isAuth], async (req, res) => {
  res.send(await userController.getAll());
});

//Send message
app.post("/message", [isAuth], async (req, res) => {
  const response = await messageController.create(req.body);
  res.send(response);

  //Publish an event on successfull message creation
  if (response.status === 201) io.emit("message", req);
});

//Get messages for a user
app.get("/messages/:userId", [isAuth], async (req, res) => {
  res.send(await messageController.getByUserId(req));
});

//Listen on connections
io.on("connection", (socket) => {
  console.log("a user connected");
});

//Listen to the port
const port = config.PORT;
const server = app.listen(port, async () => {
  console.log(`${config.SERVICE_NAME} is running on port ${port}`);
});
