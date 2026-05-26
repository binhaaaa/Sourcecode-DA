// 🔒 chống load trùng
if (!window.dashboardModule) {

    window.dashboardModule = true;

    let roomChart = null;

    // ================= LOAD DASHBOARD =================

    window.loadDashboard = async function () {

        try {

            // ================= API =================

            const roomRes =
                await fetch("/api/rooms");

            const tenantRes =
                await fetch("/api/tenants");

            const employeeRes =
                await fetch("/api/employees");

            const contractRes =
                await fetch("/api/contracts");

            const rentalRes =
                await fetch("/api/roomRentals");

            // ================= JSON =================

            const rooms =
                await roomRes.json();

            const tenants =
                await tenantRes.json();

            const employees =
                await employeeRes.json();

            const contracts =
                await contractRes.json();

            const rentals =
                await rentalRes.json();

            console.log("ROOMS:", rooms);
            console.log("TENANTS:", tenants);
            console.log("EMPLOYEES:", employees);
            console.log("CONTRACTS:", contracts);

            // ================= ROOM STATS =================

            const totalRooms =
                rooms.length;

            const emptyRooms =
                rooms.filter(r =>
                    r.Status === "Trống"
                ).length;

            const rentedRooms =
                rooms.filter(r =>
                    r.Status === "Đang thuê"
                ).length;

            const maintenanceRooms =
                rooms.filter(r =>
                    r.Status === "Bảo trì"
                ).length;

            const depositRooms =
                rooms.filter(r =>
                    r.Status === "Đã cọc"
                ).length;

            // ================= KHÁCH CÒN Ở =================

            // ================= KHÁCH ĐANG Ở =================

const activeRentals =
    rentals.filter(r =>

        r.RentalStatus === "Đang ở"
    );

// lấy TenantID
const tenantIds =
    activeRentals.map(r =>
        r.TenantID
    );

// loại trùng
const uniqueTenantIds =
    [...new Set(tenantIds)];

// tổng khách đang ở
const totalTenants =
    uniqueTenantIds.length;

            // ================= NHÂN VIÊN =================

            const totalEmployees =
                employees.filter(e =>

                    e.Status === "Đang làm việc"

                ).length;

            // ================= SHOW =================

            document.getElementById(
                "totalRooms"
            ).innerText =
                totalRooms;

            document.getElementById(
                "emptyRooms"
            ).innerText =
                emptyRooms;

            document.getElementById(
                "rentedRooms"
            ).innerText =
                rentedRooms;

            document.getElementById(
                "maintenanceRooms"
            ).innerText =
                maintenanceRooms;

            document.getElementById(
                "depositRooms"
            ).innerText =
                depositRooms;

            document.getElementById(
                "totalTenants"
            ).innerText =
                totalTenants;

            document.getElementById(
                "totalEmployees"
            ).innerText =
                totalEmployees;

            // ================= CHART =================

            const canvas =
                document.getElementById(
                    "roomChart"
                );

            if (!canvas) {

                console.log(
                    "Không tìm thấy roomChart"
                );

                return;
            }

            const ctx =
                canvas.getContext("2d");

            // destroy chart cũ
            if (roomChart) {

                roomChart.destroy();
            }

            // tạo chart mới
            roomChart = new Chart(ctx, {

                type: "pie",

                data: {

                    labels: [

                        "Phòng trống",

                        "Đang thuê",

                        "Bảo trì",

                        "Đã cọc"
                    ],

                    datasets: [{

                        data: [

                            emptyRooms,

                            rentedRooms,

                            maintenanceRooms,

                            depositRooms
                        ],

                        backgroundColor: [

                            "#198754",

                            "#dc3545",

                            "#ffc107",

                            "#0dcaf0"
                        ],

                        borderWidth: 2,

                        hoverOffset: 20
                    }]
                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            position: "bottom",

                            labels: {

                                padding: 20,

                                font: {

                                    size: 15,

                                    weight: "bold"
                                }
                            }
                        }
                    }
                }
            });

        } catch (err) {

            console.error(
                "❌ Lỗi dashboard:",
                err
            );

            alert(
                "❌ Không tải được dashboard"
            );
        }
    };

    // ================= INIT =================

    loadDashboard();
}