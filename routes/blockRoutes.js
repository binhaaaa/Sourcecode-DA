const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/blockController");

router.get("/", ctrl.getBlocks);

module.exports = router;