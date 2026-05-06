const router = require("express").Router();

router.get("/", (req, res) => {
    res.json([
        { Name: "Trần Văn B", Role: "Quản lý", Salary: 8000000 }
    ]);
});

module.exports = router;