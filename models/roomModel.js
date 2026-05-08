const { connectDB } = require("../db");

async function getAllRooms() {

    const pool = await connectDB();

    const result = await pool.request().query(`
        SELECT 
            r.*,
            f.FloorID,
            f.FloorName,
            b.BlockID,
            b.BlockName
        FROM Rooms r
        JOIN Floors f
            ON r.FloorID = f.FloorID
        JOIN Blocks b
            ON f.BlockID = b.BlockID
    `);

    return result.recordset;
}

async function createRoom(data) {
    const pool = await connectDB();

    await pool.request()
        .input("FloorID", data.FloorID)
        .input("RoomNumber", data.RoomNumber)
        .input("Price", data.Price)
        .input("Max", data.MaxOccupants)
        .input("Status", data.Status)
        .input("Description", data.Description)
        .query(`
            INSERT INTO Rooms(FloorID, RoomNumber, Price, MaxOccupants, Status, Description)
            VALUES(@FloorID, @RoomNumber, @Price, @Max, @Status, @Description)
        `);
}

async function updateRoom(id, data) {
    const pool = await connectDB();

    await pool.request()
        .input("ID", id)
        .input("FloorID", data.FloorID)
        .input("RoomNumber", data.RoomNumber)
        .input("Price", data.Price)
        .input("Max", data.MaxOccupants)
        .input("Status", data.Status)
        .input("Description", data.Description)
        .query(`
            UPDATE Rooms
            SET FloorID=@FloorID,
                RoomNumber=@RoomNumber,
                Price=@Price,
                MaxOccupants=@Max,
                Status=@Status,
                Description=@Description
            WHERE RoomID=@ID
        `);
}

async function deleteRoom(id) {
    const pool = await connectDB();

    await pool.request()
        .input("ID", id)
        .query("DELETE FROM Rooms WHERE RoomID=@ID");
}

module.exports = {
    getAllRooms,
    createRoom,
    updateRoom,
    deleteRoom
};