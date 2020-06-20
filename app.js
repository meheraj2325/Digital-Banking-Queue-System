const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// middleware for static files
app.use("/assets", express.static(__dirname + "/public")); 
app.use("/resources", express.static(__dirname + "/resources")); 

// routes


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

app.get('/auth/login', async (req, res) => {
    res.render('login');
});

app.get('/auth/register', async (req, res) => {
  res.render('registration');
});

app.post('/auth/register', async (req, res) => {
  console.log(req.body);
  res.redirect('back');
});

app.get('/test',async (req, res) => {
  res.render('test');
});

app.listen(port, () => console.log('Server is running on port 4000'));
