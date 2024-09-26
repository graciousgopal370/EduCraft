const express = require("express");
const connectDb = require("./config/db");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose  = require("mongoose");

const passport=require("passport");


const app = express();
const PORT = 3000;

connectDb();
require("./models/User.js");
require("./models/Post.js");
require("./models/Comment.js");

app.set("view-engine","ejs");
app.use(express.static("public")); 
app.use(express.json());

app.use(session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({mongooseConnection: mongoose.connection}),
}))


require("./config/passport.js");
app.use(passport.initialize());  //set the passport as middleware
app.use(passport.session()); 


//it is necessary to set all routes related to authentication after setting up the session
app.use("/auth",require("./routes/auth.js"));
app.use("/",require("./routes/index.js"));
app.use("/post",require("./routes/post.js"));
app.use("/comment",require("./routes/comment.js"));

app.get("/internal-server-error",(req,res)=>{
    res.render("error-500.ejs");
});

app.get("/*", (req, res) => {
    res.render("error-404");
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});