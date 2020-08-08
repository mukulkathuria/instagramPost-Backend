const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

//Route Imports
const registerRoute = require("./Routes/register");
const LoginRoute = require("./Routes/login");
const PostsRoute = require("./Routes/posts");
const PostseditRoute = require("./Routes/postsedit");
const UserinfoRoute = require("./Routes/userinfo");

//Middlewares
app.use("/photos", express.static("Photos"));
app.use(express.json());
app.use(cors());

//Route Middlewares
app.use("/user", registerRoute);
app.use("/user", LoginRoute);
app.use("/user", UserinfoRoute);
app.use("/posts", PostsRoute);
app.use("/posts", PostseditRoute);

//Connection to Database
mongoose.connect(
  process.env.MONGODB_LINK,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  () => {
    app.listen(process.env.PORT_NO, () =>
      console.log(
        `Server is Running on ${process.env.PORT_NO} Mongo Connected..`
      )
    );
  }
);
