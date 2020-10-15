const router = require("express").Router();
const User = require("../Models/users");
const jwt = require("jsonwebtoken");
const JoiValidate = require("../Validations/user");
const checkPass = require("../Validations/password");

router.post("/login", async (req, res) => {
  //Validate from Joi because its neccesary
  const { error } = JoiValidate.loginValidation.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  //check the User
  const user = await User.findOne({
    $or: [{ email: req.body.username }, { username: req.body.username }],
  });
  if (!user)
    return res.status(400).json({ error: "Invalid Username and Password" });

  //check the Validate Password
  const ValidPass = await checkPass.validatePass(
    req.body.password,
    user.password
  );
  if (!ValidPass)
    return res.status(400).json({ error: "Invalid Username and Password" });

  //If All Ok then and Generate Token
  const token = jwt.sign(
    { name: user.name, username: user.username },
    process.env.ACCESS_TOKEN,
    { algorithm: "HS512", expiresIn: "30m" }
  );
  const refreshToken = jwt.sign(
    { name: user.name, username: user.username },
    process.env.REFRESH_TOKEN,
    { algorithm: "HS512", expiresIn: "7h" }
  );
  res.cookie("qid", refreshToken, {
    maxAge: 1000 * 3600 * 7,
    httpOnly: true,
    sameSite: "strict",
  });
  res.send({ access_token: token, refresh_token: refreshToken });
});

router.post("/token", (req, res) => {
  const refreshToken = req.body.token;

  if (refreshToken === null)
    return res.status(401).json({ error: "Invalid Token" });

  if (req.headers.cookie.split("=")[1] !== refreshToken)
    return res.status(403).json({ error: "Unauthorized" });

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user) => {
    if (err) return res.status(403).json({ error: "Unauthorized" });
    const { name, username } = user;
    const token = jwt.sign({ name, username }, process.env.ACCESS_TOKEN, {
      algorithm: "HS512",
      expiresIn: "30m",
    });

    res.send({ access_token: token });
  });
});

module.exports = router;
