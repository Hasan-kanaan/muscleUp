require("dotenv").config({ path: '../.env' });

const express = require("express");
const path = require("path");

const workoutsRoutes = require("./routes/workouts");

const usersRoutes = require("./routes/users");

const mongoose = require("mongoose");

const app = express();

const cors = require('cors');

const multer = require ('multer');

//Middleware




app.use(express.json());

app.use(cors({ origin: 'http://localhost:3000' }));

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

//Routes
app.use("/api/workouts", workoutsRoutes);

app.use("/api/user", usersRoutes);

app.use('/uploads', express.static('uploads'));

// Serve the React frontend
app.use(express.static(path.join(__dirname, "../client/build")));


// Handle React routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

//Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    //Listener
    app.listen(process.env.PORT, () => {
      console.log("Connected to MERNLearning on port ", process.env.PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });