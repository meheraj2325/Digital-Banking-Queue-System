 var express = require("express")
var mongoose = require("mongoose")
var bodyParser = require("body-parser")
var passport = require("passport")
require('dotenv').config();

// res.redirect() directs to a new URL and changes the url but we can't send data using redirect
// res.render() reders the requested web page and also allows to send data to show in the webpage
// but render() doesn't change the url 

// Need to use flash message to show messages after redirect
// Flash basically stores messages in a session and then displays them after redirect 
var flash = require('connect-flash')
var session = require("express-session")

// Passport Config
require('./controllers/passport')(passport)

// create express server
const app = express(); 
const port = process.env.PORT || 4000;

const {
  checkAuthenticated,
  checkNotAuthenticated
} = require('./controllers/ensureAuthentication');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Express session middleware
app.use(
  session({
    secret: "secret queue system",
    resave: true,
    saveUninitialized: true
  })
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Connect flash
app.use(flash())

  // Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  next()
})

// middleware for static files
app.use("/assets", express.static(__dirname + "/public")); 
app.use("/resources", express.static(__dirname + "/resources")); 

// routes
app.use("/auth", require("./routes/auth.js"));

// models


//setting ejs as view engine
app.set("view engine", "ejs");

mongoose
  .connect(
    process.env.MONGO_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    }
  )
  .then(() => console.log("connected to database!!"))
  .catch(err => console.log(err))

app.get('/dashboard', checkAuthenticated, async (req, res) => {
  var bankName = req.user.bankName;
  var branchName = req.user.branchName;
  res.render('dashboard', {bankName, branchName});
})

app.get('/test', async (req, res) => {
  res.render('test');
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
