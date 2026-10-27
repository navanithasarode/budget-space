
const router = require("express").Router();
const {
  searchTransport,
  getTrainFare,
  searchTrains
} = require("../controllers/transportController");

router.get("/search", searchTransport);
router.get("/train-fare", getTrainFare);
router.get("/trains", searchTrains);


module.exports = router;
