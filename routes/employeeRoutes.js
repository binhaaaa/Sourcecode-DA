
const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/employeeController");

router.get("/", ctrl.getEmployees);
router.post("/", ctrl.createEmployee);
router.put("/:id", ctrl.updateEmployee);
router.delete("/:id", ctrl.deleteEmployee);

module.exports = router;

