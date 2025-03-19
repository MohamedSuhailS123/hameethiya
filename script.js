document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const usernameDisplay = document.getElementById("username");
    const logoutBtn = document.getElementById("logoutBtn");

    // Function to get token from cookies
    function getCookie(name) {
        const cookies = document.cookie.split("; ");
        for (let cookie of cookies) {
            const [key, value] = cookie.split("=");
            if (key === name) return value;
        }
        return null;
    }

    // LOGIN FORM HANDLER
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const loginId = document.getElementById("loginId").value.trim();
            const password = document.getElementById("password").value;
            const errorMessage = document.getElementById("errorMessage");

            fetch("http://localhost:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ loginId, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    errorMessage.style.display = "block";
                    errorMessage.textContent = data.error;
                } else {
                    // Store JWT in a cookie
                    document.cookie = `token=${data.token}; path=/; Secure`;

                    // Store username in localStorage
                    localStorage.setItem("username", data.username);

                    // Redirect to Dashboard
                    window.location.href = "index.html";
                }
            })
            .catch(error => {
                console.error("Error:", error);
                errorMessage.style.display = "block";
                errorMessage.textContent = "Something went wrong. Try again.";
            });
        });
    }

    // REGISTRATION FORM HANDLER
    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const username = document.getElementById("username").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;
            const errorMessage = document.getElementById("errorMessage");

            fetch("http://localhost:5000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    errorMessage.style.display = "block";
                    errorMessage.textContent = data.error;
                } else {
                    alert("Registration successful! You can now log in.");
                    window.location.href = "login.html";
                }
            })
            .catch(error => {
                console.error("Error:", error);
                errorMessage.style.display = "block";
                errorMessage.textContent = "Something went wrong. Try again.";
            });
        });
    }

    // AUTO REDIRECT TO LOGIN IF NOT LOGGED IN (Index Page)
    if (usernameDisplay) {
        const token = getCookie("token"); // Get JWT from cookies
        if (!token) {
            window.location.href = "login.html"; // Redirect if no user is logged in
        } else {
            const username = localStorage.getItem("username");
            if (username) {
                usernameDisplay.textContent = username;
            }
        }
    }

    // LOGOUT FUNCTIONALITY
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            localStorage.removeItem("username");
            window.location.href = "login.html";
        });
    }
});
