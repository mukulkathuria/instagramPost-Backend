const mongoose = require("mongoose");

const user = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 4,
  },
  username: {
    type: String,
    required: true,
    min: 4,
  },
  email: {
    type: String,
    required: true,
    min: 5,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
  profileImg:{
    type:String,
    default:"Photos/avatar.jpg",
  },
  Posts:[{
    type:mongoose.Types.ObjectId,
    ref:"Posts",
  }],
  follows:[String],
  followers:[String],
  role: {
    type: String,
    default: "normal"
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Users", user);
