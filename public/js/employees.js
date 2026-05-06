if (!window.employeesModule) {

    window.employeesModule = true;

    let employees = [];
    let editId = null;

    // LOAD
    async function loadEmployees() {
        const res = await fetch("/api/employees");
        employees = await res.json();
        renderTable();
    }

    // RENDER
    function renderTable(data = employees) {
        let html = "";

        data.forEach(e => {
            html += `
            <tr>
                <td>${e.EmployeeID}</td>
                <td>${e.FullName}</td>
                <td>${e.IDCard || ""}</td>
                <td>${e.PhoneNumber || ""}</td>
                <td>${e.RoleName || ""}</td>
                <td>${e.BaseSalary}</td>
                <td>${e.Status}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editEmployee(${e.EmployeeID})">Sửa</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteEmployee(${e.EmployeeID})">Xóa</button>
                </td>
            </tr>`;
        });

        document.getElementById("employeeTable").innerHTML = html;
    }

    // SAVE
    async function saveEmployee() {
        const data = {
            FullName: name.value,
            IDCard: cccd.value,
            PhoneNumber: phone.value,
            RoleID: role.value,
            BaseSalary: salary.value,
            Status: status.value
        };

        if (editId) {
            await fetch("/api/employees/" + editId, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
        } else {
            await fetch("/api/employees", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
        }

        resetForm();
        loadEmployees();
    }

    // EDIT
    function editEmployee(id) {
        const e = employees.find(x => x.EmployeeID == id);

        name.value = e.FullName;
        cccd.value = e.IDCard;
        phone.value = e.PhoneNumber;
        role.value = e.RoleID;
        salary.value = e.BaseSalary;
        status.value = e.Status;

        editId = id;
    }

    // DELETE
    async function deleteEmployee(id) {
        if (!confirm("Xóa nhân viên?")) return;

        await fetch("/api/employees/" + id, {
            method: "DELETE"
        });

        loadEmployees();
    }

    // SEARCH
    function searchEmployee() {
        const key = document.getElementById("searchInput").value.toLowerCase();

        const filtered = employees.filter(e =>
            (e.FullName || "").toLowerCase().includes(key)
        );

        renderTable(filtered);
    }

    // RESET
    function resetForm() {
        document.querySelectorAll("#main input").forEach(i => i.value = "");
        editId = null;
    }

    // EXPORT
    window.loadEmployees = loadEmployees;
    window.saveEmployee = saveEmployee;
    window.editEmployee = editEmployee;
    window.deleteEmployee = deleteEmployee;
    window.searchEmployee = searchEmployee;
    window.resetForm = resetForm;

    loadEmployees();
}