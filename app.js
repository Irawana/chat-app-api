const express = require("express");
const cors = require("cors");
const config = require("./config");
const router = require("./src/routes");
const userRouter = require("./src/routes/user");
const authRouter = require("./src/routes/auth");
const messageRouter = require("./src/routes/message");

//Create express app
const app = express();

//Middlewares
app.use(express.json());
app.use(cors());
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use("/", router);
app.use("/user", userRouter);
app.use("/auth", authRouter(io));
app.use("/message", messageRouter(io));

//Listen to the port
http.listen(config.PORT, () => {
  console.log(`listening on port :${config.PORT}`);
});
