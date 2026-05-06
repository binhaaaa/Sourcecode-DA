const router = require("express").Router();
const controller = require("../controllers/tenantController");

router.get("/", controller.getTenants);
router.post("/", controller.addTenant);
router.put("/:id", controller.updateTenant);
router.delete("/:id", controller.deleteTenant);

module.exports = router;