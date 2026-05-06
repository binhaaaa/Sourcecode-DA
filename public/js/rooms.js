if (!window.roomsModule) {

    window.roomsModule = true;

    let rooms = [];
    let editId = null;

    // ================= LOAD ROOMS =================
    async function loadRooms() {
        try {
            console.log("🔥 loadRooms chạy");

            const res = await fetch("/api/rooms");
            rooms = await res.json();

            renderRooms();
            loadBlocks();

        } catch (err) {
            console.error("❌ Lỗi loadRooms:", err);
        }
    }

    function renderRooms(data = rooms) {
        let html = "";

        data.forEach(r => {
            html += `
            <tr>
                <td>${r.RoomID}</td>
                <td>${r.BlockName || ""}</td>
                <td>${r.FloorName || ""}</td>
                <td>${r.RoomNumber}</td>
                <td>${r.Price}</td>
                <td>${r.MaxOccupants}</td>
                <td>${r.Status}</td>
                <td>${r.Description || ""}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editRoom(${r.RoomID})">Sửa</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteRoom(${r.RoomID})">Xóa</button>
                </td>
            </tr>`;
        });

        document.getElementById("roomTable").innerHTML = html;
    }

    async function loadBlocks() {
        const res = await fetch("/api/blocks");
        const blocks = await res.json();

        let html = `<option value="">-- Chọn Block --</option>`;

        blocks.forEach(b => {
            html += `<option value="${b.BlockID}">${b.BlockName}</option>`;
        });

        document.getElementById("blockSelect").innerHTML = html;
    }

    async function loadFloors() {
        const blockId = document.getElementById("blockSelect").value;
        if (!blockId) return;

        const res = await fetch("/api/floors/" + blockId);
        const floors = await res.json();

        let html = `<option value="">-- Chọn Tầng --</option>`;

        floors.forEach(f => {
            html += `<option value="${f.FloorID}">${f.FloorName}</option>`;
        });

        document.getElementById("floorSelect").innerHTML = html;
    }

    async function saveRoom() {
        const data = {
            FloorID: document.getElementById("floorSelect").value,
            RoomNumber: document.getElementById("roomNumber").value,
            Price: document.getElementById("price").value,
            MaxOccupants: document.getElementById("maxPeople").value,
            Status: document.getElementById("status").value,
            Description: document.getElementById("description").value
        };

        if (editId) {
            await fetch("/api/rooms/" + editId, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
        } else {
            await fetch("/api/rooms", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
        }

        resetRoom();
        loadRooms();
    }

    function editRoom(id) {
        const r = rooms.find(x => x.RoomID == id);

        document.getElementById("blockSelect").value = r.BlockID;

        loadFloors().then(() => {
            document.getElementById("floorSelect").value = r.FloorID;
        });

        document.getElementById("roomNumber").value = r.RoomNumber;
        document.getElementById("price").value = r.Price;
        document.getElementById("maxPeople").value = r.MaxOccupants;
        document.getElementById("status").value = r.Status;
        document.getElementById("description").value = r.Description;

        editId = id;
    }

    async function deleteRoom(id) {
        if (!confirm("Xóa phòng?")) return;

        await fetch("/api/rooms/" + id, { method: "DELETE" });

        loadRooms();
    }

    function searchRoom() {
        const key = document.getElementById("searchRoom").value.toLowerCase();

        const filtered = rooms.filter(r =>
            (r.RoomNumber || "").toLowerCase().includes(key)
        );

        renderRooms(filtered);
    }

    function resetRoom() {
        document.querySelectorAll("#main input").forEach(i => i.value = "");
        document.getElementById("floorSelect").innerHTML = "";
        editId = null;
    }

    // export ra global
    window.loadRooms = loadRooms;
    window.saveRoom = saveRoom;
    window.editRoom = editRoom;
    window.deleteRoom = deleteRoom;
    window.searchRoom = searchRoom;
    window.resetRoom = resetRoom;

    // 🔥 CHẠY NGAY
    loadRooms();
}