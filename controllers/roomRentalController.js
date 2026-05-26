const rentalModel =
    require("../models/roomRentalModel");

// ================= GET =================

exports.getRentals = async (req, res) => {

    try {

        const data =
            await rentalModel.getAllRentals();

        res.json(data);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: "Lỗi lấy dữ liệu"
        });
    }
};

// ================= CREATE =================

exports.createRental = async (req, res) => {

    try {

        await rentalModel.createRental(req.body);

        res.json({
            message: "Thêm thành công"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: "Lỗi thêm dữ liệu"
        });
    }
};

// ================= UPDATE =================

exports.updateRental = async (req, res) => {

    try {

        await rentalModel.updateRental(
            req.params.id,
            req.body
        );

        res.json({
            message: "Cập nhật thành công"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: "Lỗi cập nhật"
        });
    }
};

// ================= DELETE =================

exports.deleteRental = async (req, res) => {

    try {

        await rentalModel.deleteRental(
            req.params.id
        );

        res.json({
            message: "Xóa thành công"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: "Lỗi xóa"
        });
    }
};