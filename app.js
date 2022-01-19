const path = require("path");
const express = require("express");
var exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const cookieParser=require('cookie-parser')
const app = express();
const port = process.env.PORT || 3000;

const authRouter=require('./routes/authRoute');
const {requireAuth,checkUser} = require('./middleware/authMiddleware')

// Bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// middleware
app.use(express.static('public'));
app.use(cookieParser())

// view engine
// express-handlebars
app.engine("handlebars", exphbs.engine({defaulLayout:'main', 
runtimeOptions: {
  allowProtoPropertiesByDefault: true,
  
  allowProtoMethodsByDefault: true,
},
layoutsDir:'views/layouts',
partialsDir:'views/partials'

}))

app.set("view engine", "handlebars");




// Mongoose
// database connection

mongoose.connect("mongodb://localhost/jwtDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("We are connected");
});





// routes
app.get('*',checkUser)
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies',requireAuth, (req, res) => res.render('smoothies'));
app.use(authRouter)
app.get("/set-cookies", (req, res) => {
  // res.setHeader('Set-Cookie', 'newUser=true');

  res.cookie("newUser", false);
  res.cookie("isEmployee", true, {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
  });

  res.send("you got the cookies!");
});

app.get("/read-cookies", (req, res) => {
  const cookies= req.cookies;
  console.log(cookies);
  res.json({cookies})

})





// server
app.listen(port, () => {
  console.log(`Server runnin' on http://localhost:${port}`);
});