import { ref, onValue, set } from "firebase/database";
import { showToastify } from "../../../components/toastify.js";
import { db } from "../../../app.js";

export function loadCurrentEstoque(displayCurrentMassa, displayCurrentRecheio){
    const massaEstoqueRef = ref(db, "massa");
    const recheioEstoqueRef = ref(db, "recheio");
    const ordersRef = ref(db, "orders");

    let massa = [];
    let recheio = [];
    let orders = [];

    function renderDatas(){
        if(!massa || !recheio || !orders){
            showToastify("Sem produtos para mostrar"); 
            return;
        }

        const countMassas = {};
        const countRecheios = {};

        orders.forEach(p => {
            countMassas[p.massa1] = (countMassas[p.massa1] || 0) + 1;
            countMassas[p.massa2] = (countMassas[p.massa2] || 0) + 1;

            countRecheios[p.recheio1] = (countRecheios[p.recheio1] || 0) + 1;
            countRecheios[p.recheio2] = (countRecheios[p.recheio2] || 0) + 1;
        });

        displayCurrentMassa.innerHTML = "";
        displayCurrentRecheio.innerHTML = "";

        const currentMassaEstoque = [];
        const currentRecheioEstoque = [];

        massa.forEach(massa => {
            const usedOrder = countMassas[massa.massa] || 0;
            const qtdAtual = Math.max(Number(massa.quantidade) - usedOrder, 0);

            currentMassaEstoque.push({ massa: massa.massa, quantidade: qtdAtual });

            displayCurrentMassa.innerHTML += `
                <p class="border-b-1 pl-2">${massa.massa}</p>
                <p class="border-b-1">${qtdAtual}</p>
            `;
        });

        recheio.forEach(recheio => {
            const usedOrder = countRecheios[recheio.recheio] || 0;
            const qtdAtual = Math.max(Number(recheio.quantidade) - usedOrder, 0);

            currentRecheioEstoque.push({ recheio: recheio.recheio, quantidade: qtdAtual });

            displayCurrentRecheio.innerHTML += `
                <p class="border-b-1 pl-2">${recheio.recheio}</p>
                <p class="border-b-1">${qtdAtual}</p>
            `;
        });

        set(ref(db, "dbCurrentMassa"), { currentMassaEstoque });
        set(ref(db, "dbCurrentRecheio"), { currentRecheioEstoque });
    }

    onValue(massaEstoqueRef, (snapshot) => {
        const data = snapshot.val();
        massa = [];

        if(data){
            Object.values(data).forEach(el => {
                if(el.listMassas) massa.push(...el.listMassas);
            });
        }

        renderDatas();
    });

    onValue(recheioEstoqueRef, (snapshot) => {
        const data = snapshot.val();
        recheio = [];

        if (data) {
            Object.values(data).forEach(el => {
                if(el.listRecheios) recheio.push(...el.listRecheios);
            });
        }

        renderDatas();
    });

    onValue(ordersRef, (snapshot) => {
        const data = snapshot.val();
        orders = data ? Object.values(data) : [];
        
        renderDatas();
    });
}