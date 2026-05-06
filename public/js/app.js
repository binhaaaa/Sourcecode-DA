// ================= LOAD PAGE =================
async function loadPage(page) {
    try {
        // 🎯 Đổi tiêu đề
        document.getElementById("title").innerText = page.toUpperCase();

        // 🎯 Load HTML
        const res = await fetch(`/pages/${page}.html`);
        const html = await res.text();

        document.getElementById("main").innerHTML = html;

        // ================= REMOVE SCRIPT CŨ =================
        const oldScript = document.getElementById("page-script");
        if (oldScript) oldScript.remove();

        // ================= LOAD JS THEO PAGE =================
        let script = document.createElement("script");
        script.id = "page-script";

        switch (page) {
            case "tenants":
                script.src = "/js/tenants.js";
                break;

            case "rooms":
                script.src = "/js/rooms.js";
                break;

            case "invoices":
                script.src = "/js/invoices.js";
                break;

            case "employees":
                script.src = "/js/employees.js";
                break;

            default:
                script = null;
        }

        // ================= GẮN SCRIPT + RUN =================
        if (script) {

            script.onload = () => {
                console.log("✅ Script loaded:", page);

                // 🔥 GỌI FUNCTION SAU KHI LOAD
                if (page === "tenants" && typeof loadTenants === "function") {
                    loadTenants();
                }

                if (page === "rooms" && typeof loadRooms === "function") {
                    loadRooms();
                }

                if (page === "employees" && typeof loadRooms === "function") {
                    loadEmployees();S
                }
            };

            document.body.appendChild(script);
        }

    } catch (err) {
        console.error("❌ Load page lỗi:", err);
    }
}

// ================= AUTO LOAD =================
window.onload = () => {
    loadPage("dashboard");
};