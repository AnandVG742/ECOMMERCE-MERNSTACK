const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { User } = require("../models/user");
const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const user_id = req.params.id;
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).send("User not found.");
    }
    res.json(user);
  } catch (error) {
    res.status(500).send("Error retrieving user: " + error.message);
  }
});

router.post("/register", async (req, res) => {
  try {
    const { username, email, password, isAdmin } = req.body.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isAdmin,
    });

    await newUser.save();

    const token = newUser.generateAuthToken();

    res.json({
      token,
      id: newUser.id,
      isAdmin: newUser.isAdmin,
    });
  } catch (error) {
    res.status(500).send("Error registering user: " + error.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body.data;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("No user found with that email.");
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send("Invalid password.");
    }

    const token = user.generateAuthToken();

    res.json({
      token,
      userId: user.id,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    res.status(500).send("Error logging in: " + error.message);
  }
});

module.exports = router;
