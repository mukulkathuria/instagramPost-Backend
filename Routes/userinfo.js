const auth = require("../Middlewares/authorize");
const router = require("express").Router();
const Users = require("../Models/users");

router.get("/userinfo", auth, async (req, res) => {
  const result = await Users.findOne({ username: req.user.username })
    .populate("Posts")
    .select("-_id -password -role -date");
  res.send(result);
});

module.exports = router;
