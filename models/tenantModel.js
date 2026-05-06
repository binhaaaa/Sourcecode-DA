const { connectDB } = require("../db");

async function getAll() {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM Tenants");
    return result.recordset;
}

async function create(data) {
    const pool = await connectDB();

    await pool.request()
        .input("name", data.FullName)
        .input("cccd", data.IDCard)
        .input("phone", data.PhoneNumber)
        .input("gender", data.Gender)
        .query(`
            INSERT INTO Tenants(FullName, IDCard, PhoneNumber, Gender)
            VALUES (@name, @cccd, @phone, @gender)
        `);
}

async function update(id, data) {
    const pool = await connectDB();

    await pool.request()
        .input("id", id)
        .input("name", data.FullName)
        .input("cccd", data.IDCard)
        .input("phone", data.PhoneNumber)
        .input("gender", data.Gender)
        .query(`
            UPDATE Tenants
            SET FullName=@name,
                IDCard=@cccd,
                PhoneNumber=@phone,
                Gender=@gender
            WHERE TenantID=@id
        `);
}

async function remove(id) {
    const pool = await connectDB();

    // 🔥 FIX FK (nếu có Contract)
    await pool.request()
        .input("id", id)
        .query(`
            DELETE FROM Contracts WHERE TenantID=@id;
            DELETE FROM Tenants WHERE TenantID=@id;
        `);
}

module.exports = { getAll, create, update, remove };