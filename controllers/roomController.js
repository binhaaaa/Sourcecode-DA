const roomModel = require("../models/roomModel");

// ================= GET =================
exports.getRooms = async (req, res) => {
    try {
        const data = await roomModel.getAllRooms();
        res.json(data);
    } catch (err) {
        console.error("❌ Lỗi getRooms:", err);
        res.status(500).json({ error: "Lỗi server" });
    }
};

// ================= CREATE =================
exports.createRoom = async (req, res) => {
    try {
        const { FloorID, RoomNumber } = req.body;

        if (!FloorID || !RoomNumber) {
            return res.status(400).json({ error: "Thiếu dữ liệu!" });
        }

        await roomModel.createRoom(req.body);
        res.json({ message: "Thêm phòng thành công" });

    } catch (err) {
        console.error("❌ Lỗi createRoom:", err);
        res.status(500).json({ error: "Lỗi server" });
    }
};

// ================= UPDATE =================
exports.updateRoom = async (req, res) => {
    try {
        await roomModel.updateRoom(req.params.id, req.body);
        res.json({ message: "Cập nhật thành công" });

    } catch (err) {
        console.error("❌ Lỗi updateRoom:", err);
        res.status(500).json({ error: "Lỗi server" });
    }
};

// ================= DELETE =================
exports.deleteRoom = async (req, res) => {
    try {
        await roomModel.deleteRoom(req.params.id);
        res.json({ message: "Xóa thành công" });

    } catch (err) {
        console.error("❌ Lỗi deleteRoom:", err);
        res.status(500).json({ error: "Lỗi server" });
    }
};