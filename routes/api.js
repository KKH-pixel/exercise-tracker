const router = require("express").Router();
const Workout = require("../models/Workout.js");
const mongodb = require("mongodb")


router.post("/api/workouts", ({ body }, res) => {
  Workout.create(body)
    .then(dbWorkoutData => {
      res.json(dbWorkoutData);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});


router.put("/api/workouts/:id", ( req, res) => {
    Workout.findByIdAndUpdate(
      req.params.id,
      { 
        $push: { exercises: req.body } 
      }, 
      { 
        new: true 
      })
        .then(dbWorkoutData => {
            res.json(dbWorkoutData);
        })
        .catch(err => {
          res.status(400).json(err);
        });
    });



  router.get("/api/workouts", (req, res) => {
    Workout.aggregate( [
        {
          $addFields: {
            totalDuration: { $sum: "$exercises.duration" } ,
          }
        }
    ]).then(dbWorkoutData => {
        res.json(dbWorkoutData);
      })
    .catch(err => {
      res.status(400).json(err);
    });
});


router.get("/api/workouts/range", (req, res) => {
    Workout.aggregate( [
        {
          $addFields: {
            totalDuration: { $sum: "$exercises.duration" },
          }
        }
    ]).sort({ day: -1 }).limit(7).then(dbWorkoutData => {
        res.json(dbWorkoutData);
      })
    .catch(err => {
      res.status(400).json(err);
    });
});

module.exports = router;