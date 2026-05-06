// 🔒 chống load trùng
if (!window.tenantsModule) {

    window.tenantsModule = true;

    let tenants = [];
    let editId = null;

    // ================= LOAD =================
    async function loadTenants() {
        try {
            console.log("🔥 loadTenants chạy");

            const res = await fetch("/api/tenants");
            tenants = await res.json();

            renderTable();
        } catch (err) {
            console.error("❌ Lỗi loadTenants:", err);
        }
    }

    // ================= RENDER =================
    function renderTable(data = tenants) {
        let html = "";

        data.forEach(t => {
            html += `
            <tr>
                <td>${t.TenantID}</td>
                <td>${t.FullName}</td>
                <td>${t.IDCard}</td>
                <td>${t.Hometown || ""}</td>
                <td>${t.PhoneNumber || ""}</td>
                <td>${t.Email || ""}</td>
                <td>${t.BirthDate ? t.BirthDate.split("T")[0] : ""}</td>
                <td>${t.Gender || ""}</td>
                <td>${t.IsRepresentative == 1 ? "✔" : ""}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editTenant(${t.TenantID})">Sửa</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteTenant(${t.TenantID})">Xóa</button>
                </td>
            </tr>`;
        });

        const table = document.getElementById("tenantTable");
        if (table) table.innerHTML = html;
    }

    // ================= SAVE =================
    async function saveTenant() {
        try {
            const data = {
                FullName: document.getElementById("name").value,
                IDCard: document.getElementById("cccd").value,
                Hometown: document.getElementById("hometown").value,
                PhoneNumber: document.getElementById("phone").value,
                Email: document.getElementById("email").value,
                BirthDate: document.getElementById("birth").value,
                Gender: document.getElementById("gender").value,
                IsRepresentative: document.getElementById("represent").value
            };

            if (!data.FullName) {
                alert("❌ Vui lòng nhập tên!");
                return;
            }

            if (editId) {
                await fetch("/api/tenants/" + editId, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });
            } else {
                await fetch("/api/tenants", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });
            }

            alert("✅ Thành công");

            resetForm();
            loadTenants();

        } catch (err) {
            console.error("❌ Lỗi saveTenant:", err);
        }
    }

    // ================= EDIT =================
    function editTenant(id) {
        const t = tenants.find(x => x.TenantID == id);
        if (!t) return;

        document.getElementById("name").value = t.FullName;
        document.getElementById("cccd").value = t.IDCard;
        document.getElementById("hometown").value = t.Hometown;
        document.getElementById("phone").value = t.PhoneNumber;
        document.getElementById("email").value = t.Email;
        document.getElementById("birth").value = t.BirthDate ? t.BirthDate.split("T")[0] : "";
        document.getElementById("gender").value = t.Gender;
        document.getElementById("represent").value = t.IsRepresentative;

        editId = id;
    }

    // ================= DELETE =================
    async function deleteTenant(id) {
        if (!confirm("Bạn có chắc muốn xóa?")) return;

        try {
            await fetch("/api/tenants/" + id, {
                method: "DELETE"
            });

            alert("🗑️ Đã xóa");

            loadTenants();
        } catch (err) {
            console.error("❌ Lỗi deleteTenant:", err);
        }
    }

    // ================= SEARCH =================
    function searchTenant() {
        const keyword = document.getElementById("searchInput").value.toLowerCase();

        const filtered = tenants.filter(t =>
            (t.FullName || "").toLowerCase().includes(keyword)
        );

        renderTable(filtered);
    }

    // ================= RESET =================
    function resetForm() {
        document.querySelectorAll("#main input").forEach(i => i.value = "");
        editId = null;
    }

    // 🔥 export ra global để HTML gọi được
    window.loadTenants = loadTenants;
    window.saveTenant = saveTenant;
    window.editTenant = editTenant;
    window.deleteTenant = deleteTenant;
    window.searchTenant = searchTenant;
    window.resetForm = resetForm;

    // 🔥 chạy ngay khi load script (QUAN TRỌNG)
    loadTenants();
}