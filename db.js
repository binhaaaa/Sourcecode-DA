const sql = require("mssql");

const config = {
    user: "binh",
    password: "Binh12345",
    server: "localhost",
    database: "Admins",
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

async function connectDB() {
    return await sql.connect(config);
}

module.exports = { connectDB };