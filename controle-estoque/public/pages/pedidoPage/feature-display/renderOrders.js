import { ref, remove, update } from "firebase/database";
import { loadingOverlay } from "../../../../src/components/loadingOverlay.js";
import { db } from "../../../../src/app.js";

export const renderOrders = (snapshot) => {
    const order = document.getElementById("exibir-order");
    loadingOverlay.show();

    setTimeout(() => {
        order.innerHTML = "";

        snapshot.forEach((childSnapshot) => {
            const item = childSnapshot.val();
            const itemId = childSnapshot.key;
    
            if(!item.name || !item.massa1) return;
    
            const div = document.createElement("div");
            div.classList.add("bg-[#3e1a1a]", "mt-2", "mb-2", "ml-1", "mr-1", "pl-2", "pr-2", "pt-1", "pb-1", "border-b-1", "border-zinc-400", "flex", "flex-col", "rounded-[10px]");
    
            if(item.status === true){
                div.classList.add("done");
            }
    
            const divButton = document.createElement("div");
            divButton.classList.add("w-full", "flex", "items-end", "justify-end", "gap-3", "mb-1", "mt-2");
    
            const span = document.createElement("span");
            span.innerHTML = `
                <p class="border-b-1 border-[#f4c170]/80">Nome: ${item.name}</p>
                <p>Massa 1: ${item.massa1}</p>
                <p>Recheio 1: ${item.recheio1}</p>
                <p>Massa 2: ${item.massa2}</p>
                <p>Recheio 2: ${item.recheio2}</p>
            `;
            
            const buttonCheck = document.createElement("button");
            buttonCheck.classList.add(
                "bg-[#f4a236]",
                "pt-1",
                "pb-1",
                "sm:pl-3",
                "sm:pr-3",
                "max-sm:pl-2",
                "max-sm:pr-2",
                "sm:h-10",
                "max-sm:h-8",
                "rounded-[10px]",
                "ease-in-out",
                "text-black",
                "flex",
                "items-center",
                "cursor-pointer",
                "transition",
                "duration-[0.3s]"
            );
            buttonCheck.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-icon lucide-check"><path d="M20 6 9 17l-5-5"/></svg>';
            
            const buttonDelete = document.createElement("button");
            buttonDelete.classList.add(
                "bg-[#ff5b5b]",
                "pt-1",
                "pb-1",
                "sm:pl-3",
                "sm:pr-3",
                "max-sm:pl-2",
                "max-sm:pr-2",
                "sm:h-10",
                "max-sm:h-8",
                "rounded-[10px]",
                "ease-in-out",
                "text-black",
                "flex",
                "items-center",
                "cursor-pointer",
                "transition",
                "duration-[0.3s]"
            );
            buttonDelete.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>';
            
            buttonCheck.addEventListener("click", () => {
                const isDone = div.classList.toggle("done");
                const orderRef = ref(db, `orders/${itemId}`);
                update(orderRef, { status: isDone });
            });
            buttonDelete.addEventListener("click", () => {
                const orderRef = ref(db, `orders/${itemId}`);
                remove(orderRef);
            });
    
            div.appendChild(span);
            divButton.appendChild(buttonCheck);
            divButton.appendChild(buttonDelete);
            div.appendChild(divButton);
            order.appendChild(div);
        });
    
        loadingOverlay.hide();
    }, 900);
};