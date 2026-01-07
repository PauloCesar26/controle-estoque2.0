import { loginEmailAndPassword } from "./auth-firebase.js";

export function loginAdmin(){
    const adminEmail = document.getElementById("email");
    const adminPassword = document.getElementById("password");
    const btnPassword = document.querySelector(".show-password");

    const btnLogin = document.getElementById("btn-login");

    btnLogin.addEventListener("click", (e) => {
        e.preventDefault();
        loginEmailAndPassword(adminEmail, adminPassword);
    });

    btnPassword.addEventListener("click", () => {
        const isPassword = adminPassword.type === "password";
        adminPassword.type = isPassword ? "text" : "password";
    });
}