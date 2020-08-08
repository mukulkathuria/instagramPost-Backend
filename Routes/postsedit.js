const router = require("express").Router();
const edits = require("../Utils/Editing/edit");

router.post("/edit", async (req, res) => {
  if (!req.query) return res.status(400).json({ error: "Invalid Query" });
  const { addcomments } = req.query;
  if (addcomments) {
    try {
      const id = await edits.onaddComment(req.body);
      return res.send(id);
    } catch (error) {
      res.status(400).json({ error: "Invalid details" });
    }
  }
  const { removecomments } = req.query;
  if (removecomments) {
    try {
      await edits.onremoveComment(req.body);
      return res.send("Removed");
    } catch (error) {
      res.status(400).json({ error: "Invalid details" });
    }
  }
  const { addLike } = req.query;
  if (addLike) {
    try {
      await edits.onaddLike(req.body);
      return res.send("Added");
    } catch (error) {
      res.status(400).json({ error: "Invalid details" });
    }
  }
  const { removeLike } = req.query;
  if (removeLike) {
    try {
      await edits.onremoveLike(req.body);
      return res.send("Removed");
    } catch (error) {
      res.status(400).json({ error: "Invalid details" });
    }
  }
  return res.status(400).json({ error: "Query doesnt match" });
});

module.exports = router;
