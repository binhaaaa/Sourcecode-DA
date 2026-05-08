const express = require("express");

const router = express.Router();

const ctrl = require("../controllers/contractController");

// ================= ROUTES =================
router.get("/", ctrl.getContracts);

router.post("/", ctrl.createContract);

router.put("/:id", ctrl.updateContract);

router.delete("/:id", ctrl.deleteContract);

module.exports = router;