// ================= LOAD PAGE =================

async function loadPage(page, element = null) {

    try {

        // ================= ACTIVE MENU =================

        document.querySelectorAll(".sidebar a")
            .forEach(a =>
                a.classList.remove("active")
            );

        if (element) {

            element.classList.add("active");
        }

        // ================= TITLE =================

        document.getElementById("title").innerText =
            page.toUpperCase();

        // ================= LOAD HTML =================

        const res =
            await fetch(`/pages/${page}.html`);

        const html =
            await res.text();

        document.getElementById("main").innerHTML =
            html;

        // ================= REMOVE SCRIPT CŨ =================

        const oldScript =
            document.getElementById("page-script");

        if (oldScript) {

            oldScript.remove();
        }

        // ================= LOAD JS =================

        let script =
            document.createElement("script");

        script.id = "page-script";

        switch (page) {

            case "dashboard":

                script.src =
                    "/js/dashboard.js";

                break;

            case "rooms":

                script.src =
                    "/js/rooms.js";

                break;

            case "tenants":

                script.src =
                    "/js/tenants.js";

                break;

            case "contracts":

                script.src =
                    "/js/contracts.js";

                break;

            case "roomRentals":

                script.src =
                    "/js/roomRentals.js";

                break;

            case "employees":

                script.src =
                    "/js/employees.js";

                break;

            case "invoices":

                script.src =
                    "/js/invoices.js";

                break;

            default:

                script = null;
        }

        // ================= APPEND SCRIPT =================

        if (script) {

            script.onload = () => {

                console.log(
                    "✅ Script loaded:",
                    page
                );

                // ================= LOAD FUNCTIONS =================

                if (
                    page === "dashboard" &&
                    typeof loadDashboard === "function"
                ) {

                    loadDashboard();
                }

                if (
                    page === "rooms" &&
                    typeof loadRooms === "function"
                ) {

                    loadRooms();
                }

                if (
                    page === "tenants" &&
                    typeof loadTenants === "function"
                ) {

                    loadTenants();
                }

                if (
                    page === "contracts" &&
                    typeof loadContracts === "function"
                ) {

                    loadContracts();
                }

                if (
                    page === "roomRentals" &&
                    typeof loadRentals === "function"
                ) {

                    loadRentals();
                }

                if (
                    page === "employees" &&
                    typeof loadEmployees === "function"
                ) {

                    loadEmployees();
                }

                if (
                    page === "invoices" &&
                    typeof loadInvoices === "function"
                ) {

                    loadInvoices();
                }
            };

            document.body.appendChild(script);
        }

    } catch (err) {

        console.error(
            "❌ Load page lỗi:",
            err
        );
    }
}

// ================= AUTO LOAD =================

window.onload = () => {

    const firstMenu =
        document.querySelector(".sidebar a");

    loadPage(
        "dashboard",
        firstMenu
    );
};