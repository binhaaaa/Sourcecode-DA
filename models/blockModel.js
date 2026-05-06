const { connectDB } = require("../db");

async function getBlocks() {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM Blocks");
    return result.recordset;
}

module.exports = { getBlocks };