// 🔒 chống load trùng
if (!window.roomsModule) {

    window.roomsModule = true;

    let rooms = [];
    let editId = null;

    // ================= LOAD ROOMS =================

    async function loadRooms() {

        try {

            console.log("🔥 loadRooms chạy");

            const res =
                await fetch("/api/rooms");

            rooms =
                await res.json();

            console.log("ROOMS =", rooms);

            renderRooms();

            await loadBlocks();

        } catch (err) {

            console.error(
                "❌ Lỗi loadRooms:",
                err
            );
        }
    }

    // ================= RENDER =================

    function renderRooms(data = rooms) {

        let html = "";

        if (!data || data.length === 0) {

            html = `
                <tr>
                    <td colspan="9" class="text-center">
                        Không có dữ liệu
                    </td>
                </tr>
            `;

        } else {

            data.forEach(r => {

                html += `
                <tr>

                    <td>${r.RoomID || ""}</td>

                    <!-- BLOCK + DESCRIPTION CÙNG 1 DÒNG -->

                    <td>
    ${r.BlockName || ""}
    ${r.BlockDescription
        ? ` - ${r.BlockDescription}`
        : ""}
</td>

                    <td>
                        ${r.FloorName || ""}
                    </td>

                    <td>
                        ${r.RoomNumber || ""}
                    </td>

                    <td>
                        ${Number(r.Price || 0)
                            .toLocaleString("vi-VN")} đ
                    </td>

                    <td>
                        ${r.MaxOccupants || ""}
                    </td>

                    <td>
                        ${r.Status || ""}
                    </td>
 
                    <td class="description-cell">
                        ${r.Description || ""}
                    </td>

                    <td class="action-cell">

                        <button
                            class="btn btn-warning btn-sm"
                            onclick="editRoom(${r.RoomID})">

                            Sửa

                        </button>

                        <button
                            class="btn btn-danger btn-sm"
                            onclick="deleteRoom(${r.RoomID})">

                            Xóa

                        </button>

                    </td>

                </tr>
                `;
            });
        }

        document.getElementById(
            "roomTable"
        ).innerHTML = html;
    }

    // ================= LOAD BLOCKS =================

    async function loadBlocks() {

        try {

            const res =
                await fetch("/api/blocks");

            const blocks =
                await res.json();

            let html =
                `<option value="">
                    -- Chọn Block --
                </option>`;

            blocks.forEach(b => {

                html += `
                    <option value="${b.BlockID}">
                        ${b.BlockName}
                    </option>
                `;
            });

            document.getElementById(
                "blockSelect"
            ).innerHTML = html;

        } catch (err) {

            console.error(
                "❌ Lỗi loadBlocks:",
                err
            );
        }
    }

    // ================= LOAD FLOORS =================

    async function loadFloors(
        blockId = null,
        selectedFloorId = null
    ) {

        try {

            if (!blockId) {

                blockId =
                    document.getElementById(
                        "blockSelect"
                    ).value;
            }

            if (!blockId) {

                document.getElementById(
                    "floorSelect"
                ).innerHTML =
                    `
                    <option value="">
                        -- Chọn Tầng --
                    </option>
                    `;

                return;
            }

            console.log(
                "LOAD FLOOR BLOCK =",
                blockId
            );

            const res =
                await fetch(
                    "/api/floors/" + blockId
                );

            if (!res.ok) {

                throw new Error(
                    "API floors lỗi"
                );
            }

            const floors =
                await res.json();

            console.log(
                "FLOORS =",
                floors
            );

            let html =
                `
                <option value="">
                    -- Chọn Tầng --
                </option>
                `;

            floors.forEach(f => {

                html += `
                    <option value="${f.FloorID}">
                        ${f.FloorName}
                    </option>
                `;
            });

            document.getElementById(
                "floorSelect"
            ).innerHTML = html;

            setTimeout(() => {

                if (
                    selectedFloorId != null
                ) {

                    document.getElementById(
                        "floorSelect"
                    ).value =
                        String(selectedFloorId);

                    console.log(
                        "SET FLOOR =",
                        selectedFloorId
                    );
                }

            }, 50);

        } catch (err) {

            console.error(
                "❌ Lỗi loadFloors:",
                err
            );
        }
    }

    // ================= SAVE =================

    async function saveRoom() {

        try {

            const data = {

                BlockID:
                    document.getElementById(
                        "blockSelect"
                    ).value,

                FloorID:
                    document.getElementById(
                        "floorSelect"
                    ).value,

                RoomNumber:
                    document.getElementById(
                        "roomNumber"
                    ).value.trim(),

                Price:
                    document.getElementById(
                        "price"
                    ).value,

                MaxOccupants:
                    document.getElementById(
                        "maxPeople"
                    ).value,

                Status:
                    document.getElementById(
                        "status"
                    ).value,

                Description:
                    document.getElementById(
                        "description"
                    ).value.trim()
            };

            // VALIDATE

            if (!data.BlockID) {

                alert(
                    "❌ Vui lòng chọn block"
                );

                return;
            }

            if (!data.FloorID) {

                alert(
                    "❌ Vui lòng chọn tầng"
                );

                return;
            }

            if (!data.RoomNumber) {

                alert(
                    "❌ Số phòng không được để trống"
                );

                return;
            }

            let res;

            // UPDATE

            if (editId) {

                res = await fetch(
                    "/api/rooms/" + editId,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(data)
                    }
                );

            } else {

                // CREATE

                res = await fetch(
                    "/api/rooms",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(data)
                    }
                );
            }

            const result =
                await res.json();

            if (!res.ok) {

                alert(
                    "❌ " + result.message
                );

                return;
            }

            alert("✅ Thành công");

            resetRoom();

            loadRooms();

        } catch (err) {

            console.error(
                "❌ Lỗi saveRoom:",
                err
            );

            alert("❌ Có lỗi xảy ra");
        }
    }

    // ================= EDIT =================

    async function editRoom(id) {

        const r =
            rooms.find(
                x => x.RoomID == id
            );

        console.log(
            "EDIT ROOM =",
            r
        );

        if (!r) return;

        editId = id;

        document.getElementById(
            "blockSelect"
        ).value =
            String(r.BlockID);

        await loadFloors(
            r.BlockID,
            r.FloorID
        );

        document.getElementById(
            "roomNumber"
        ).value =
            r.RoomNumber || "";

        document.getElementById(
            "price"
        ).value =
            r.Price || "";

        document.getElementById(
            "maxPeople"
        ).value =
            r.MaxOccupants || "";

        document.getElementById(
            "status"
        ).value =
            r.Status || "Trống";

        document.getElementById(
            "description"
        ).value =
            r.Description || "";
    }

    // ================= DELETE =================

    async function deleteRoom(id) {

        if (!confirm("Xóa phòng?"))
            return;

        try {

            await fetch(
                "/api/rooms/" + id,
                {
                    method: "DELETE"
                }
            );

            alert("🗑️ Đã xóa");

            loadRooms();

        } catch (err) {

            console.error(
                "❌ Lỗi deleteRoom:",
                err
            );
        }
    }

    // ================= SEARCH =================

    function searchRoom() {

        const key =
            document.getElementById(
                "searchRoom"
            )
            .value
            .toLowerCase();

        const filtered =
            rooms.filter(r =>

                (r.RoomNumber || "")
                .toLowerCase()
                .includes(key)
            );

        renderRooms(filtered);
    }

    // ================= RESET =================

    function resetRoom() {

        editId = null;

        document
            .querySelectorAll(
                "#main input"
            )
            .forEach(i =>
                i.value = ""
            );

        document.getElementById(
            "blockSelect"
        ).value = "";

        document.getElementById(
            "floorSelect"
        ).innerHTML =
            `
            <option value="">
                -- Chọn Tầng --
            </option>
            `;

        document.getElementById(
            "status"
        ).value =
            "Trống";
    }

    // ================= EVENT =================

    document.addEventListener(
        "change",
        function (e) {

            if (
                e.target.id ===
                "blockSelect"
            ) {

                loadFloors();
            }
        }
    );

    // ================= EXPORT =================

    window.loadRooms =
        loadRooms;

    window.saveRoom =
        saveRoom;

    window.editRoom =
        editRoom;

    window.deleteRoom =
        deleteRoom;

    window.searchRoom =
        searchRoom;

    window.resetRoom =
        resetRoom;

    // ================= INIT =================

    loadRooms();
}