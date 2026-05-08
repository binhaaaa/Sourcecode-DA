const contractModel = require("../models/contractModel");

// ================= GET =================
exports.getContracts = async (req, res) => {

    const data = await contractModel.getAllContracts();

    res.json(data);
};

// ================= CREATE =================
exports.createContract = async (req, res) => {

    await contractModel.createContract(req.body);

    res.json({
        message: "Thêm hợp đồng thành công"
    });
};

// ================= UPDATE =================
exports.updateContract = async (req, res) => {

    await contractModel.updateContract(
        req.params.id,
        req.body
    );

    res.json({
        message: "Cập nhật thành công"
    });
};

// ================= DELETE =================
exports.deleteContract = async (req, res) => {

    await contractModel.deleteContract(req.params.id);

    res.json({
        message: "Xóa thành công"
    });
};