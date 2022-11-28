const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/Authentication')

require("../DB/conn");
const User = require("../model/userSchema");


// with  async
router.post('/register', async (req, res) => {
  const { name, email, work, phone, password, cpassword } = req.body;

  if (!name || !email || !work || !phone || !password || !cpassword) {
    return res.status(422).json({ error: "fill all" });
  }

  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ error: "Email aleady exist" });
    } else if (password != cpassword) {
      return res.status(422).json({ error: "paswword not matching" });
    } else {
      const user = new User({ name, email, phone, work, password, cpassword });
      const userRegister = await user.save();
      if (userRegister) {
        res.status(201).json({ message: "data save successfully" });
      }
    }
  } catch (err) {
    console.log(err);
  }
});

// login route
router.post("/signin", async (req, res) => {
  try {
    let token;
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "fill all" });
    }
    const userLogin = await User.findOne({ email: email });
    console.log(userLogin);

    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);

      token = await userLogin.generateAuthToken();
      // console.log(token)


      if (!isMatch) {
        res.status(400).json({ error: "invalid crediential password" });
      } else {
        // res.json({ message: "user sigin successfully" });
        res.send(token)
        console.log(userLogin)

      }
    } else {
      res.status(400).json({ error: "invalid crediential email" });
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/about", authenticate, (req, res) => {
  res.send(req.rootUser);
  console.log(req.rootUser)
})

router.get('/getdata', authenticate, (req, res) => {
  res.send(req.rootUser)
})

router.post('/contact', authenticate, async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      console.log("error in contact form ")
      return res.json({ error: "plzz fill contact form" })

    }

    const userContact = await User.findOne({ _id: req.userID });

    if (userContact) {
      const userMessage = await userContact.addMessage(name, email, phone, message);

      await userContact.save();

      res.status(201).json({ message: "user contact successfully" })

    }

  } catch (error) {
    console.log(error)
  }
})


module.exports = router;
