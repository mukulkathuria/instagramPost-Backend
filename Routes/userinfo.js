const auth = require("../Middlewares/authorize");
const router = require("express").Router();
const Users = require("../Models/users");

router.post("/userinfo", auth, async (req, res) => {
  if (!req.body.username) {
    res.status(422).json({ error: "username is required" });
  }
  try {
    const result = await Users.findOne({ username: req.body.username })
      .populate("Posts")
      .select("-_id -password -role -date");
    res.send(result);
  } catch (err) {
    res.status(404).json({ error: "User not found" });
  }
});

module.exports = router;
