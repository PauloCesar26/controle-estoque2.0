import { logout } from "../pages/login-admin/script-login/auth-firebase";
import { render } from "../app";

export function makeNavbarWorks(){
    const menuMobile = document.querySelector(".menu-mobile");
    const btnMenuMobile = document.querySelector(".btn-menu-mobile");
    const iconOpen = document.getElementById("icon-open");
    const iconClose = document.getElementById("icon-close");
    const btnLogoutElements = document.querySelectorAll(".btn-logout");
        
    if(!btnMenuMobile || !menuMobile) return;

    const toggleMenu = () => {
        menuMobile.classList.toggle("hidden");
        iconOpen.classList.toggle("hidden");
        iconClose.classList.toggle("hidden");
    };
    btnMenuMobile.addEventListener("click", toggleMenu);

    btnLogoutElements.forEach(btn => {
        btn.addEventListener("click", async () => {
            await logout();
            history.pushState({}, "", "/");
            render("/");
        });
    });
}