const { connectDB } = require("../db");

// ================= GET ALL =================
async function getAll() {

    const pool = await connectDB();

    const result = await pool.request().query(`
        SELECT *
        FROM Tenants
        ORDER BY TenantID DESC
    `);

    return result.recordset;
}

// ================= CREATE =================
async function create(data) {

    const pool = await connectDB();

    await pool.request()

        .input("FullName", data.FullName)
        .input("IDCard", data.IDCard)
        .input("Hometown", data.Hometown)
        .input("PhoneNumber", data.PhoneNumber)
        .input("Email", data.Email)
        .input("BirthDate", data.BirthDate)
        .input("Gender", data.Gender)
        .input("IsRepresentative", data.IsRepresentative)

        .query(`
            INSERT INTO Tenants
            (
                FullName,
                IDCard,
                Hometown,
                PhoneNumber,
                Email,
                BirthDate,
                Gender,
                IsRepresentative
            )
            VALUES
            (
                @FullName,
                @IDCard,
                @Hometown,
                @PhoneNumber,
                @Email,
                @BirthDate,
                @Gender,
                @IsRepresentative
            )
        `);
}

// ================= UPDATE =================
async function update(id, data) {

    const pool = await connectDB();

    await pool.request()

        .input("TenantID", id)
        .input("FullName", data.FullName)
        .input("IDCard", data.IDCard)
        .input("Hometown", data.Hometown)
        .input("PhoneNumber", data.PhoneNumber)
        .input("Email", data.Email)
        .input("BirthDate", data.BirthDate)
        .input("Gender", data.Gender)
        .input("IsRepresentative", data.IsRepresentative)

        .query(`
            UPDATE Tenants
            SET
                FullName = @FullName,
                IDCard = @IDCard,
                Hometown = @Hometown,
                PhoneNumber = @PhoneNumber,
                Email = @Email,
                BirthDate = @BirthDate,
                Gender = @Gender,
                IsRepresentative = @IsRepresentative
            WHERE TenantID = @TenantID
        `);
}

// ================= DELETE =================
async function remove(id) {

    const pool = await connectDB();

    await pool.request()
        .input("TenantID", id)
        .query(`
            DELETE FROM Tenants
            WHERE TenantID = @TenantID
        `);
}

module.exports = {
    getAll,
    create,
    update,
    remove
};