// 🔒 chống load trùng
if (!window.contractsModule) {

    window.contractsModule = true;

    let contracts = [];
    let editId = null;

    // ================= LOAD =================
    async function loadContracts() {

        try {

            const res = await fetch("/api/contracts");

            contracts = await res.json();

            renderTable();

            await loadRooms();

            await loadTenants();

        } catch (err) {

            console.error("❌ Lỗi loadContracts:", err);

            alert("❌ Không tải được hợp đồng");
        }
    }

    // ================= RENDER =================
    function renderTable(data = contracts) {

        let html = "";

        data.forEach(c => {

            html += `
            <tr>

                <td>${c.ContractID}</td>

                <td>${c.BlockName || ""}</td>

                <td>${c.FloorName || ""}</td>

                <td>${c.RoomNumber || ""}</td>

                <td>${c.Price || ""}</td>

                <td>${c.FullName || ""}</td>

                <td>${c.IDCard || ""}</td>

                <td>${c.PhoneNumber || ""}</td>

                <td>${c.Hometown || ""}</td>

                <td>
                    ${c.BirthDate
                        ? c.BirthDate.split("T")[0]
                        : ""}
                </td>

                <td>${c.Gender || ""}</td>

                <td>
                    ${c.StartDate
                        ? c.StartDate.split("T")[0]
                        : ""}
                </td>

                <td>
                    ${c.EndDate
                        ? c.EndDate.split("T")[0]
                        : ""}
                </td>

                <td>${c.Deposit || 0}</td>

                <td>${c.ContractStatus || ""}</td>

                <td>${c.Note || ""}</td>

                <td class="action-cell">

                    <button
                        class="btn btn-warning btn-sm"
                        onclick="editContract(${c.ContractID})"
                    >
                        Sửa
                    </button>

                    <button
                        class="btn btn-danger btn-sm"
                        onclick="deleteContract(${c.ContractID})"
                    >
                        Xóa
                    </button>

                </td>

            </tr>
            `;
        });

        document.getElementById("contractTable").innerHTML =
            html;
    }

    // ================= LOAD ROOMS =================
    async function loadRooms() {

        try {

            const res = await fetch("/api/rooms");

            const rooms = await res.json();

            let html =
                `<option value="">-- Chọn phòng --</option>`;

            rooms.forEach(r => {

                html += `
                    <option value="${r.RoomID}">
                        ${r.BlockName} -
                        ${r.FloorName} -
                        ${r.RoomNumber}
                    </option>
                `;
            });

            document.getElementById("roomId").innerHTML =
                html;

        } catch (err) {

            console.error("❌ Lỗi loadRooms:", err);
        }
    }

    // ================= LOAD TENANTS =================
    async function loadTenants() {

        try {

            const res = await fetch("/api/tenants");

            const tenants = await res.json();

            let html =
                `<option value="">-- Chọn khách thuê --</option>`;

            tenants
                .filter(t => t.IsRepresentative == 1)
                .forEach(t => {

                    html += `
                        <option value="${t.TenantID}">
                            ${t.FullName}
                        </option>
                    `;
                });

            document.getElementById("tenantId").innerHTML =
                html;

        } catch (err) {

            console.error("❌ Lỗi loadTenants:", err);
        }
    }

    // ================= SAVE =================
    async function saveContract() {

        try {

            const data = {

                RoomID:
                    document.getElementById("roomId").value,

                TenantID:
                    document.getElementById("tenantId").value,

                StartDate:
                    document.getElementById("startDate").value,

                EndDate:
                    document.getElementById("endDate").value,

                Deposit:
                    document.getElementById("deposit").value,

                ContractStatus:
                    document.getElementById("status").value,

                Note:
                    document.getElementById("note").value.trim()
            };

            // ================= VALIDATE =================

            if (!data.RoomID) {

                alert("❌ Vui lòng chọn phòng");

                return;
            }

            if (!data.TenantID) {

                alert("❌ Vui lòng chọn khách thuê");

                return;
            }

            if (!data.StartDate) {

                alert("❌ Vui lòng chọn ngày bắt đầu");

                return;
            }

            if (!data.EndDate) {

                alert("❌ Vui lòng chọn ngày kết thúc");

                return;
            }

            if (data.EndDate < data.StartDate) {

                alert(
                    "❌ Ngày kết thúc phải lớn hơn ngày bắt đầu"
                );

                return;
            }

            let res;

            // ================= UPDATE =================
            if (editId) {

                res = await fetch(
                    "/api/contracts/" + editId,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify(data)
                    }
                );

            } else {

                // ================= CREATE =================
                res = await fetch(
                    "/api/contracts",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify(data)
                    }
                );
            }

            const result = await res.json();

            if (!res.ok) {

                alert("❌ " + result.message);

                return;
            }

            alert("✅ Thành công");

            resetForm();

            loadContracts();

        } catch (err) {

            console.error("❌ Lỗi saveContract:", err);

            alert("❌ Có lỗi xảy ra");
        }
    }

    // ================= EDIT =================
    function editContract(id) {

        const c =
            contracts.find(x => x.ContractID == id);

        if (!c) return;

        document.getElementById("roomId").value =
            c.RoomID;

        document.getElementById("tenantId").value =
            c.TenantID;

        document.getElementById("startDate").value =
            c.StartDate
                ? c.StartDate.split("T")[0]
                : "";

        document.getElementById("endDate").value =
            c.EndDate
                ? c.EndDate.split("T")[0]
                : "";

        document.getElementById("deposit").value =
            c.Deposit || "";

        document.getElementById("status").value =
            c.ContractStatus || "Hiệu lực";

        document.getElementById("note").value =
            c.Note || "";

        editId = id;
    }

    // ================= DELETE =================
    async function deleteContract(id) {

        if (!confirm("Xóa hợp đồng?")) {

            return;
        }

        try {

            const res = await fetch(
                "/api/contracts/" + id,
                {
                    method: "DELETE"
                }
            );

            const result = await res.json();

            if (!res.ok) {

                alert("❌ " + result.message);

                return;
            }

            alert("🗑️ Đã xóa");

            loadContracts();

        } catch (err) {

            console.error("❌ Lỗi deleteContract:", err);

            alert("❌ Có lỗi xảy ra");
        }
    }

    // ================= SEARCH =================
    function searchContract() {

        const key = document
            .getElementById("searchInput")
            .value
            .toLowerCase();

        const filtered = contracts.filter(c =>

            (c.FullName || "")
            .toLowerCase()
            .includes(key)
        );

        renderTable(filtered);
    }

    // ================= RESET =================
    function resetForm() {

        document
            .querySelectorAll("#main input")
            .forEach(i => i.value = "");

        document.getElementById("roomId").value = "";

        document.getElementById("tenantId").value = "";

        document.getElementById("status").value =
            "Hiệu lực";

        document.getElementById("note").value = "";

        editId = null;
    }

    // ================= EXPORT =================
    window.loadContracts = loadContracts;

    window.saveContract = saveContract;

    window.editContract = editContract;

    window.deleteContract = deleteContract;

    window.searchContract = searchContract;

    window.resetForm = resetForm;

    // ================= INIT =================
    loadContracts();
}