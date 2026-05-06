const model = require("../models/tenantModel");

async function getTenants(req, res) {
    const data = await model.getAll();
    res.json(data);
}

async function addTenant(req, res) {
    await model.create(req.body);
    res.json({ message: "Thêm thành công" });
}

async function updateTenant(req, res) {
    await model.update(req.params.id, req.body);
    res.json({ message: "Cập nhật thành công" });
}

async function deleteTenant(req, res) {
    await model.remove(req.params.id);
    res.json({ message: "Đã xóa" });
}

module.exports = {
    getTenants,
    addTenant,
    updateTenant,
    deleteTenant
};