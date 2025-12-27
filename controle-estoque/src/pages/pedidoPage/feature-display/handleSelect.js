import { ref, onValue } from "firebase/database";
import { db } from "../../../app.js";

export function handleSelect(){
    const dbMassa = ref(db, "dbCurrentMassa");
    const dbRecheio = ref(db, "dbCurrentRecheio");
    const selectMassa1 = document.querySelector(".name-massa1");
    const selectRecheio1 = document.querySelector(".name-recheio1");
    const selectMassa2 = document.querySelector(".name-massa2");
    const selectRecheio2 = document.querySelector(".name-recheio2");

    const queryDatabaseCurrentProducts = (
        databaseRef, 
        selectElement,
        dataKey,
        itemLabelKey
    ) => {
        onValue(databaseRef, (snapshot) => {
            const data = snapshot.val();

            selectElement.innerHTML = `<option value="">Selecione...</option>`;
            console.log(data);
            
            if(!data || !data[dataKey] || data[dataKey].length === 0){
                selectElement.innerHTML = `
                    <option value="">Selecione...</option>
                    <option disabled>Nenhum produto</option>
                `;
                return;
            }

            const items = Object.values(data[dataKey]);
            console.log(items);

            const itemsDisponiveis = items.filter(item => item.quantidade > 0);

            if(itemsDisponiveis.length === 0){
                 selectElement.innerHTML = `
                    <option value="">Selecione...</option>
                    <option disabled>Nenhum produto</option>
                `;
                return;
            }
        
            itemsDisponiveis.forEach(item => {
                const option = document.createElement("option");
                option.value = item[itemLabelKey];
                option.textContent = item[itemLabelKey];
                selectElement.appendChild(option);
            });
        });
    };

    queryDatabaseCurrentProducts(
        dbMassa,
        selectMassa1,
        "currentMassaEstoque",
        "massa"
    );

    queryDatabaseCurrentProducts(
        dbRecheio,
        selectRecheio1,
        "currentRecheioEstoque",
        "recheio"
    );

    queryDatabaseCurrentProducts(
        dbMassa,
        selectMassa2,
        "currentMassaEstoque",
        "massa"
    );

    queryDatabaseCurrentProducts(
        dbRecheio,
        selectRecheio2,
        "currentRecheioEstoque",
        "recheio"
    );
}