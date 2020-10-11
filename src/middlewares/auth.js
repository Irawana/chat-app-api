const jwt = require("jsonwebtoken");
const config = require("../../config");

module.exports = (req, res, next) => {
  //Get authorization header
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    return res
      .status(403)
      .send({ message: "Authorization header not provided!" });
  }

  //Get auth token from authorization header
  const accessToken = authHeader.split(" ")[1];
  if (!accessToken || accessToken === "") {
    req.isAuth = false;
    return res.status(403).send({ message: "No token provided!" });
  }

  let decodedToken;
  try {
    //Decode auth token
    decodedToken = jwt.verify(accessToken, config.ACCESS_TOKEN_SECRET);
  } catch (err) {
    return res.status(401).send({ message: "Unauthorized!" });
  }

  if (!decodedToken) {
    return res.status(403).send({ message: "Invalid token!" });
  }

  //Get user id from auth token
  req.userId = decodedToken.userId;
  next();
};
