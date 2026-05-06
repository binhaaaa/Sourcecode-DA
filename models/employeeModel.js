
const { connectDB } = require("../db");

// GET ALL
async function getAllEmployees() {
    const pool = await connectDB();
    const result = await pool.request().query(`
        SELECT e.*, r.RoleName
        FROM Employees e
        LEFT JOIN Roles r ON e.RoleID = r.RoleID
    `);
    return result.recordset;
}

// CREATE
async function createEmployee(data) {
    const pool = await connectDB();

    await pool.request()
        .input("FullName", data.FullName)
        .input("IDCard", data.IDCard)
        .input("Phone", data.PhoneNumber)
        .input("RoleID", data.RoleID)
        .input("Salary", data.BaseSalary)
        .input("Status", data.Status)
        .query(`
            INSERT INTO Employees(FullName, IDCard, PhoneNumber, RoleID, BaseSalary, Status)
            VALUES(@FullName, @IDCard, @Phone, @RoleID, @Salary, @Status)
        `);
}

// UPDATE
async function updateEmployee(id, data) {
    const pool = await connectDB();

    await pool.request()
        .input("ID", id)
        .input("FullName", data.FullName)
        .input("IDCard", data.IDCard)
        .input("Phone", data.PhoneNumber)
        .input("RoleID", data.RoleID)
        .input("Salary", data.BaseSalary)
        .input("Status", data.Status)
        .query(`
            UPDATE Employees
            SET FullName=@FullName,
                IDCard=@IDCard,
                PhoneNumber=@Phone,
                RoleID=@RoleID,
                BaseSalary=@Salary,
                Status=@Status
            WHERE EmployeeID=@ID
        `);
}

// DELETE
async function deleteEmployee(id) {
    const pool = await connectDB();

    await pool.request()
        .input("ID", id)
        .query("DELETE FROM Employees WHERE EmployeeID=@ID");
}

module.exports = {
    getAllEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
};
