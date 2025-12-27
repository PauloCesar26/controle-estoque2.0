import { db } from "../../app.js";
import { ref, onValue, push, set, off } from "firebase/database";
import { cleanOrderDb } from "./feature-db/cleanOrderDb.js";
import { handleSelect } from "./feature-display/handleSelect.js";
import { renderOrders } from "./feature-display/renderOrders.js";
import { showToastify } from "../../components/toastify.js";
import { loadingOverlay } from "../../components/loadingOverlay.js";
import { updateUI } from "../estoquePage/feature-estoque/updateUI.js";

export function pedido(){
    const form = document.getElementById("form");
    const btnClean = document.getElementById("limpar");
    const name = document.getElementById("name");
    const massa1 = document.querySelector(".name-massa1");
    const recheio1 = document.querySelector(".name-recheio1");
    const massa2 = document.querySelector(".name-massa2");
    const recheio2 = document.querySelector(".name-recheio2");

    const currentDate = document.getElementById("current-date");
    const date = new Date(); 
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    if(currentDate){
        currentDate.textContent = formattedDate;
    }

    const displayQtdOrders = document.getElementById("qtd-pedido-panel");
    const displayQtdOrdersPreparing = document.getElementById("qtd-pedido-preparing");

    
    // let numOrder = 0;
    // const dbOrder = ref(db, "orders");
    // onValue(dbOrder, (snapshot) => {
    //     const data = snapshot.val();

    //     if(data){
    //         const totalPedidos = Object.keys(data).length;
    //         numOrder = totalPedidos + 1;
    //     } 
    //     else{
    //         numOrder = 0;
    //     }
    // });

    if(form){
        handleSelect();
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const nomeDigitado = name.value.trim();
            const massa1Pedido = massa1.value;
            const recheio1Pedido = recheio1.value;
            const massa2Pedido = massa2.value;
            const recheio2Pedido = recheio2.value;
            
            if(nomeDigitado === ""){
                showToastify("Preencha o nome do cliente");
                return;
            }
            if(massa1Pedido === ""){
                showToastify("Escolha a massa 1");
                return;
            }
            if(recheio1Pedido === ""){
                showToastify("Escolha o recheio 1");
                return;
            }
            if(massa2Pedido === ""){
                showToastify("Escolha a massa 2");
                return;
            }
            if(recheio2Pedido === ""){
                showToastify("Escolha o recheio 2");
                return;
            }
            
            const order = {
                // numOrder: numOrder,
                name: nomeDigitado,
                massa1: massa1Pedido,
                recheio1: recheio1Pedido,
                massa2: massa2Pedido,
                recheio2: recheio2Pedido,
                status: false,
            };
            
            const dbOrder = ref(db, "orders");
            const newRefOrder = push(dbOrder);
            set(newRefOrder, order);
            form.reset();
        });
        
        btnClean.addEventListener("click", () => {
            cleanOrderDb();
        });
    }

    const ordersRef = ref(db, "orders");
    onValue(ordersRef, (snapshot) => {
        renderOrders(snapshot);
    });

    onValue(ordersRef, (snapshot) => {
        const data = snapshot.val();
        let currentQtdOrders = 0;
        let currentQtdOrdersPreparing = 0;

        if(!data){ 
            if(displayQtdOrders) displayQtdOrders.textContent = "0";
            if(displayQtdOrdersPreparing) displayQtdOrdersPreparing.textContent = "0";
            showToastify("Nenhum pedido feito");
            return;
        }

        Object.values(data).forEach(el => {
            if(el){
                currentQtdOrders++;
            }
            if(el.status === false){
                currentQtdOrdersPreparing++;
            }
        });
        
        if(displayQtdOrders) displayQtdOrders.textContent = currentQtdOrders;
        if(displayQtdOrdersPreparing) displayQtdOrdersPreparing.textContent = currentQtdOrdersPreparing;
    });
}