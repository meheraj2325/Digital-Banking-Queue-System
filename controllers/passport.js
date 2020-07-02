const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load User model
const BankBranch = require('../models/bankBranchSchema');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy( {
        usernameField: 'bankName', passReqToCallback: true
    },async (req, bankName, password, done) => {
      // Match user
    //   console.log("Checking request")
    //   console.log(req.body)
      BankBranch.findOne({
        bankName: bankName,
        'location.division': req.body.division,
        'location.district': req.body.district,
        branchName: req.body.branchName,
      }).then(branch => {
        if (!branch) {
          return done(null, false, { message: `The ${req.body.branchName} branch of ${bankName} is not registered` });
        }

        // Match password
        bcrypt.compare(password, branch.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, branch);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );

  passport.serializeUser((branch, done) => {
    done(null, branch.id);
  });

  passport.deserializeUser( async (id, done) => {
    await BankBranch.findById(id, (err, branch) => {
      done(err, branch);
    });
  });
};
