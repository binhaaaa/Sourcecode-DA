const roomModel = require("../models/roomModel");

// ================= GET =================
exports.getRooms = async (req, res) => {

    try {

        const data = await roomModel.getAllRooms();

        res.json(data);

    } catch (err) {

        console.error("❌ Lỗi getRooms:", err);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};

// ================= CREATE =================
exports.createRoom = async (req, res) => {

    try {

        const {
            BlockID,
            FloorID,
            RoomNumber,
            Price,
            MaxOccupants,
            Status
        } = req.body;

        // ================= VALIDATE =================

        if (!BlockID) {

            return res.status(400).json({
                message: "Vui lòng chọn block"
            });
        }

        if (!FloorID) {

            return res.status(400).json({
                message: "Vui lòng chọn tầng"
            });
        }

        if (!RoomNumber) {

            return res.status(400).json({
                message: "Số phòng không được để trống"
            });
        }

        if (!Price) {

            return res.status(400).json({
                message: "Giá phòng không được để trống"
            });
        }

        if (!MaxOccupants) {

            return res.status(400).json({
                message: "Số người tối đa không được để trống"
            });
        }

        if (!Status) {

            return res.status(400).json({
                message: "Vui lòng chọn trạng thái"
            });
        }

        // ================= CHECK FORMAT =================
        // P.101, P.201, P.301...

        const roomPattern = /^P\.\d{3}$/;

        if (!roomPattern.test(RoomNumber)) {

            return res.status(400).json({
                message:
                    "Số phòng phải có dạng P.101, P.102, P.201..."
            });
        }

        // ================= LOAD DATA =================

        const rooms = await roomModel.getAllRooms();

        // ================= CHECK FLOOR =================

        const floorData = rooms.find(r =>

            String(r.BlockID) === String(BlockID) &&
            String(r.FloorID) === String(FloorID)
        );

        if (floorData) {

            // VD: P.301 => 3
            const roomFloor =
                RoomNumber.split(".")[1][0];

            // VD: Tầng 3 => 3
            const actualFloor =
                floorData.FloorName.replace(/\D/g, "");

            if (roomFloor !== actualFloor) {

                return res.status(400).json({
                    message:
                        `Phòng của ${floorData.FloorName} phải có dạng P.${actualFloor}01, P.${actualFloor}02...`
                });
            }
        }

        // ================= CHECK DUPLICATE =================

        const isDuplicate = rooms.find(r =>

            String(r.BlockID) === String(BlockID) &&
            String(r.FloorID) === String(FloorID) &&
            String(r.RoomNumber).trim() === String(RoomNumber).trim()
        );

        if (isDuplicate) {

            return res.status(400).json({
                message:
                    "Số phòng đã tồn tại trong block và tầng này"
            });
        }

        // ================= CREATE =================

        await roomModel.createRoom(req.body);

        res.json({
            message: "Thêm phòng thành công"
        });

    } catch (err) {

        console.error("❌ Lỗi createRoom:", err);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};

// ================= UPDATE =================
exports.updateRoom = async (req, res) => {

    try {

        const {
            BlockID,
            FloorID,
            RoomNumber,
            Price,
            MaxOccupants,
            Status
        } = req.body;

        // ================= VALIDATE =================

        if (!BlockID) {

            return res.status(400).json({
                message: "Vui lòng chọn block"
            });
        }

        if (!FloorID) {

            return res.status(400).json({
                message: "Vui lòng chọn tầng"
            });
        }

        if (!RoomNumber) {

            return res.status(400).json({
                message: "Số phòng không được để trống"
            });
        }

        if (!Price) {

            return res.status(400).json({
                message: "Giá phòng không được để trống"
            });
        }

        if (!MaxOccupants) {

            return res.status(400).json({
                message: "Số người tối đa không được để trống"
            });
        }

        if (!Status) {

            return res.status(400).json({
                message: "Vui lòng chọn trạng thái"
            });
        }

        // ================= CHECK FORMAT =================

        const roomPattern = /^P\.\d{3}$/;

        if (!roomPattern.test(RoomNumber)) {

            return res.status(400).json({
                message:
                    "Số phòng phải có dạng P.101, P.102, P.201..."
            });
        }

        // ================= LOAD DATA =================

        const rooms = await roomModel.getAllRooms();

        // ================= CHECK FLOOR =================

        const floorData = rooms.find(r =>

            String(r.BlockID) === String(BlockID) &&
            String(r.FloorID) === String(FloorID)
        );

        if (floorData) {

            const roomFloor =
                RoomNumber.split(".")[1][0];

            const actualFloor =
                floorData.FloorName.replace(/\D/g, "");

            if (roomFloor !== actualFloor) {

                return res.status(400).json({
                    message:
                        `Phòng của ${floorData.FloorName} phải có dạng P.${actualFloor}01, P.${actualFloor}02...`
                });
            }
        }

        // ================= CHECK DUPLICATE =================

        const isDuplicate = rooms.find(r =>

            r.RoomID != req.params.id &&
            String(r.BlockID) === String(BlockID) &&
            String(r.FloorID) === String(FloorID) &&
            String(r.RoomNumber).trim() === String(RoomNumber).trim()
        );

        if (isDuplicate) {

            return res.status(400).json({
                message:
                    "Số phòng đã tồn tại trong block và tầng này"
            });
        }

        // ================= UPDATE =================

        await roomModel.updateRoom(
            req.params.id,
            req.body
        );

        res.json({
            message: "Cập nhật thành công"
        });

    } catch (err) {

        console.error("❌ Lỗi updateRoom:", err);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};

// ================= DELETE =================
exports.deleteRoom = async (req, res) => {

    try {

        await roomModel.deleteRoom(req.params.id);

        res.json({
            message: "Xóa thành công"
        });

    } catch (err) {

        console.error("❌ Lỗi deleteRoom:", err);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};