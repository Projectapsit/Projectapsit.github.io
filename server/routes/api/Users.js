const express = require("express");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const generateToken = require("../../middleware/generateToken");
const config = require("config");
const router = express.Router();
const { User, validate } = require("../../model/Users");
var otp = Math.floor(Math.random() * 1000 + 9999);

router.get("/all", async (req, res) => {
  const result = await User.find({});
  res.status(200).json({
    status: 200,
    data: result,
    message: "Retrieved all users Successfully"
  });
});

// Signup route for a user - Bhavana
router.post("/signup", async (req, res, next) => {
  try {
    // Validating if JOI constraints match
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Checking if a user exists with the same email
    let existing_user = await User.findOne({
      email: req.body.email
    });
    if (existing_user)
      return res.status(400).send({ message: "Email already exists" });
    // If the user with same mail doesn't exists , then create a new user
    else {
      let user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        isAdmin: req.body.isAdmin,
        wallet: 15000
      });
      // Encrypting the password and storing it in the databsae
      user.password = await bcrypt.hash(user.password, 10);
      await user.save();
      res.status(200).json({
        status: 200,
        data: user,
        message: "Created One user Successfully"
      });
    }
  } catch (err) {
    next(err);
  }
});

// Login route for a user - Bhavana
router.post("/login", async (req, res, next) => {
  try {
    let username = await User.findOne({ email: req.body.email });
    // Checks if the user with specified email is present in database
    if (!username) {
      return res.status(400).send({ message: "*Account not found" });
    }
    // Compares the password entered by the user and the password stored in the database
    if (!bcrypt.compareSync(req.body.password, username.password)) {
      return res.status(400).send({ message: "*Invalid Credentials" });
    }
    // Specifying the payload which is to be used for creating a token
    var payload = {
      _id: username._id,
      email: username.email,
      name: username.name,
      wallet: username.wallet,
      isAdmin: username.isAdmin
    };
    // Generating the token using the above payload
    global.returned_token = generateToken(payload);
    // Sending the success message,token and isAdmin to the client side
    res.status(200).json({
      status: 200,
      message: "Logged in successfully",
      data: returned_token,
      isAdmin: payload.isAdmin
    });
  } catch (err) {
    next(err);
  }
});

// Reset Password Route for a user - Bhavana
router.put("/reset_password", async (req, res, next) => {
  try {
    // Checks if the user exists with the email specified
    let username = await User.findOne({ email: req.body.email });
    if (!username) {
      return res.status(400).send({ message: "Invalid Credentials" });
    } else {
      req.body.password = await bcrypt.hash(req.body.password, 10);
      await User.findOneAndUpdate(
        { email: req.body.email },
        {
          $set: {
            password: req.body.password
          }
        }
      );
      // If the user exists then update the password
      res.status(200).json({
        status: 200,
        message: "Your password has been updated"
      });
    }
  } catch (err) {
    next(err);
  }
});

// Send OTP for for Email Verification - Bhavana
router.post("/send_otp", async (req, res, next) => {
  try {
    // Generating random number
    otp = Math.floor(Math.random() * 5999 + 2999);
    // Checking if the mail exists
    let username = await User.findOne({ email: req.body.email });
    // Specifying the smtp service
    var smtpTransport = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "bhavanagupta250@gmail.com ",
        pass: "guptabhavana250"
      }
    });

    // Sending the mail to the the user with the given email
    await smtpTransport.sendMail({
      from: "bhavanagupta250@gmail.com",
      to: req.body.email,
      subject: "OTP Verification",
      html:
        "<hr/><b>This is a system generated mail. Please do not reply to this email ID.<b/><hr/> <br/> <b>" +
        req.body.name +
        " , <b/> <br/><br/> Your One Time Password (OTP) for Account Verification  is : " +
        otp +
        "<br/>Please note, this OTP is valid only for mentioned transaction and cannot be used for any other transaction.Please do not share this One Time Password with anyone" // html body
    });
    res.status(200).json({
      status: 200,
      message: "Email send successfully"
    });
  } catch (err) {
    next(err);
  }
});

// Verify OTP - Bhavana
router.post("/verify_otp", async (req, res, next) => {
  try {
    // Get the otp from the user
    let otp_user = req.body.otp;
    if (otp == otp_user) {
      res.status(200).json({
        status: 200,
        message: "Email verified"
      });
    } else {
      res.status(400).json({
        status: 400,
        message: "Invalid OTP."
      });
    }
  } catch (err) {
    next(err);
  }
});

router.put("/buy", async (req, res, next) => {
  try {
    // Checks if the user exists with the email specified
    let username = await User.findOne({ email: req.body.email });
    if (!username) {
      return res.status(400).send({ message: "Invalid Credentials" });
    } else {
      await User.findOneAndUpdate(
        { email: req.body.email },
        {
          $push: {
            company: {
              ticker_name: req.body.ticker_name,
              current_price: req.body.current_price,
              buy: true,
              sell: false,
              buy_date: new Date().toISOString(),
              buying_quantity: req.body.qty
            }
          },
          $set: {
            wallet: username.wallet - +req.body.price
          }
        }
      );
      res.status(200).json({
        status: 200,
        data: username.wallet,
        message: "buy stock Successfully"
      });
    }
  } catch (err) {
    console.log(err);
  }
});

router.put("/sell", async (req, res, next) => {
  try {
    // Checks if the user exists with the email specified
    let username = await User.findOne({ email: req.body.email });
    // console.log(username);
    if (!username) {
      return res.status(400).send({ message: "Invalid Credentials" });
    } else {
      console.log(req.body);
      let user = await User.update(
        { "company.ticker_name": req.body.ticker_name },
        {
          $set: {
            "company.$.buy": true,
            "company.$.sell": true,
            "company.$.sell_price": req.body.sell_price,
            wallet: username.wallet + req.body.price,
            "company.$.sell_date": new Date().toISOString(),
            "company.$.selling_quantity": req.body.selling_quantity
          }
        },
        { upsert: true }
      );
      console.log(user);
      res.status(200).json({
        status: 200,
        message: "Company Added Successfully"
      });
    }
  } catch (err) {
    next(err);
  }
});
//piyush kumar
router.get("/history/:email", async (req, res, next) => {
  try {
    let email = req.params.email;
    console.log(email);
    let result = await User.find(
      { email: req.params.email },
      { company: 1, _id: 0 }
    );
    res.status(200).json({
      status: 200,
      data: result,
      message: "Retrieved user Successfully"
    });
  } catch (err) {
    next(err);
  }
});

router.post("/wallet", async (req, res, next) => {
  try {
    // Checks if the user exists with the email specified
    let username = await User.findOne({ email: req.body.email });
    if (!username) {
      return res.status(400).send({ message: "Invalid Credentials" });
    } else {
      await User.find({ email: req.body.email }, { wallet: 1, _id: 0 });
      res.status(200).json({
        status: 200,
        data: username.wallet,
        message: "Wallet Received  Successfully"
      });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/myStocks", async (req, res, next) => {
  try {
    // Checks if the user exists with the email specified
    let username = await User.findOne({ email: req.body.email });
    if (!username) {
      return res.status(400).send({ message: "Invalid Credentials" });
    } else {
      const result = await User.find({ email: req.body.email });
      console.log(result);
      res.status(200).json({
        status: 200,
        data: result,
        message: "Stocks Received  Successfully"
      });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
