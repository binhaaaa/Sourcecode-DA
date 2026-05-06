const router = require("express").Router();

router.get("/", (req, res) => {
    res.json([
        { Room: "P101", Month: "3/2025", Total: 3000000 }
    ]);
});

module.exports = router;