const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authRouter = express.Router();

authRouter.get("/check", (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token)
    return res.status(401).json({
      loggedIn: false,
    });
  return res.json({
    loggedIn: true,
  });
});

authRouter.post("/signup", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      res.status(400);
      throw new Error("All fields are required");
    }

    const userExists = await User.findOne({ email: email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userData = {
      email: email,
      password: passwordHash,
    };

    const user = await User.create(userData);
    if (user) {
      const id = user._id;
      const token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });
      res.cookie("accessToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.status(201).json({
        ok: true,
        message: "User created successfully",
      });
    } else {
      res.status(400);
      throw new Error("User creation failed");
    }
  } catch (error) {
    next(error);
  }
});

authRouter.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(401);
      throw new Error("User does not exists");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      res.status(400);
      throw new Error("Invalid Password");
    }

    const id = user._id;
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      ok: true,
      message: "User logged in successfully",
    });
  } catch (err) {
    next(err);
  }
});

authRouter.get("/logout", async (req, res, next) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  res.status(200).json({
    ok: true,
    message: "User logged out successfully",
  });
});

module.exports = authRouter;
