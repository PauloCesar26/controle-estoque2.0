import { updateUI } from "./feature-estoque/updateUI.js";
import { loadingOverlay } from "../../components/loadingOverlay.js";
import { db } from "../../app.js";
import { ref, push, set } from "firebase/database";
import { checkData } from "./feature-db/checkData.js";
import { cleanDB } from "./feature-db/cleanDb.js";

export function estoque(){
    const form = document.getElementById("form");
    const btnCleanDb = document.getElementById("limpar");
    const btnUpdateEstoque = document.getElementById("update-estoque");
    const btnBackEstoque = document.getElementById("voltar");
    
    const estoque = document.getElementById("estoque");
    const displayMassa = document.getElementById("exibir-massa");
    const displayRecheio = document.getElementById("exibir-recheio");
    const displayBebida = document.getElementById("exibir-bebida");
    
    const currentDate = document.getElementById("current-date");
    const date = new Date(); 
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    if(formattedDate){
        currentDate.textContent = formattedDate;
    }

    const resultMassas = document.getElementById("massas");
    const buttonAddMassa = document.getElementById("add-massa");
    let countMassa = 1;

    const resultRecheios = document.getElementById("recheios");
    const buttonAddRecheio = document.getElementById("add-recheio");
    let countRecheio = 1;

    const resultBebidas = document.getElementById("bebidas");
    const buttonAddBebida = document.getElementById("add-bebida");
    let countBebida = 1;

    buttonAddMassa.addEventListener("click", () => {
        const idMassa = `massa${countMassa}`;

        const massasAdd = 
        `
            <div id="${idMassa}" class="massa space-y-5 pb-4 mb-4 border-b-1 border-zinc-100/20">
                <div class="flex flex-col">
                    <span class="flex flex-col gap-1">
                        <label for="massas">Massa:</label>
                        <input type="text" placeholder="Digite o sabor da massa" class="name-massas max-w-50 bg-zinc-100 text-black p-1 rounded-[7px]" />
                    </span>
                    <p id="erro-massa" class="text-red-900"></p>
                </div>

                <div class="flex flex-col">
                    <span class="flex flex-col gap-1">
                        <label for="qtd-massa">Quantidade:</label>
                        <input type="number" placeholder="Digite a quantidade" class="qtd-massa max-w-50 bg-zinc-100 rounded-[7px] p-1 text-black">
                    </span>
                    <p id="erro-qtd-massa" class="text-red-900"></p>
                </div>

                <button onClick="removeMassa(${countMassa})"  type="button" class="pt-2 pb-2 pl-3 pr-3 rounded-[10px] bg-[#ff5b5b] ease-in-out text-black mr-5 flex items-center gap-2 cursor-pointer transition duration-[0.3s]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                </button>
            </div>
        `;

        resultMassas.insertAdjacentHTML("beforeend", massasAdd);

        countMassa++;
    });
    window.removeMassa = (id) => {
        const element = document.getElementById(`massa${id}`);
        
        if(element){
            element.remove();
        }
    };

    buttonAddRecheio.addEventListener("click", () => {
        const idRecheio = `recheio${countRecheio}`;

        const recheioAdd = 
        `
            <div id="${idRecheio}" class="recheio space-y-5 pb-4 mb-4 border-b-1 border-zinc-100/20">
                <div class="flex flex-col">
                    <span class="flex flex-col gap-1">
                        <label for="recheio">Recheio:</label>
                        <input type="text" placeholder="Digite o sabor do recheio" class="name-recheio max-w-50 bg-zinc-100 text-black  p-1 rounded-[7px]" />
                    </span>
                    <p id="erro-recheio" class="text-red-900"></p>
                </div>

                <div class="flex flex-col">
                    <span class="flex flex-col gap-1">
                        <label for="qtd-recheio">Quantidade:</label>
                        <input type="number" placeholder="Digite a quantidade" class="qtd-recheio max-w-50 bg-zinc-100  p-1 rounded-[7px] text-black">
                    </span>
                    <p id="erro-qtd-recheio" class="text-red-900"></p>
                </div>

                <button onClick="removeRecheio(${countRecheio})"  type="button" class="pt-2 pb-2 pl-3 pr-3 rounded-[10px] bg-[#ff5b5b] ease-in-out text-black mr-5 flex items-center gap-2 cursor-pointer transition duration-[0.3s]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                </button>
            </div>
        `;

        resultRecheios.insertAdjacentHTML("beforeend", recheioAdd);

        countRecheio++;
    });
    window.removeRecheio = (id) => {
        const element = document.getElementById(`recheio${id}`);
        
        if(element){
            element.remove();
        }
    };

    buttonAddBebida.addEventListener("click", () => {
        const idBebida = `bebida${countBebida}`;

        const bebidaAdd = 
        `
        <div id="${idBebida}" class="bebida space-y-5 pb-4 mb-4 border-b-1 border-zinc-100/20">
            <div class="flex flex-col">
                <span class="flex flex-col gap-1">
                    <label for="bebida">Bebida:</label>
                    <input type="text" placeholder="Digite o nome da bebida" class="name-bebida max-w-50 bg-zinc-100 text-black  p-1 rounded-[7px]" />
                </span>
                <p id="erro-bebida" class="text-red-900"></p>
            </div>

            <div class="flex flex-col">
                <span class="flex flex-col gap-1">
                    <label for="qtd-bebida">Quantidade:</label>
                    <input type="number" placeholder="Digite a quantidade" class="qtd-bebida max-w-50 bg-zinc-100  p-1 rounded-[7px] text-black">
                </span>
                <p id="erro-qtd-bebida" class="text-red-900"></p>
            </div>

            <button onClick="removeBebida(${countBebida})"  type="button" class="pt-2 pb-2 pl-3 pr-3 rounded-[10px] bg-[#ff5b5b] ease-in-out text-black mr-5 flex items-center gap-2 cursor-pointer transition duration-[0.3s]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
            </button>
        </div>
        `;

        resultBebidas.insertAdjacentHTML("beforeend", bebidaAdd);

        countBebida++;
    });
    window.removeBebida = (id) => {
        const element = document.getElementById(`bebida${id}`);
        
        if(element){
            element.remove();
        }
    };

    if(btnUpdateEstoque){
        btnUpdateEstoque.addEventListener("click", () => {
            loadingOverlay.show();

            setTimeout(() => {
                form.classList.remove("hidden");
                btnUpdateEstoque.classList.add("hidden");
                loadingOverlay.hide();
            }, 800);
        });
    }

    btnCleanDb.addEventListener("click", async () => {
        await cleanDB();

        displayMassa.innerHTML = "";
        displayRecheio.innerHTML = "";
        displayBebida.innerHTML = "";
        form.classList.remove("hidden");
        btnUpdateEstoque.classList.add("hidden");
    });

    btnBackEstoque.addEventListener("click", () => {
        form.classList.add("hidden");
    });

    if(form){
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const saveMassas = document.querySelectorAll(".massa");
            const saveRecheio = document.querySelectorAll(".recheio");
            const saveBebida = document.querySelectorAll(".bebida");
            const listMassas = [];
            const listRecheios = [];
            const listBebidas = [];

            saveMassas.forEach((div) => {
                const massa = div.querySelector(".name-massas").value;
                const quantidade = div.querySelector(".qtd-massa").value;

                listMassas.push({massa, quantidade});
            });
            const dbMassa = ref(db, "massa");
            const newRefMassa = push(dbMassa);
            set(newRefMassa, { listMassas });

            saveRecheio.forEach((div) => {
                const recheio = div.querySelector(".name-recheio").value;
                const quantidade = div.querySelector(".qtd-recheio").value;

                listRecheios.push({recheio, quantidade});
            });
            const dbRecheio = ref(db, "recheio");
            const newRefRecheio = push(dbRecheio);
            set(newRefRecheio, { listRecheios });

            saveBebida.forEach((div) => {
                const bebida = div.querySelector(".name-bebida").value;
                const quantidade = div.querySelector(".qtd-bebida").value;

                listBebidas.push({bebida, quantidade});
            });
            const dbBebida = ref(db, "bebida");
            const newRefBebida = push(dbBebida);
            set(newRefBebida, { listBebidas });

            estoque.classList.remove("hidden");
            updateUI();
            form.reset();
        });
    }
    checkData();
};