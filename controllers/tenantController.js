const model = require("../models/tenantModel");

// ================= GET =================
async function getTenants(req, res) {

    try {

        const data = await model.getAll();

        res.json(data);

    } catch (err) {

        console.error("❌ Lỗi getTenants:", err);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
}

// ================= ADD =================
async function addTenant(req, res) {

    try {

        const {
            FullName,
            IDCard,
            PhoneNumber,
            Email
        } = req.body;

        // ================= VALIDATE =================

        if (!FullName) {

            return res.status(400).json({
                message: "Vui lòng nhập họ tên"
            });
        }

        if (!IDCard) {

            return res.status(400).json({
                message: "Vui lòng nhập CCCD"
            });
        }

        // ================= CHECK CCCD =================

        const cccdRegex = /^\d{12}$/;

        if (!cccdRegex.test(IDCard)) {

            return res.status(400).json({
                message: "CCCD phải gồm đúng 12 số"
            });
        }

        // ================= CHECK PHONE =================

        if (PhoneNumber) {

            const phoneRegex = /^(0|\+84)\d{9}$/;

            if (!phoneRegex.test(PhoneNumber)) {

                return res.status(400).json({
                    message: "Số điện thoại không hợp lệ"
                });
            }
        }

        // ================= CHECK EMAIL =================

        if (Email) {

            const emailRegex =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(Email)) {

                return res.status(400).json({
                    message: "Email không hợp lệ"
                });
            }
        }

        // ================= CHECK DUPLICATE CCCD =================

        const tenants = await model.getAll();

        const duplicateCCCD = tenants.find(t =>

            String(t.IDCard).trim() ===
            String(IDCard).trim()
        );

        if (duplicateCCCD) {

            return res.status(400).json({
                message: "CCCD đã tồn tại"
            });
        }

        // ================= CREATE =================

        await model.create(req.body);

        res.json({
            message: "Thêm thành công"
        });

    } catch (err) {

        console.error("❌ Lỗi addTenant:", err);

        // SQL UNIQUE KEY
        if (
            err.message &&
            err.message.includes("duplicate")
        ) {

            return res.status(400).json({
                message: "CCCD đã tồn tại"
            });
        }

        res.status(500).json({
            message: err.message || "Lỗi server"
        });
    }
}

// ================= UPDATE =================
async function updateTenant(req, res) {

    try {

        const {
            FullName,
            IDCard,
            PhoneNumber,
            Email
        } = req.body;

        // ================= VALIDATE =================

        if (!FullName) {

            return res.status(400).json({
                message: "Vui lòng nhập họ tên"
            });
        }

        if (!IDCard) {

            return res.status(400).json({
                message: "Vui lòng nhập CCCD"
            });
        }

        // ================= CHECK CCCD =================

        const cccdRegex = /^\d{12}$/;

        if (!cccdRegex.test(IDCard)) {

            return res.status(400).json({
                message: "CCCD phải gồm đúng 12 số"
            });
        }

        // ================= CHECK PHONE =================

        if (PhoneNumber) {

            const phoneRegex = /^(0|\+84)\d{9}$/;

            if (!phoneRegex.test(PhoneNumber)) {

                return res.status(400).json({
                    message: "Số điện thoại không hợp lệ"
                });
            }
        }

        // ================= CHECK EMAIL =================

        if (Email) {

            const emailRegex =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(Email)) {

                return res.status(400).json({
                    message: "Email không hợp lệ"
                });
            }
        }

        // ================= CHECK DUPLICATE CCCD =================

        const tenants = await model.getAll();

        const duplicateCCCD = tenants.find(t =>

            t.TenantID != req.params.id &&

            String(t.IDCard).trim() ===
            String(IDCard).trim()
        );

        if (duplicateCCCD) {

            return res.status(400).json({
                message: "CCCD đã tồn tại"
            });
        }

        // ================= UPDATE =================

        await model.update(
            req.params.id,
            req.body
        );

        res.json({
            message: "Cập nhật thành công"
        });

    } catch (err) {

        console.error("❌ Lỗi updateTenant:", err);

        // SQL UNIQUE KEY
        if (
            err.message &&
            err.message.includes("duplicate")
        ) {

            return res.status(400).json({
                message: "CCCD đã tồn tại"
            });
        }

        res.status(500).json({
            message: err.message || "Lỗi server"
        });
    }
}

// ================= DELETE =================
async function deleteTenant(req, res) {

    try {

        await model.remove(req.params.id);

        res.json({
            message: "Đã xóa"
        });

    } catch (err) {

        console.error("❌ Lỗi deleteTenant:", err);

        res.status(500).json({
            message: err.message || "Lỗi server"
        });
    }
}

module.exports = {
    getTenants,
    addTenant,
    updateTenant,
    deleteTenant
};