const router = require("express").Router();
const User = require("../Models/users");
const jwt = require("jsonwebtoken");
const JoiValidate = require("../Validations/user");
const getPass = require("../Validations/password");
const { TokenConst } = require("../AllConstants");

router.post("/register", async (req, res) => {
  //First Validate the Requests from Joi Validation
  const { error } = JoiValidate.registerValidation.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  //Check the Email or User Exist or not
  const emailexist = await User.findOne({ email: req.body.email });
  if (emailexist)
    return res.status(406).json({ error: "Email Already Exists" });

  //Check the username
  const usernameexist = await User.findOne({ username: req.body.username });
  if (usernameexist)
    return res.status(406).json({ error: "Username already Exists" });

  //Before saving to Database we have to hashed the Password
  const hashedPassword = await getPass.makePassword(req.body.password);

  const user = new User({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const saveUser = await user.save();
    //If All Ok then and Generate Token
    const token = jwt.sign(
      { name: user.name, username: user.username },
      process.env.ACCESS_TOKEN,
      {
        algorithm: TokenConst.accessTokenAlgo,
        expiresIn: TokenConst.accessTokenExpTime,
      }
    );
    const refreshToken = jwt.sign(
      { name: user.name, username: user.username, role: user.role },
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
  } catch (err) {
    res.status(500).json({ error: "Some Error Occured" });
  }
});

module.exports = router;
