const router = require("express").Router();
const auth = require("../middleware/auth");
const controller = require("../controllers/expenseController");

router.use(auth);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
