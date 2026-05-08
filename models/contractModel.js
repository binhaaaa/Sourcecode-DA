const { connectDB } = require("../db");

// ================= GET ALL =================
async function getAllContracts() {

    const pool = await connectDB();

    const result = await pool.request().query(`
        SELECT
            c.ContractID,
            c.StartDate,
            c.EndDate,
            c.Deposit,
            c.ContractStatus,
            c.Note,

            r.RoomID,
            r.RoomNumber,
            r.Price,

            f.FloorName,
            b.BlockName,

            t.TenantID,
            t.FullName,
            t.IDCard,
            t.PhoneNumber,
            t.Hometown,
            t.BirthDate,
            t.Gender

        FROM Contracts c

        JOIN Rooms r
            ON c.RoomID = r.RoomID

        JOIN Floors f
            ON r.FloorID = f.FloorID

        JOIN Blocks b
            ON f.BlockID = b.BlockID

        JOIN Tenants t
            ON c.TenantID = t.TenantID

        WHERE t.IsRepresentative = 1

        ORDER BY c.ContractID DESC
    `);

    return result.recordset;
}

// ================= CREATE =================
async function createContract(data) {

    const pool = await connectDB();

    await pool.request()
        .input("RoomID", data.RoomID)
        .input("TenantID", data.TenantID)
        .input("StartDate", data.StartDate)
        .input("EndDate", data.EndDate)
        .input("Deposit", data.Deposit)
        .input("ContractStatus", data.ContractStatus)
        .input("Note", data.Note)

        .query(`
            INSERT INTO Contracts(
                RoomID,
                TenantID,
                StartDate,
                EndDate,
                Deposit,
                ContractStatus,
                Note
            )
            VALUES(
                @RoomID,
                @TenantID,
                @StartDate,
                @EndDate,
                @Deposit,
                @ContractStatus,
                @Note
            )
        `);
}

// ================= UPDATE =================
async function updateContract(id, data) {

    const pool = await connectDB();

    await pool.request()
        .input("ID", id)
        .input("RoomID", data.RoomID)
        .input("TenantID", data.TenantID)
        .input("StartDate", data.StartDate)
        .input("EndDate", data.EndDate)
        .input("Deposit", data.Deposit)
        .input("ContractStatus", data.ContractStatus)
        .input("Note", data.Note)

        .query(`
            UPDATE Contracts
            SET
                RoomID = @RoomID,
                TenantID = @TenantID,
                StartDate = @StartDate,
                EndDate = @EndDate,
                Deposit = @Deposit,
                ContractStatus = @ContractStatus,
                Note = @Note
            WHERE ContractID = @ID
        `);
}

// ================= DELETE =================
async function deleteContract(id) {

    const pool = await connectDB();

    await pool.request()
        .input("ID", id)
        .query(`
            DELETE FROM Contracts
            WHERE ContractID = @ID
        `);
}

module.exports = {
    getAllContracts,
    createContract,
    updateContract,
    deleteContract
};