const { connectDB } = require("../db");

// ================= GET ALL =================

async function getAllRentals() {

    const pool = await connectDB();

    const result = await pool.request().query(`

        SELECT

            rr.RentalID,
            rr.BlockID,
            rr.FloorID,
            rr.RoomID,
            rr.ContractID,
            rr.TenantID,

            rr.CheckInDate,
            rr.CheckOutDate,
            rr.RentalStatus,
            rr.IsRepresentative,
            rr.Note,

            b.BlockName,

            f.FloorName,

            r.RoomNumber,

            t.FullName,
            t.PhoneNumber,
            t.IDCard

        FROM RoomRentals rr

        LEFT JOIN Blocks b
            ON rr.BlockID = b.BlockID

        LEFT JOIN Floors f
            ON rr.FloorID = f.FloorID

        LEFT JOIN Rooms r
            ON rr.RoomID = r.RoomID

        LEFT JOIN Contracts c
            ON rr.ContractID = c.ContractID

        LEFT JOIN Tenants t
            ON rr.TenantID = t.TenantID

        ORDER BY rr.RentalID ASC
    `);

    return result.recordset;
}

// ================= CREATE =================

async function createRental(data) {

    const pool = await connectDB();

    await pool.request()

        .input("BlockID", data.BlockID)
        .input("FloorID", data.FloorID)
        .input("RoomID", data.RoomID)
        .input("ContractID", data.ContractID)
        .input("TenantID", data.TenantID)
        .input("CheckInDate", data.CheckInDate)
        .input("CheckOutDate", data.CheckOutDate)
        .input("RentalStatus", data.RentalStatus)
        .input("IsRepresentative", data.IsRepresentative)
        .input("Note", data.Note)

        .query(`

            INSERT INTO RoomRentals (

                BlockID,
                FloorID,
                RoomID,
                ContractID,
                TenantID,
                CheckInDate,
                CheckOutDate,
                RentalStatus,
                IsRepresentative,
                Note
            )

            VALUES (

                @BlockID,
                @FloorID,
                @RoomID,
                @ContractID,
                @TenantID,
                @CheckInDate,
                @CheckOutDate,
                @RentalStatus,
                @IsRepresentative,
                @Note
            )
        `);
}

// ================= UPDATE =================

async function updateRental(id, data) {

    const pool = await connectDB();

    await pool.request()

        .input("ID", id)

        .input("BlockID", data.BlockID)
        .input("FloorID", data.FloorID)
        .input("RoomID", data.RoomID)
        .input("ContractID", data.ContractID)
        .input("TenantID", data.TenantID)
        .input("CheckInDate", data.CheckInDate)
        .input("CheckOutDate", data.CheckOutDate)
        .input("RentalStatus", data.RentalStatus)
        .input("IsRepresentative", data.IsRepresentative)
        .input("Note", data.Note)

        .query(`

            UPDATE RoomRentals

            SET

                BlockID = @BlockID,
                FloorID = @FloorID,
                RoomID = @RoomID,
                ContractID = @ContractID,
                TenantID = @TenantID,
                CheckInDate = @CheckInDate,
                CheckOutDate = @CheckOutDate,
                RentalStatus = @RentalStatus,
                IsRepresentative = @IsRepresentative,
                Note = @Note

            WHERE RentalID = @ID
        `);
}

// ================= DELETE =================

async function deleteRental(id) {

    const pool = await connectDB();

    await pool.request()

        .input("ID", id)

        .query(`

            DELETE FROM RoomRentals

            WHERE RentalID = @ID
        `);
}

module.exports = {

    getAllRentals,
    createRental,
    updateRental,
    deleteRental
};