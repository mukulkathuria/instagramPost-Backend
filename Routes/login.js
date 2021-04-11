const router = require("express").Router();
const User = require("../Models/users");
const jwt = require("jsonwebtoken");
const JoiValidate = require("../Validations/user");
const checkPass = require("../Validations/password");
const { TokenConst } = require("../AllConstants");

router.post("/login", async (req, res) => {
  //Validate from Joi because its neccesary
  const { error } = JoiValidate.loginValidation.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  //check the User
  const user = await User.findOne({
    $or: [{ email: req.body.username }, { username: req.body.username }],
  });
  if (!user)
    return res.status(422).json({ error: "Invalid Username and Password" });

  //check the Validate Password
  const ValidPass = await checkPass.validatePass(
    req.body.password,
    user.password
  );
  if (!ValidPass)
    return res.status(422).json({ error: "Invalid Username and Password" });

  //If All Ok then and Generate Token
  const token = jwt.sign(
    {
      name: user.name,
      username: user.username,
      role: user.role,
      profileImg: user.profileImg,
    },
    process.env.ACCESS_TOKEN,
    {
      algorithm: TokenConst.accessTokenAlgo,
      expiresIn: TokenConst.accessTokenExpTime,
    }
  );
  const refreshToken = jwt.sign(
    {
      name: user.name,
      username: user.username,
      role: user.role,
      profileImg: user.profileImg,
    },
    process.env.REFRESH_TOKEN,
    {
      algorithm: TokenConst.refreshTokenAlgo,
      expiresIn: TokenConst.refreshTokenExpTime,
    }
  );

  // checking User
  res.cookie("qid", refreshToken, {
    maxAge: 1000 * 3600 * 7,
    httpOnly: true,
  });
  res.send({ access_token: token, refresh_token: refreshToken });
});

router.post("/token", (req, res) => {
  const refreshToken = req.body.token;

  if (refreshToken === null)
    return res.status(401).json({ error: "Invalid Token" });

  if (!req.headers.cookie || req.headers.cookie.split("=")[1] !== refreshToken)
    return res.status(403).json({ error: "cookie not found" });

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user) => {
    if (err) return res.status(403).json({ error: "Unauthorized" });
    const { name, username, role, profileImg } = user;
    const token = jwt.sign(
      { name, username, role, profileImg },
      process.env.ACCESS_TOKEN,
      {
        algorithm: TokenConst.accessTokenAlgo,
        expiresIn: TokenConst.accessTokenExpTime,
      }
    );

    res.send({ access_token: token });
  });
});

router.post("/logout", (req, res) => {
  if (!req.headers.cookie || req.headers.cookie.split("=")[0] !== "qid")
    return res.status(404).json({ error: "User Not Found" });

  res.clearCookie("qid");
  res.send(true);
});

module.exports = router;
