const express = require("express");

const router = express.Router();

const workout = require("../models/Workout");

const { 
    createWorkout,
    getAllWorkouts,
    getSingleWorkout,
    deleteWorkout,
    patchWorkout
 } = require("../controllers/workoutController");

const requireAuth = require("../middleware/requireAuth");

router.use(requireAuth);

//GET all workouts
router.get("/", getAllWorkouts);

//GET a single workout
router.get("/:id", getSingleWorkout);

//POST a new workout
router.post("/",  createWorkout);

//DELETE a workout
router.delete("/:id", deleteWorkout);

//PATCH a workout
router.patch("/:id", patchWorkout);

router.get("/", (req, res) => {
    res.json(message = "GET all workouts")
});

module.exports = router;


