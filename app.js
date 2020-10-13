const express = require("express");
const cors = require("cors");
const config = require("./config");
const router = require("./src/routes");
const userRouter = require("./src/routes/auth");
const authRouter = require("./src/routes/auth");
const messageRouter = require("./src/routes/message");

//Create express app
const app = express();

//Middlewares
app.use(express.json());
app.use(cors());
app.use("/", router);
app.use("/user", userRouter);

//Listen to the port
const port = config.PORT;
const server = app.listen(port, async () => {
  console.log(`${config.SERVICE_NAME} is running on port ${port}`);
});

//Create server
const io = require("socket.io")(server);

//Initiate socket io connection
io.on("connection", (socket) => {
  app.use("/auth", authRouter);
  app.use("/message", messageRouter(socket));
});
