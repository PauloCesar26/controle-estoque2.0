import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { loginAdmin } from "./pages/login-admin/script-login/event-login.js";
import { checkAuth } from "./pages/login-admin/script-login/middleware-route.js";
import { estoque } from "./pages/estoquePage/scriptStock.js";
import { pedido } from "./pages/pedidoPage/scriptOrders.js";
import { makeNavbarWorks } from "./components/navbar.js";
import { ordersPanel } from "./pages/ordersPanel/scriptOrdersPanel.js";

const firebaseConfig = {
    apiKey: "AIzaSyBeZQMgq6T2CDdV0p7oLmsGYgw_lyB-BFM",
    authDomain: "sistema-estoque-jd.firebaseapp.com",
    projectId: "sistema-estoque-jd",
    storageBucket: "sistema-estoque-jd.firebasestorage.app",
    messagingSenderId: "98888488456",
    appId: "1:98888488456:web:66d9791a41d8ff9b2463bd",
    databaseURL: "https://sistema-estoque-jd-default-rtdb.firebaseio.com" 
};

const appFirebase = initializeApp(firebaseConfig);
export const db = getDatabase(appFirebase);
export const auth = getAuth(appFirebase);

const app = document.getElementById("app");
const routes = {
    "/": "/pages/login-admin/login.html",
    "/Home": "/pages/home.html",
    "/Estoque": "/pages/estoquePage/index.html",
    "/Pedidos": "/pages/pedidoPage/index.html",
    "/Painel-pedidos": "/pages/ordersPanel/index.html"
};
const privateRoutes = [
    "/Home",
    "/Estoque",
    "/Pedidos",
    "/Painel-pedidos"
];
 
export const render = async (path) => {
    const isPrivate = privateRoutes.includes(path);
    const userAuth = await checkAuth();

    if(isPrivate && !userAuth){
        console.log("User not auth");
        history.pushState({}, "", "/");
        return render("/");
    }
    if((path === "/" || path === "") && userAuth){
        history.pushState({}, "", "/Home");
        return render("/Home");
    }

    const route = routes[path] || routes["/"];
    console.log(route);

    try{
        const req = await fetch(route);

        if(!req.ok){
            app.innerHTML = `<h1>Erro ${req.status}</h1>`;
            return;
        }

        const res = await req.text();

        app.innerHTML = res;
        logicPage(path);
    }
    catch (error){
        console.error("Erro: ", error);
        app.innerHTML = "<h1>Erro ao carregar a página</h1>";
    }
};

const logicPage = (path) => {
    switch(path){
        case "/": 
            loginAdmin(); 
        break;
        case "/Home": 
            makeNavbarWorks(); 
        break;
        case "/Estoque": 
            makeNavbarWorks(); 
            estoque(); 
        break;
        case "/Pedidos":
            makeNavbarWorks();
            pedido();
        break;
        case "/Painel-pedidos":
            makeNavbarWorks();
            ordersPanel();
        break;
    }
};

window.onpopstate = () => {
    render(location.pathname);   
};

document.body.addEventListener("click", (e) => {
    const link = e.target.closest("a[data-link]");
    if (!link) return;

    e.preventDefault();

    const path = link.getAttribute("href");
    history.pushState({}, "", path);
    render(path);
});

document.addEventListener("DOMContentLoaded", () => {
    render(location.pathname);
});


