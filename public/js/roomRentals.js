// 🔒 Chống load trùng
if (!window.roomRentalsModule) {

    window.roomRentalsModule = true;

    let rentals = [];

    let editId = null;

    // ================= LOAD =================

    async function loadRentals() {

        try {

            console.log("🔥 loadRentals chạy");

            const res =
                await fetch("/api/roomRentals");

            rentals =
                await res.json();

            console.log(rentals);

            renderTable();

            await Promise.all([

                loadBlocks(),
                loadTenants(),
                loadContracts()
            ]);

        } catch (err) {

            console.error(
                "❌ Lỗi load rentals:",
                err
            );
        }
    }

    // ================= RENDER =================

    function renderTable(data = rentals) {

        let html = "";

        if (!data || data.length === 0) {

            html = `
                <tr>
                    <td colspan="13" class="text-center">
                        Không có dữ liệu thuê phòng
                    </td>
                </tr>
            `;

        } else {

            data.forEach(r => {

                html += `
                <tr>

                    <td>${r.RentalID || ""}</td>

                    <td>${r.BlockName || ""}</td>

                    <td>${r.FloorName || ""}</td>

                    <td>${r.RoomNumber || ""}</td>

                    <td>${r.FullName || ""}</td>

                    <td>${r.IDCard || ""}</td>

                    <td>${r.PhoneNumber || ""}</td>

                    <td>
                        ${r.CheckInDate
                            ? r.CheckInDate.split("T")[0]
                            : ""}
                    </td>

                    <td>
                        ${r.CheckOutDate
                            ? r.CheckOutDate.split("T")[0]
                            : ""}
                    </td>

                    <td>
                        ${r.IsRepresentative == 1
                            ? "✔"
                            : ""}
                    </td>

                    <td>
                        ${r.RentalStatus || ""}
                    </td>

                    <td class="description-cell">
                        ${r.Note || ""}
                    </td>

                    <td class="action-cell">

                        <button
                            class="btn btn-warning btn-sm"
                            onclick="editRental(${r.RentalID})">

                            Sửa

                        </button>

                        <button
                            class="btn btn-danger btn-sm"
                            onclick="deleteRental(${r.RentalID})">

                            Xóa

                        </button>

                    </td>

                </tr>
                `;
            });
        }

        document.getElementById(
            "rentalTableBody"
        ).innerHTML = html;
    }

    // ================= LOAD BLOCKS =================

    async function loadBlocks() {

        const res =
            await fetch("/api/blocks");

        const data =
            await res.json();

        let html =
            `<option value="">-- Chọn dãy --</option>`;

        data.forEach(b => {

            html += `
                <option value="${b.BlockID}">
                    ${b.BlockName}
                </option>
            `;
        });

        document.getElementById(
            "blockId"
        ).innerHTML = html;
    }

    // ================= LOAD FLOORS =================

    async function loadFloors(
        blockId = null,
        selectedFloorId = null
    ) {

        if (!blockId) {

            blockId =
                document.getElementById(
                    "blockId"
                ).value;
        }

        if (!blockId) {

            document.getElementById(
                "floorId"
            ).innerHTML =
                `<option value="">
                    -- Chọn tầng --
                </option>`;

            return;
        }

        try {

            console.log(
                "LOAD FLOOR BLOCK =",
                blockId
            );

            const res =
                await fetch(
                    "/api/floors/" + blockId
                );

            const data =
                await res.json();

            console.log(
                "FLOORS =",
                data
            );

            let html =
                `<option value="">
                    -- Chọn tầng --
                </option>`;

            data.forEach(f => {

                html += `
                    <option value="${f.FloorID}">
                        ${f.FloorName}
                    </option>
                `;
            });

            document.getElementById(
                "floorId"
            ).innerHTML = html;

            // SET FLOOR KHI EDIT
            if (selectedFloorId) {

                document.getElementById(
                    "floorId"
                ).value =
                    String(selectedFloorId);
            }

        } catch (err) {

            console.error(
                "❌ loadFloors:",
                err
            );
        }
    }

    // ================= LOAD ROOMS =================

    async function loadRooms(floorId = "") {

        let url = "/api/rooms";

        if (floorId) {

            url += `?floorId=${floorId}`;
        }

        const res =
            await fetch(url);

        const data =
            await res.json();

        let html =
            `<option value="">-- Chọn phòng --</option>`;

        data.forEach(r => {

            html += `
                <option value="${r.RoomID}">
                    ${r.RoomNumber}
                </option>
            `;
        });

        document.getElementById(
            "roomId"
        ).innerHTML = html;
    }

    // ================= LOAD TENANTS =================

    async function loadTenants() {

        const res =
            await fetch("/api/tenants");

        const data =
            await res.json();

        let html =
            `<option value="">-- Chọn khách thuê --</option>`;

        data.forEach(t => {

            html += `
                <option value="${t.TenantID}">
                    ${t.FullName}
                </option>
            `;
        });

        document.getElementById(
            "tenantId"
        ).innerHTML = html;
    }

    // ================= LOAD CONTRACTS =================

    async function loadContracts() {

        const res =
            await fetch("/api/contracts");

        const data =
            await res.json();

        let html =
            `<option value="">-- Chọn hợp đồng --</option>`;

        data.forEach(c => {

            html += `
                <option value="${c.ContractID}">
                    HD-${c.ContractID}
                </option>
            `;
        });

        document.getElementById(
            "contractId"
        ).innerHTML = html;
    }

    // ================= BLOCK CHANGE =================

    document.addEventListener(
        "change",
        async e => {

            // block -> floor
            if (e.target.id === "blockId") {

                const blockId =
                    e.target.value;

                await loadFloors(blockId);

                document.getElementById(
                    "roomId"
                ).innerHTML =
                    `<option value="">-- Chọn phòng --</option>`;
            }

            // floor -> room
            if (e.target.id === "floorId") {

                const floorId =
                    e.target.value;

                await loadRooms(floorId);
            }
        }
    );

    // ================= EDIT =================

    async function editRental(id) {

        const r =
            rentals.find(
                x => x.RentalID == id
            );

        console.log("EDIT =", r);

        if (!r) return;

        editId = id;

        // ================= BLOCK =================

        await loadBlocks();

        document.getElementById(
            "blockId"
        ).value =
            String(r.BlockID);

        // ================= FLOOR =================

        await loadFloors(
            r.BlockID,
            r.FloorID
        );

        document.getElementById(
            "floorId"
        ).value =
            String(r.FloorID);

        // ================= ROOM =================

        await loadRooms(r.FloorID);

        document.getElementById(
            "roomId"
        ).value =
            String(r.RoomID);

        // ================= TENANT =================

        await loadTenants();

        document.getElementById(
            "tenantId"
        ).value =
            String(r.TenantID);

        // ================= CONTRACT =================

        await loadContracts();

        document.getElementById(
            "contractId"
        ).value =
            String(r.ContractID);

        // ================= DATE =================

        document.getElementById(
            "checkInDate"
        ).value =
            r.CheckInDate
                ? r.CheckInDate.split("T")[0]
                : "";

        document.getElementById(
            "checkOutDate"
        ).value =
            r.CheckOutDate
                ? r.CheckOutDate.split("T")[0]
                : "";

        // ================= STATUS =================

        document.getElementById(
            "rentalStatus"
        ).value =
            r.RentalStatus || "";

        // ================= REPRESENTATIVE =================

        document.getElementById(
            "isRepresentative"
        ).value =
            r.IsRepresentative == 1
                ? "1"
                : "0";

        // ================= NOTE =================

        document.getElementById(
            "note"
        ).value =
            r.Note || "";
    }

    // ================= SAVE =================

    async function saveRental() {

        try {

            const data = {

                BlockID:
                    document.getElementById("blockId").value,

                FloorID:
                    document.getElementById("floorId").value,

                RoomID:
                    document.getElementById("roomId").value,

                TenantID:
                    document.getElementById("tenantId").value,

                ContractID:
                    document.getElementById("contractId").value,

                CheckInDate:
                    document.getElementById("checkInDate").value,

                CheckOutDate:
                    document.getElementById("checkOutDate").value,

                RentalStatus:
                    document.getElementById("rentalStatus").value,

                IsRepresentative:
                    Number(
                        document.getElementById(
                            "isRepresentative"
                        ).value
                    ),

                Note:
                    document.getElementById("note").value
            };

            let res;

            // UPDATE
            if (editId) {

                res = await fetch(
                    "/api/roomRentals/" + editId,
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
                    "/api/roomRentals",
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

                alert("❌ " + result.message);

                return;
            }

            alert("✅ Lưu thành công");

            resetRentalForm();

            loadRentals();

        } catch (err) {

            console.error(
                "❌ Lỗi save:",
                err
            );
        }
    }

    // ================= DELETE =================

    async function deleteRental(id) {

        try {

            if (
                !confirm(
                    "Xóa thông tin thuê?"
                )
            ) return;

            await fetch(
                "/api/roomRentals/" + id,
                {
                    method: "DELETE"
                }
            );

            alert("🗑️ Đã xóa");

            loadRentals();

        } catch (err) {

            console.error(
                "❌ Lỗi delete:",
                err
            );
        }
    }

    // ================= RESET =================

    function resetRentalForm() {

        editId = null;

        document
            .querySelectorAll(
                "input, select"
            )
            .forEach(el => {

                if (
                    el.type !== "button" &&
                    el.type !== "hidden"
                ) {

                    el.value = "";
                }
            });

        document.getElementById(
            "floorId"
        ).innerHTML =
            `<option value="">
                -- Chọn tầng --
            </option>`;

        document.getElementById(
            "roomId"
        ).innerHTML =
            `<option value="">
                -- Chọn phòng --
            </option>`;
    }

    // ================= SEARCH =================

    document.addEventListener(
        "input",
        e => {

            if (
                e.target.id === "searchRental"
            ) {

                const keyword =
                    e.target.value
                    .toLowerCase();

                const filtered =
                    rentals.filter(r =>

                        (r.RoomNumber || "")
                            .toLowerCase()
                            .includes(keyword)
                    );

                renderTable(filtered);
            }
        }
    );

    // ================= EXPORT =================

    window.loadRentals =
        loadRentals;

    window.saveRental =
        saveRental;

    window.editRental =
        editRental;

    window.deleteRental =
        deleteRental;

    window.resetRentalForm =
        resetRentalForm;

    // ================= INIT =================

    loadRentals();
}