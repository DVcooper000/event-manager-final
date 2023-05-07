import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
const PORT = 3000;
const MONGODB_URL =
  "mongodb+srv://smelly:Marijus888@cluster0.xsiyvxm.mongodb.net/Event_manager?retryWrites=true&w=majority";
app.use(express.json());
mongoose.set("strictQuery", false);
mongoose
  .connect(MONGODB_URL)
  .then(() => console.log("Connected to mongo db"))
  .catch((e) => console.log("Error collecting mongo db" + e));

import User from "./models/User.model.js";
//routes

app.get("/api/user-info", async (req, res) => {
  try {
    // Retrieve all users from the database
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Serverio klaida");
  }
});

app.post("/api/user-info", (req, res) => {
  const newUserPayload = req.body;
  const user = new User(newUserPayload);
  user
    .save()
    .then((data) => {
      console.log(data);

      res.json();
    })
    .catch((e) => console.log(e));
});

app.put("/api/user-info/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUserData = req.body;

    console.log("Updating user with ID:", userId);
    console.log("New user data:", updatedUserData);

    const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, {
      new: true,
    });

    console.log("Updated user:", updatedUser);

    if (!updatedUser) {
      console.log("User not found!");
      return res.status(404).json({ message: "User not found!" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.log(error);
    res.json({ message: "Error..." });
  }
});

app.listen(PORT, () => console.log("Server is running on port:" + PORT));
