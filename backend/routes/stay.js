
const router = require("express").Router();
const { searchStays } = require("../controllers/stayController");

router.get("/search", searchStays);

module.exports = router;
