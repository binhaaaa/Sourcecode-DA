async function login() {

    const username =
        document.getElementById(
            "username"
        ).value.trim();

    const password =
        document.getElementById(
            "password"
        ).value.trim();

    const msg =
        document.getElementById(
            "msg"
        );

    try {

        const res =
            await fetch(
                "/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            username,
                            password
                        })
                }
            );

        const data =
            await res.json();

        if (!res.ok) {

            msg.innerText =
                data.message;

            return;
        }

        msg.style.color =
            "green";

        msg.innerText =
            "Đăng nhập thành công";

        // chuyển trang
        setTimeout(() => {

            window.location.href =
                "/pages/dashboard.html";

        }, 1000);

    } catch (err) {

        console.error(err);

        msg.innerText =
            "Lỗi server";
    }
}