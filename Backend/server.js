require("dotenv").config();

const express = require("express");

const workoutsRoutes = require("./routes/workouts");

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

app.use('/uploads', express.static('uploads'));

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