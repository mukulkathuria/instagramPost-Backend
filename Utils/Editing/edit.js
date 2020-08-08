const Posts = require("../../Models/posts");

const addComment = async (data) => {
  const { postid, comment, username } = data;
  await Posts.findByIdAndUpdate(postid, {
    $push: { comments: { user: username, comment: comment } },
  });
  const commentid = await Posts.findOne(
    { "comments.user": username },
    { "comments.$": 1 }
  ).select("_id");
  return commentid.comments[0]._id;
};

const removeComment = async (data) => {
  const { postid, commentid } = data;
  await Posts.findByIdAndUpdate(postid, {
    $pull: { comments: { _id: commentid } },
  });
};

const addLike = async (data) => {
  const { postid, username } = data;
  await Posts.findByIdAndUpdate(postid, { $push: { like: username } });
};

const removeLike = async (data) => {
  const { postid, username } = data;
  await Posts.findByIdAndUpdate(postid, {
    $pull: { like: { $in: [username] } },
  });
};

module.exports = {
  onaddComment: addComment,
  onremoveComment: removeComment,
  onaddLike: addLike,
  onremoveLike: removeLike,
};
