const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const JWT_SECRET = "alpeshprajapti";
const jwt = require("jsonwebtoken");
const fetchuser = require('../middleware/fetchuser')

const router = express.Router();

//create user using :POST "/api/auth/createuser" No login require

router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email/password").isEmail(),
    body("password", "Password must be 8 character").isLength({ min: 8 }),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
    //check whether the user with email exists already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({
          success,
          error: "Sorry a user with this email already exists",
        });
      }
      const salt = await bcrypt.genSalt(10);

      const secPassword = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPassword,
      });
      // res.send('hello ')
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      // console.log(jwtData);
      res.json({
        success,
        authToken,
      });
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  }
);

//Authenticate user using :POST "/api/auth/login"

router.post(
  "/login",
  [
    body("email", "Enter a valid email/password").isEmail(),
    body("password", "password can not be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email: email });
      if (!user) {
        success = false;
        return res.status(500).json({
          error: "Please try to login with correct credentials",
        });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false;
        return res.status(500).json({
          success,
          error: "Please try to login with correct credentials",
        });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({success,authToken});
    } catch (error) {
      res.status(500).json({
        error: err.message,
      });
    }
  }
);

//Get loggedin user details using :POST "/api/auth/getuser" login require
router.post(
  "/getuser",fetchuser, async (req, res) => {
    try {
      let userId = req.user.id;
      const user = await User.findById(userId).select("-password");
      res.send(user)
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  }
);
module.exports = router;
