const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next) => {
  const authtoken = req.headers["authorization"];
  const token = authtoken && authtoken.split(" ")[1];
  if (!token) return res.status(401).json({ error: "UnAuthenticated" });

  try {
    const verifiedUser = jwt.verify(token, process.env.ACCESS_TOKEN);
    req.user = verifiedUser;
    next();
  } catch (err) {
    return res.status(401).json({ error: "UnAuthorized" });
  }
};
module.exports = auth;
