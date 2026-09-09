const router = require("express").Router();
const auth = require("../middleware/auth");
const controller = require("../controllers/budgetController");
const expenses = require("../controllers/expenseController");

router.use(auth);
router.get("/", controller.list);
router.post("/", controller.create);
router.get("/:id", controller.get);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);
router.get("/:budgetId/expenses", expenses.list);
router.post("/:budgetId/expenses", expenses.create);

module.exports = router;
