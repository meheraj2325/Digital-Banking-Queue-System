const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
// Load User model
const BankBranch = require("../models/bankBranchSchema");

const {
  checkAuthenticated,
  checkNotAuthenticated
} = require('../controllers/ensureAuthentication');

router.get("/login", checkNotAuthenticated, async (req, res) => {
  res.render("login");
});

router.post('/login', async (req, res, next) => {
  console.log(req.body)
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/auth/login',
    failureFlash: true
  })(req, res, next)
})

router.get("/register", checkNotAuthenticated, async (req, res) => {
  res.render("registration");
});

router.post("/register", async (req, res) => {
  console.log(req.body);
  const {
    bankName,
    division,
    district,
    additionalLocation,
    branchName,
    phoneNumber,
    mobileNumber,
    email,
    password,
    password2,
  } = req.body;

  let errors = [];

  if (
    !bankName ||
    !division ||
    !district ||
    !branchName ||
    !phoneNumber ||
    !password ||
    !password2
  ) {
    errors.push({ msg: "Please enter all required fields" });
  }

  if (password != password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (mobileNumber && mobileNumber.length < 11) {
    errors.push({ msg: "Mobile number must be atleast 11 digits" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("registration", {
      errors,
      bankName,
      division,
      district,
      additionalLocation,
      branchName,
      phoneNumber,
      mobileNumber,
      email,
      password,
      password2
    });
  } else {
    BankBranch.findOne({
      bankName: bankName,
      'location.division': division,
      'location.district': district,
      branchName: branchName,
    }).then((branch) => {
      if (branch) {
        errors.push({ msg: `The ${branchName} branch of ${bankName} is already registered.` });
        res.render("registration", {
          errors,
          bankName,
          division,
          district,
          additionalLocation,
          branchName,
          phoneNumber,
          mobileNumber,
          email,
          password,
          password2
        });
      } else {
        const newBranch = new BankBranch({
          bankName: bankName,
          location: {
            division: division,
            district: district,
            additionalInfo: additionalLocation,
          },
          branchName: branchName,
          phoneNumber: phoneNumber,
          mobileNumber: mobileNumber,
          email: email,
          password: password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newBranch.password, salt, async (err, hash) => {
            if (err) throw err;
            newBranch.password = hash;
            await newBranch
              .save()
              .then((savedBranch) => {
                req.flash(
                  "success_msg",
                  `The ${savedBranch.branchName} branch of ${savedBranch.bankName} is now registered and can log in`
                );
                res.redirect("/auth/login");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});

// Logout
router.get('/logout', (req, res) => {
  if(req.user){
    req.logout()
    req.flash('success_msg', 'You are logged out')  
  }
  else{
    req.flash('error_msg', 'You are not logged in')
  }
  res.redirect('/auth/login')
})


module.exports = router;
