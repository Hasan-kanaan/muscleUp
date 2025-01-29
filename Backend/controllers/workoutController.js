const workout = require("../models/Workout");

const mongoose = require("mongoose");

const multer = require("multer");

const path = require("path");

// Multer configuration for uploading images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // save uploads in a folder named 'uploads'
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // save the file with a timestamp to avoid duplicates
  },
});

const upload = multer({ storage: storage });

//GET all workouts
const getAllWorkouts = async (req, res) => {
  const user_id = req.user._id;
  try {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const reps = req.query.reps;
    const sets = req.query.sets;

    //Validate page and limit
    if (isNaN(offset) || offset < 0) {
      return res
        .status(400)
        .json({ error: "Offset must be a positive number" });
    }

    if (isNaN(limit) || limit < 1) {
      return res.status(400).json({ error: "Limit must be a positive number" });
    }
    if (typeof search !== "string") {
      return res.status(400).json({ error: "Search must be a string" });
    }
    if (reps !== undefined && (isNaN(reps) || reps < 0)) {
      return res.status(400).json({ error: "Reps must be a positive number" });
    }
    if (sets !== undefined && (isNaN(sets) || sets < 0)) {
      return res.status(400).json({ error: "Sets must be a positive number" });
    }

    //Building a qyuery object
    const query = {
      user_id,
      title: { $regex: new RegExp(search, "i") },
    };

    if (reps !== undefined && reps != 0) {
      query.reps = reps;
    }

    if (sets !== undefined && sets != 0) {
      query.sets = sets;
    }

    const totalItems = await workout.countDocuments({
      user_id,
      title: { $regex: new RegExp(search, "i") },
    });

    const workouts = await workout
      .find(query)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

    const response = {
      workouts,
      pagination: {
        totalItems,
        currentPage: Math.ceil(offset / limit + 1),
        hasNextPage: totalItems > offset + limit,
        hasPreviousPage: offset > 0,
      },
    };

    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//GET a single workout
const getSingleWorkout = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Workout not found" });
  }
  const singleWorkout = await workout.findById(id);
  if (!singleWorkout) {
    res.status(404).json({ message: "Workout not found" });
  }
  res.status(200).json(singleWorkout);
};

//POST a new workout
const createWorkout = async (req, res) => {
  upload.single("image")(req, res, async function (err) {
    // Handle multer errors
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(500).json({ message: err.message });
    }

    // Extract form data and file info after upload middleware completes
    const { title, reps, sets, description } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    try {
      const user_id = req.user._id;
      if (!user_id) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      // Create a new workout entry in the database
      const newWorkout = await workout.create({
        title,
        reps,
        sets,
        description,
        user_id,
        image: imagePath, // save the image path in the document
      });

      // Respond with the created workout
      res.status(201).json(newWorkout);
    } catch (err) {
      // Catch any errors during the workout creation process
      res.status(400).json({ error: err.message });
    }
  });
};

//DELETE a workout
const deleteWorkout = async (req, res) => {
  const { id } = req.params;

  // Check if the ID is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Workout ID" });
  }

  try {
    const deletedWorkout = await workout.findOneAndDelete({ _id: id });
    if (!deletedWorkout) {
      return res.status(404).json({ message: "Workout not found" });
    }
    res.status(200).json({ message: "Workout deleted successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the workout" });
  }
};

//PATCH a workout
const patchWorkout = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Workout not found" });
  }
  // Handle the file upload
  upload.single("image")(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(500).json({ message: err.message });
    }

    // Find the existing workout
    const existingWorkout = await workout.findById(id);
    if (!existingWorkout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    // Update the fields, and handle the image if uploaded
    const { title, reps, sets, description } = req.body;
    const imagePath = req.file
      ? `/uploads/${req.file.filename}`
      : existingWorkout.image; // Use the new image if uploaded, otherwise keep the existing one

    try {
      const updatedWorkout = await workout.findByIdAndUpdate(
        { _id: id },
        {
          title: title || existingWorkout.title,
          reps: reps || existingWorkout.reps,
          sets: sets || existingWorkout.sets,
          description: description || existingWorkout.description,
          image: imagePath, // Update image path if a new one was uploaded
        },
        { new: true } // Return the updated workout after the update
      );

      res.status(200).json(updatedWorkout);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
};

module.exports = {
  createWorkout,
  getAllWorkouts,
  getSingleWorkout,
  deleteWorkout,
  patchWorkout,
};
