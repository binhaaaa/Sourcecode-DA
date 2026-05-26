const express =
    require("express");

const router =
    express.Router();

const ctrl =
    require("../controllers/roomRentalController");

// ================= ROUTES =================

router.get(
    "/",
    ctrl.getRentals
);

router.post(
    "/",
    ctrl.createRental
);

router.put(
    "/:id",
    ctrl.updateRental
);

router.delete(
    "/:id",
    ctrl.deleteRental
);

module.exports = router;