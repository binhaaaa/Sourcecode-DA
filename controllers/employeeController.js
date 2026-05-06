
const model = require("../models/employeeModel");

exports.getEmployees = async (req, res) => {
    const data = await model.getAllEmployees();
    res.json(data);
};

exports.createEmployee = async (req, res) => {
    await model.createEmployee(req.body);
    res.json({ message: "Thêm nhân viên thành công" });
};

exports.updateEmployee = async (req, res) => {
    await model.updateEmployee(req.params.id, req.body);
    res.json({ message: "Cập nhật thành công" });
};

exports.deleteEmployee = async (req, res) => {
    await model.deleteEmployee(req.params.id);
    res.json({ message: "Xóa thành công" });
};
