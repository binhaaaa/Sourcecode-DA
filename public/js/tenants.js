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

            alert("❌ Không tải được danh sách khách thuê");
        }
    }

    // ================= RENDER =================
    function renderTable(data = tenants) {

        let html = "";

        data.forEach(t => {

            html += `
            <tr>
                <td>${t.TenantID}</td>

                <td>${t.FullName || ""}</td>

                <td>${t.IDCard || ""}</td>

                <td>${t.Hometown || ""}</td>

                <td>${t.PhoneNumber || ""}</td>

                <td>${t.Email || ""}</td>

                <td>
                    ${t.BirthDate
                        ? t.BirthDate.split("T")[0]
                        : ""}
                </td>

                <td>${t.Gender || ""}</td>

                <td>
                    ${t.IsRepresentative == 1 ? "✔" : ""}
                </td>

                <td class="action-cell">

                    <button
                        class="btn btn-warning btn-sm"
                        onclick="editTenant(${t.TenantID})">
                        Sửa
                    </button>

                    <button
                        class="btn btn-danger btn-sm"
                        onclick="deleteTenant(${t.TenantID})">
                        Xóa
                    </button>

                </td>
            </tr>
            `;
        });

        const table =
            document.getElementById("tenantTable");

        if (table) {

            table.innerHTML = html;
        }
    }

    // ================= SAVE =================
    async function saveTenant() {

        try {

            const data = {

                FullName:
                    document.getElementById("name").value.trim(),

                IDCard:
                    document.getElementById("cccd").value.trim(),

                Hometown:
                    document.getElementById("hometown").value.trim(),

                PhoneNumber:
                    document.getElementById("phone").value.trim(),

                Email:
                    document.getElementById("email").value.trim(),

                BirthDate:
                    document.getElementById("birth").value,

                Gender:
                    document.getElementById("gender").value,

                // FIX BIT SQL
                IsRepresentative:
                    Number(
                        document.getElementById("represent").value
                    )
            };

            // ================= VALIDATE =================

            if (!data.FullName) {

                alert("❌ Vui lòng nhập họ tên");

                return;
            }

            if (!data.IDCard) {

                alert("❌ Vui lòng nhập CCCD");

                return;
            }

            // ================= CHECK CCCD =================

            // đúng 12 số
            const cccdRegex = /^\d{12}$/;

            if (!cccdRegex.test(data.IDCard)) {

                alert("❌ CCCD phải gồm đúng 12 số");

                return;
            }

            // kiểm tra trùng CCCD
            const duplicateCCCD = tenants.find(t =>

                t.IDCard === data.IDCard &&
                t.TenantID != editId
            );

            if (duplicateCCCD) {

                alert("❌ CCCD đã tồn tại");

                return;
            }

            // ================= CHECK PHONE =================

            if (data.PhoneNumber) {

                const phoneRegex =
                    /^(0|\+84)\d{9}$/;

                if (!phoneRegex.test(data.PhoneNumber)) {

                    alert("❌ Số điện thoại không hợp lệ");

                    return;
                }
            }

            // ================= CHECK EMAIL =================

            if (data.Email) {

                const emailRegex =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!emailRegex.test(data.Email)) {

                    alert("❌ Email không hợp lệ");

                    return;
                }
            }

            let res;

            // ================= UPDATE =================
            if (editId) {

                res = await fetch(
                    "/api/tenants/" + editId,
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
                    "/api/tenants",
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

            loadTenants();

        } catch (err) {

            console.error("❌ Lỗi saveTenant:", err);

            alert("❌ Có lỗi xảy ra");
        }
    }

    // ================= EDIT =================
    function editTenant(id) {

        const t =
            tenants.find(x => x.TenantID == id);

        if (!t) return;

        document.getElementById("name").value =
            t.FullName || "";

        document.getElementById("cccd").value =
            t.IDCard || "";

        document.getElementById("hometown").value =
            t.Hometown || "";

        document.getElementById("phone").value =
            t.PhoneNumber || "";

        document.getElementById("email").value =
            t.Email || "";

        document.getElementById("birth").value =
            t.BirthDate
                ? t.BirthDate.split("T")[0]
                : "";

        document.getElementById("gender").value =
            t.Gender || "Nam";

        document.getElementById("represent").value =
            Number(t.IsRepresentative);

        editId = id;
    }

    // ================= DELETE =================
    async function deleteTenant(id) {

        if (!confirm("Bạn có chắc muốn xóa?")) {

            return;
        }

        try {

            const res = await fetch(
                "/api/tenants/" + id,
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

            loadTenants();

        } catch (err) {

            console.error("❌ Lỗi deleteTenant:", err);

            alert("❌ Có lỗi xảy ra");
        }
    }

    // ================= SEARCH =================
    function searchTenant() {

        const keyword =
            document.getElementById("searchInput")
            .value
            .toLowerCase();

        const filtered = tenants.filter(t =>

            (t.FullName || "")
            .toLowerCase()
            .includes(keyword)
        );

        renderTable(filtered);
    }

    // ================= RESET =================
    function resetForm() {

        document.querySelectorAll("#main input")
            .forEach(i => i.value = "");

        document.getElementById("gender").value =
            "Nam";

        document.getElementById("represent").value =
            "0";

        editId = null;
    }

    // ================= EXPORT =================
    window.loadTenants = loadTenants;

    window.saveTenant = saveTenant;

    window.editTenant = editTenant;

    window.deleteTenant = deleteTenant;

    window.searchTenant = searchTenant;

    window.resetForm = resetForm;

    // ================= INIT =================
    loadTenants();
}