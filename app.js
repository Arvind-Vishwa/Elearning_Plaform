const express = require("express");
const app=express();
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const Contact= require("./models/contact.js");
// const bcrypt = require('bcryptjs'); 


// const bcrypt = require('bcrypt');

app.use(cors(
)); 
const port=5000;

mongoose.connect('mongodb://127.0.0.1:27017/Elearning');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));


// Set the view engine to EJS
app.set("view engine", "ejs");

// Set the views directory
app.set("views", path.join(__dirname, "views"));

// Set the static files directory
app.use(express.static(path.join(__dirname, "public")));


app.get("/home",(req,res) =>{
    res.render("index.ejs");
});

app.post("/home",(req,res) =>{
  res.render("index.ejs");
})


const jwt = require("jsonwebtoken");
const User = require("./models/login.js");
const JWT_SECRET="3a8dbf9a12f545ee9e3c8a5a92fc72bb4a7c6ac16232d93df12a0846a6ef8edc"



// Signup
// app.post("/html/index.html", async (req, res) => {
// const { name, email, password } = req.body;

app.post('/register', async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
  
    // Basic validation (make sure all fields are filled)
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }
  
    // Ensure passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }
  
    try {
      // Create a new user object and store the password directly (without hashing)
      const newUser = new User({
        name,
        email,
        password,  // Store plain password directly
      });
  
      // Save the user to the database
      await newUser.save();
      // Send a success response
      res.render("index.ejs");
    } catch (err) {
      res.status(500).json({ error: "Error registering user", details: err.message });
    }
  });
  
// });

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public','html', 'login.html'));  // Adjust the path to where your login.html is located
  });

// Login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "User not found" });  // User does not exist
      }
  
      // For direct password storage (without hashing), compare plain passwords
      if (user.password !== password) {
        return res.status(400).json({ msg: "Invalid credentials" });  // Incorrect password
      }
  
      // If email and password match, generate a JWT token
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
  
      // Respond with the token and user details
      // res.json({
      //   msg: "Login successful",  // Message indicating success
      //   token,  // JWT token
      //   user,   // User details (exclude sensitive data like password)
      // });
      res.render("index.ejs");
    } catch (err) {
      res.status(500).json({ error: err.message });  // Handle any server-side error
    }
  });

  app.post('/contact', async (req, res) => {
    const { firstName, lastName, email, message, additionalDetail } = req.body;
  
    try {
      // Create a new contact document
      const newContact = new Contact({
        firstName,
        lastName,
        email,
        message,
        additionalDetail,
      });
  
      // Save the contact document to the database
      await newContact.save();
      res.status(201).json({ msg: 'Message received, thank you!' });
    } catch (err) {
      if (err.name === 'ValidationError') {
        // If it's a validation error, send detailed validation errors
        const validationErrors = Object.values(err.errors).map(error => error.message);
        res.status(400).json({ error: 'Validation Error', details: validationErrors });
      } else {
        // For any other errors (e.g., connection issues, unexpected errors)
        res.status(500).json({ error: 'Error saving contact message', details: err.message });
      }
    }
  });

  app.all('*',(req,res) =>{
    res.render("NotFound.ejs")
  })




app.listen(port, () => {
    console.log(`app listening on port ${port}`)
  })
  