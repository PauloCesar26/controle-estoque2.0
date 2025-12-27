import { loginEmailAndPassword } from "./auth-firebase.js";

export function loginAdmin(){
    const adminEmail = document.getElementById("email");
    const adminPassword = document.getElementById("password");

    const btnLogin = document.getElementById("btn-login");

    btnLogin.addEventListener("submit", (e) => {
        e.preventDefault();
        loginEmailAndPassword(adminEmail, adminPassword);
    });
}