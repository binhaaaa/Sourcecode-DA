if (!window.contractsModule) {

    window.contractsModule = true;

    let contracts = [];
    let editId = null;

    // ================= LOAD =================
    async function loadContracts() {

        const res = await fetch("/api/contracts");

        contracts = await res.json();

        renderTable();

        loadRooms();

        loadTenants();
    }

    // ================= RENDER =================
    function renderTable(data = contracts) {

        let html = "";

        data.forEach(c => {

            html += `
            <tr>

                <td>${c.ContractID}</td>

                <td>${c.BlockName}</td>
                <td>${c.FloorName}</td>
                <td>${c.RoomNumber}</td>
                <td>${c.Price}</td>

                <td>${c.FullName}</td>
                <td>${c.IDCard}</td>
                <td>${c.PhoneNumber || ""}</td>
                <td>${c.Hometown || ""}</td>
                <td>${c.BirthDate ? c.BirthDate.split("T")[0] : ""}</td>
                <td>${c.Gender || ""}</td>

                <td>${c.StartDate ? c.StartDate.split("T")[0] : ""}</td>
                <td>${c.EndDate ? c.EndDate.split("T")[0] : ""}</td>

                <td>${c.Deposit}</td>

                <td>${c.ContractStatus}</td>

                <td>${c.Note || ""}</td>

                <td>
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

        document.getElementById("contractTable").innerHTML = html;
    }

    // ================= LOAD ROOMS =================
    async function loadRooms() {

        const res = await fetch("/api/rooms");

        const rooms = await res.json();

        let html = "";

        rooms.forEach(r => {

            html += `
                <option value="${r.RoomID}">
                    ${r.RoomNumber}
                </option>
            `;
        });

        document.getElementById("roomId").innerHTML = html;
    }

    // ================= LOAD TENANTS =================
    async function loadTenants() {

        const res = await fetch("/api/tenants");

        const tenants = await res.json();

        let html = "";

        tenants
        .filter(t => t.IsRepresentative == 1)
        .forEach(t => {

            html += `
                <option value="${t.TenantID}">
                    ${t.FullName}
                </option>
            `;
        });

        document.getElementById("tenantId").innerHTML = html;
    }

    // ================= SAVE =================
    async function saveContract() {

        const data = {
            RoomID: roomId.value,
            TenantID: tenantId.value,
            StartDate: startDate.value,
            EndDate: endDate.value,
            Deposit: deposit.value,
            ContractStatus: status.value,
            Note: note.value
        };

        if (editId) {

            await fetch("/api/contracts/" + editId, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

        } else {

            await fetch("/api/contracts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
        }

        resetForm();

        loadContracts();
    }

    // ================= EDIT =================
    function editContract(id) {

        const c = contracts.find(x => x.ContractID == id);

        roomId.value = c.RoomID;
        tenantId.value = c.TenantID;

        startDate.value = c.StartDate
            ? c.StartDate.split("T")[0]
            : "";

        endDate.value = c.EndDate
            ? c.EndDate.split("T")[0]
            : "";

        deposit.value = c.Deposit;

        status.value = c.ContractStatus;

        note.value = c.Note;

        editId = id;
    }

    // ================= DELETE =================
    async function deleteContract(id) {

        if (!confirm("Xóa hợp đồng?")) return;

        await fetch("/api/contracts/" + id, {
            method: "DELETE"
        });

        loadContracts();
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