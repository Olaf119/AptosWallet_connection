const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const nodemailer = require("nodemailer");
const isAdmin=require("../../roles/isAdmin");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/User");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  console.log("message arrived");
  // Form validation
const {errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    console.log("invalid");
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      console.log("user exist");
      return res.status(400).json({ message: "Email already exists" });
    } else {
     
      
      const newUser = new User({
      
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        temporarytoken:jwt.sign({name: req.body.name},
          keys.secretOrKey,
          { expiresIn: 1200 // expires in 20min
          }
          )
      
      });
      
      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'YOUR EMAIL',
                pass: 'YOUR PASSWORD'
            }
          });
           
           const mailOptions = {
            from: "josphatwambugu77@gmail.com",
            to:  req.body.email,
            subject: "GRACE.K ONLINE SHOPPING  Account Activation",
            text: `Hello ${
              req.body.name
            }, Please click the above link to activate our account!http://localhost:3000/verify/${jwt.sign({name: req.body.name},
            keys.secretOrKey,
            { expiresIn: 1200 // expires in 20min
            }
            )}`,
            html: `Hello<strong> ${
              req.body.name
            }</strong>,<br><br>Please click the above link to activate our account!http://localhost:3000/verify/${jwt.sign({name: req.body.name},
            keys.secretOrKey,
            { expiresIn: 1200 // expires in 20min
            }
            )}`
            };
          
          //Nodemailer SendMail
          transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
              console.log(err);
              } else {
              console.log(
              " Message Confirmation -  : " + info.response
              );
              }
              });
              res.json({
                succeed: true,
                message: "Confirmation Email has been sent"
                });
        });
      });
     
    }
  });
});



// Route to activate the user's account
router.put('/verify/:token', (req, res) => {
User.findOne({temporarytoken: req.params.token},(err,user) => {
// Throw error if cannot login
if (err) {
  throw err;
}
// Save the token from URL for verification
const token=req.params.token;
console.log("The token is",token); 
// Function to verify the user's token
jwt.verify(token,keys.secretOrKey,(err,decoded) => {  
  if (err) {
     res.json({
       success:false,
       message:"Activation link has expired"
     });
  }
 
  else{
    //remove temporary token
    user.temporarytoken=false;
//activate user
user.active=true;
// Mongoose Method to save user into the database
user.save ( err=> {
 // If unable to save user, log error info to console/terminal
 if (err) {
   console.log(err)
 } else {
   // If save succeeds, create e-mail object
   const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'jYOUR EMAIL',
        pass: 'YOUR PASSWORD'
    }
});
   
   const mailOptions = {
    from: "josphatwambugu77@gmail.com",
    to:  user.email,
    subject: "GRACE.K ONLINE SHOPPING  Account Activated",
    text: `Hello ${
     user.name
    }, Your account has been successfully activated!`,
    html: `Hello<strong> ${
     user.name
    }</strong>,<br><br>Your account has been successfully activated!`
    };
  
  //Nodemailer SendMail
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
      } else {
      console.log(
      "Activation Message Confirmation -  : " + info.response
      );
      }
      });
      res.json({
        succeed: true,
        message: "User has been successfully activated"
        });
     
 }
})
  }
})
})
});
//GOOGLE OAUTH ROUTES

router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile','email'] }));
 
router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: 'http://localhost:3000/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('http://localhost:3000/profile');
  })
//GET GOOGLE DETAILS
router.get("/customer", (req, res) => {
 res.send( req.user);
});
// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  console.log("password incorrect");
  // Form validation

  const { errors, isValid } = validateLoginInput(req.body);
  console.log("email: ", req.body.email);
  console.log("password: ", req.body.password);
  console.log("account: ", req.body.account);
  // Check validation
  if (!isValid) {
    console.log("login => invalid");
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;
  const walletAddress = req.body.account.address;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      console.log("login => user not found");
      return res.status(404).json({ message: "Email not found" });
    }

    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name,
          role:user.role
        };
        console.log("current user:", user);
        user.wallet = walletAddress;
        user.save();

        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 3600 // 1 hour in seconds
          },
          (err, token) => {
            console.log("success");
            res.json({
              success: true,
              accessToken: "Bearer " + token,
              username: user.name,
              email,
              walletAddress,
              role: user.role
            });
          }
        );
      } else {
        console.log("password incorrect");
        return res
          .status(400)
          .json({ message: "Password incorrect" });
      }
    });
  });
});
//View User List
router.get('/userlist', (req, res) => {
User.find({role:"customer"})
    .then(user => {
      if (user) {
      
        res.json(user)
      } else {
         res.json({success:false,message:"User not found"});
      }
    });
});
//Get Specific user ID
router.get('/customer/:id', (req, res) => {
User .findOne({_id:req.params.id })
      .then(user => {
        if (user){
          res.json(user)
         // if condition is TRUE do something
        } else {
          res.json({success:false,message:"user not found"})
         // do something else
        };
      })
});
//Update Customer
router.put('/update/:id' ,(req, res) => {
User  .findOne({_id:req.params.id })
      .then(user => {
        if (user){
          
          
           user.name = req.body.name;
          
          
         user.save().then(user => {
            res.json({Success:true,message:"User updated"});
          });
         // if condition is TRUE do something
        } else {
           res.json({Success:false,message:"User not updated"});
         // do something else
        };
      })
});
//Delete/Block a User
router.delete('/delete/:id' ,(req, res) => {
User.findOne({_id:req.params.id})
    .then(user => user.remove().then(() => res.json({ success: true })))
    .catch(err => {
      res.status(400).json(err);
    });
});
module.exports = router;
