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
            <td>${e.FullName || ""}</td>
            <td>${e.IDCard || ""}</td>
            <td>${e.PhoneNumber || ""}</td>
            <td>${e.RoleName || ""}</td>
            <td>${e.BaseSalary || ""}</td>
            <td>${e.Status || ""}</td>
            <td>
                <button class="btn btn-warning btn-sm"
                    onclick="editEmployee(${e.EmployeeID})">
                    Sửa
                </button>

                <button class="btn btn-danger btn-sm"
                    onclick="deleteEmployee(${e.EmployeeID})">
                    Xóa
                </button>
            </td>
        </tr>
        `;
    });

    document.getElementById("employeeTable").innerHTML = html;
}

// SAVE
async function saveEmployee() {

    const data = {

        FullName:
            document.getElementById("name").value.trim(),

        IDCard:
            document.getElementById("cccd").value.trim(),

        PhoneNumber:
            document.getElementById("phone").value.trim(),

        RoleID:
            document.getElementById("role").value,

        BaseSalary:
            document.getElementById("salary").value,

        Status:
            document.getElementById("status").value
    };

    // ================= VALIDATE =================
    if (!data.FullName) {
        alert("❌ Họ tên không được để trống");
        return;
    }

    if (!data.IDCard) {
        alert("❌ CCCD không được để trống");
        return;
    }

    if (!data.PhoneNumber) {
        alert("❌ Số điện thoại không được để trống");
        return;
    }

    if (!data.RoleID) {
        alert("❌ Vui lòng chọn chức vụ");
        return;
    }

    if (!data.BaseSalary) {
        alert("❌ Lương không được để trống");
        return;
    }

    if (!data.Status) {
        alert("❌ Vui lòng chọn trạng thái");
        return;
    }

    try {

        let res;

        if (editId) {

            res = await fetch("/api/employees/" + editId, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

        } else {

            res = await fetch("/api/employees", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
        }

        const result = await res.json();

        if (!res.ok) {
            alert("❌ " + result.message);
            return;
        }

        alert("✅ Lưu thành công");

        resetForm();

        loadEmployees();

    } catch (err) {

        console.error(err);

        alert("❌ Có lỗi xảy ra");
    }
}

// EDIT
function editEmployee(id) {

    const e = employees.find(x => x.EmployeeID == id);

    if (!e) return;

    document.getElementById("name").value =
        e.FullName || "";

    document.getElementById("cccd").value =
        e.IDCard || "";

    document.getElementById("phone").value =
        e.PhoneNumber || "";

    document.getElementById("role").value =
        e.RoleID || "";

    document.getElementById("salary").value =
        e.BaseSalary || "";

    document.getElementById("status").value =
        e.Status || "";

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

    const key =
        document.getElementById("searchInput")
        .value
        .toLowerCase();

    const filtered = employees.filter(e =>

        (e.FullName || "")
        .toLowerCase()
        .includes(key)
    );

    renderTable(filtered);
}

// RESET
function resetForm() {

    document.querySelectorAll("#main input")
        .forEach(i => i.value = "");

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