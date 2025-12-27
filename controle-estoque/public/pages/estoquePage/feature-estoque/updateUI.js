import { ref, onValue } from "firebase/database";
import { db } from "../../../../src/app.js";
import { loadingOverlay } from "../../../../src/components/loadingOverlay.js";
import { loadCurrentEstoque } from "./loadCurrentEstoque.js";
import { showToastify } from "../../../../src/components/toastify.js";

export function updateUI(){    
    const displayMassa = document.getElementById("exibir-massa");
    const displayRecheio = document.getElementById("exibir-recheio");
    const displayBebida = document.getElementById("exibir-bebida");
    
    const displayCurrentMassa = document.getElementById("display-current-massa");
    const displayCurrentRecheio = document.getElementById("display-current-recheio");
    
    const form = document.getElementById("form");
    const btnUpdateEstoque = document.getElementById("update-estoque");
    const estoque = document.getElementById("estoque");
    
    const massaEstoqueRef = ref(db, "massa");
    const recheioEstoqueRef = ref(db, "recheio");
    const bebidaEstoqueRef = ref(db, "bebida");

    loadingOverlay.show();

    setTimeout(() => {
        onValue(massaEstoqueRef, (snapshot) => {
            const data = snapshot.val();
            const massaEstoque = [];
    
            if(!data){ 
                showToastify("Não contém massa");
                return; 
            }
    
            Object.values(data).forEach(el => {
                if(el.listMassas && Array.isArray(el.listMassas)){
                    massaEstoque.push(...el.listMassas);
                }
            });
    
            displayMassa.innerHTML = "";
            if(massaEstoque.length === 0){
                displayMassa.innerHTML = "<p>Nenhuma massa no estoque</p>";
            }
            else{
                massaEstoque.forEach(massa => {
                    displayMassa.innerHTML += 
                    `
                        <p class="border-b-1 pl-2">${massa.massa || "Sem nome"}</p>
                        <p class="border-b-1">${massa.quantidade || "0"}</p>
                    `;
                }); 
            }
        });
    
        onValue(recheioEstoqueRef, (snapshot) => {
            const data = snapshot.val();
            const recheioEstoque = [];
    
            if(!data){ 
                showToastify("Não contém recheio");
                return; 
            }
    
            Object.values(data).forEach(el => {
                if(el.listRecheios && Array.isArray(el.listRecheios)){
                    recheioEstoque.push(...el.listRecheios);
                }
            });
    
            displayRecheio.innerHTML = "";
            if(recheioEstoque.length === 0){
                displayRecheio.innerHTML = "<p>Nenhum recheio no estoque</p>";
            }
            else{
                recheioEstoque.forEach(recheio => {
                    displayRecheio.innerHTML += 
                    `
                        <p class="border-b-1 pl-2">${recheio.recheio || "Sem nome"}</p>
                        <p class="border-b-1">${recheio.quantidade || "0"}</p>
                    `;
                });
            }
        });
    
        onValue(bebidaEstoqueRef, (snapshot) => {
            const data = snapshot.val();
            const bebidaEstoque = [];
    
            if(!data){ 
                showToastify("Não contém bebida");
                return; 
            }
    
            Object.values(data).forEach(el => {
                if(el.listBebidas && Array.isArray(el.listBebidas)){
                    bebidaEstoque.push(...el.listBebidas);
                }
            });
    
            displayBebida.innerHTML = "";
            if(bebidaEstoque.length === 0){
                displayBebida.innerHTML = "<p>Nenhuma bebida no estoque</p>";
            }
            else{
                bebidaEstoque.forEach(bebida => {
                    displayBebida.innerHTML += 
                    `
                        <p class="border-b-1 pl-2">${bebida.bebida || "Sem nome"}</p>
                        <p class="border-b-1">${bebida.quantidade || "0"}</p>
                    `;
                });
            }
        });
    
        loadCurrentEstoque(displayCurrentMassa, displayCurrentRecheio);
    
        form.classList.add("hidden");
        btnUpdateEstoque.classList.remove("hidden");
        estoque.classList.remove("hidden");
        loadingOverlay.hide();
    }, 700);
}