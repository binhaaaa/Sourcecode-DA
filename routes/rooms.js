const router = require("express").Router();

router.get("/", (req, res) => {
    res.json([
        { RoomID: 1, RoomNumber: "P101", Price: 2000000, Status: "Trống" },
        { RoomID: 2, RoomNumber: "P102", Price: 2500000, Status: "Đang ở" }
    ]);
});

module.exports = router;