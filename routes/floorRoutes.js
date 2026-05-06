const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/floorController");

router.get("/:blockId", ctrl.getFloors);

module.exports = router;