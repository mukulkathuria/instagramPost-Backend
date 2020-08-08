const router = require("express").Router();
const Posts = require("../Models/posts");
const Users = require("../Models/users");
const mul = require("../Multer/multerconfig");
const multer = require("multer");
const mongoose = require("mongoose");

router.get("/", async (_, res) => {
  const result = await Posts.find();
  res.json(result);
});

router.post("/addposts", (req, res) => {
  mul.upload(req, res, async function (err) {
    if (err instanceof multer.MulterError)
      return res.status(401).json({ error: err.message });
    else if (err) {
      return res.status(401).json({ error: "Multer Error" });
    }
    const { username, caption } = req.body;

    const file = req.file;
    if (!file) return res.status(401).json({ error: "File Type not valid" });

    const imgid = Math.floor(Math.random()*(2000-1000)+1000);
    const posts = new Posts({
      _id: new mongoose.Types.ObjectId(),
      heading: username,
      headImg: `https://picsum.photos/id/${imgid}/200/200`,
      ImgUrl: file.destination + "/" + file.filename,
      caption,
    });
    try {
      await posts.save();
      await Users.findOneAndUpdate(
        { username },
        { $push: { Posts: posts._id } }
      );
      return res.send("Saved");
    } catch (error) {
      return res.status(400).json({ error: "Server Error" });
    }
  });
});

router.post("/deletepost", async (req, res) => {
  const { postid } = req.body;

  try {
    await Posts.findByIdAndRemove(postid);
    await Users.findOneAndUpdate({}, { $pull: { Posts: { $in: [postid] } } });
    return res.send("removed");
  } catch (err) {
    return res.status(400).json({ error: "Server Error" });
  }
});

module.exports = router;
