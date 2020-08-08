const mongoose = require("mongoose");

const post = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: true,
    },
    headImg: {
      type: String,
      required: true,
    },
    ImgUrl: {
      type: String,
      required: true,
    },
    caption:{
      type:String,
      required:true,
    },
    like: [String],
    comments: [
      {
        user: String,
        comment: String,
      },
    ],
  },
  { collection: "Posts" }
);

module.exports = mongoose.model("Posts", post);
