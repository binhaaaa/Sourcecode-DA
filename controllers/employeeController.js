const model = require("../models/employeeModel");

exports.getEmployees = async (req, res) => {

    try {

        const data = await model.getAllEmployees();

        res.json(data);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};

// CREATE
exports.createEmployee = async (req, res) => {

    try {

        await model.createEmployee(req.body);

        res.json({
            message: "Thêm nhân viên thành công"
        });

    } catch (err) {

        console.error(err);

        // lỗi trùng CCCD
        if (
            err.message.includes("UNIQUE KEY") ||
            err.message.includes("duplicate key")
        ) {

            return res.status(400).json({
                message: "CCCD đã tồn tại"
            });
        }

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};

// UPDATE
exports.updateEmployee = async (req, res) => {

    try {

        await model.updateEmployee(
            req.params.id,
            req.body
        );

        res.json({
            message: "Cập nhật thành công"
        });

    } catch (err) {

        console.error(err);

        if (
            err.message.includes("UNIQUE KEY") ||
            err.message.includes("duplicate key")
        ) {

            return res.status(400).json({
                message: "CCCD đã tồn tại"
            });
        }

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};

// DELETE
exports.deleteEmployee = async (req, res) => {

    try {

        await model.deleteEmployee(req.params.id);

        res.json({
            message: "Xóa thành công"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};