const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const userModel = require("./models/user");

const app = express();
const port = 3000;

app.set("view engine", "ejs");

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

// Read Route - Display all users
app.get("/read", async (req, res) => {
  try {
    const users = await userModel.find(); // Fetch all users from the database
    res.render("read", { users }); // Pass users to the EJS template
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching users");
  }
});

// Create Route - Show form to create a new user

app.post("/create", async (req, res) => {
  const { name, email, image } = req.body;

  let newUser = await userModel.create({
    name,
    email,
    image,
  });

  //   res.send(newUser);
  res.redirect("/read");
});

// Update Route - Show form to edit a user
app.get("/edit/:id", async (req, res) => {
  const user = await userModel.findById(req.params.id);
  res.render("edit", { user });
});

// Update Route - Handle form submission to update a user

app.post("/edit/:id", async (req, res) => {
  const { name, email, image } = req.body;
  await userModel.findByIdAndUpdate(req.params.id, { name, email, image });
  res.redirect("/read");
});

// Delete Route - Delete a user by ID
app.post("/delete/:id", async (req, res) => {
  try {
    const userId = req.params.id; // extract id from URL

    await userModel.findByIdAndDelete(userId); // delete from DB

    console.log(`🗑️ User with ID ${userId} deleted`);
    res.redirect("/read"); // go back to the users list
  } catch (err) {
    console.error("❌ Error deleting user:", err);
    res.status(500).send("Error deleting user");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
