const { connectDB } = require("../db");

async function getFloorsByBlock(blockId) {
    const pool = await connectDB();

    const result = await pool.request()
        .input("BlockID", blockId)
        .query("SELECT * FROM Floors WHERE BlockID = @BlockID");

    return result.recordset;
}

module.exports = { getFloorsByBlock };