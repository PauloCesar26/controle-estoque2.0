import { ref, onValue, set } from "firebase/database";
import { showToastify } from "../../../components/toastify.js";
import { db } from "../../../app.js";
import { handleSelect } from "../../pedidoPage/feature-display/handleSelect.js";

export function loadCurrentEstoque(displayCurrentMassa, displayCurrentRecheio){
    const massaEstoqueRef = ref(db, "massa");
    const recheioEstoqueRef = ref(db, "recheio");
    const ordersRef = ref(db, "orders");

    onValue(ordersRef, (snapshot) => {
        const dataOrders = snapshot.val();
        const currentMassaEstoque = [];
        const currentRecheioEstoque = [];

        const orders = dataOrders ? Object.values(dataOrders) : [];

        const allMassasOrder = orders.flatMap(p => [p.massa1, p.massa2]);
        const countMassas = {};
        allMassasOrder.forEach(nome => {
            countMassas[nome] = (countMassas[nome] || 0) + 1;
        });

        const allRecheiosOrder = orders.flatMap(p => [p.recheio1, p.recheio2]);
        const countRecheios = {};
        allRecheiosOrder.forEach(nome => {
            countRecheios[nome] = (countRecheios[nome] || 0) + 1;
        });
 
        displayCurrentMassa.innerHTML = "";
        onValue(massaEstoqueRef, (snapshot) => {
            const data = snapshot.val();
            const massaEstoque = [];
            
            if(!data){ 
                showToastify("Não contem massa no estoque atual");
                return; 
            }

            Object.values(data).forEach(el => {
                if (el.listMassas && Array.isArray(el.listMassas)) {
                    massaEstoque.push(...el.listMassas);
                }
            });

            massaEstoque.forEach(massa => {
                const qtdPedidos = countMassas[massa.massa] || 0;
                const qtdAtual = Math.max(parseInt(massa.quantidade) - qtdPedidos, 0);

                currentMassaEstoque.push({ 
                    massa: massa.massa, 
                    quantidade: qtdAtual 
                });

                displayCurrentMassa.innerHTML += `
                    <p class="border-b-1 pl-2">${massa.massa}</p>
                    <p class="border-b-1">${qtdAtual}</p>
                `;
            });

            const dbCurrentMassa = ref(db, "dbCurrentMassa");
            set(dbCurrentMassa, { currentMassaEstoque });
        });
        
        displayCurrentRecheio.innerHTML = "";
        onValue(recheioEstoqueRef, (snapshot) => {
            const data = snapshot.val();
            const recheioEstoque = [];

            if(!data){ 
                showToastify("Não contem recheio no estoque atual");
                return; 
            }

            Object.values(data).forEach(el => {
                if (el.listRecheios && Array.isArray(el.listRecheios)) {
                    recheioEstoque.push(...el.listRecheios);
                }
            });

            recheioEstoque.forEach(recheio => {
                const qtdPedidos = countRecheios[recheio.recheio] || 0;
                const qtdAtual = Math.max(parseInt(recheio.quantidade) - qtdPedidos, 0);

                currentRecheioEstoque.push({ 
                    recheio: recheio.recheio, 
                    quantidade: qtdAtual 
                });

                displayCurrentRecheio.innerHTML += `
                    <p class="border-b-1 pl-2">${recheio.recheio}</p>
                    <p class="border-b-1">${qtdAtual}</p>
                `;
            });

            const dbCurrentRecheio = ref(db, "dbCurrentRecheio");
            set(dbCurrentRecheio, { currentRecheioEstoque });
        });
    });
}