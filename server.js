const express = require("express");
const path = require("path");
const { connectDB } = require("./db");

const app = express();

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ===== ROUTES =====
app.use("/api/tenants", require("./routes/tenantRoutes"));
app.use("/api/rooms", require("./routes/roomRoutes"));
app.use("/api/blocks", require("./routes/blockRoutes"));
app.use("/api/floors", require("./routes/floorRoutes"));

// ===== SERVER START =====
app.listen(3000, async () => {
    console.log("🚀 http://localhost:3000");

    try {
        await connectDB();
        console.log("✅ DB OK");
    } catch (err) {
        console.log("❌ DB FAIL");
        console.error(err);
        process.exit(1);
    }
});
