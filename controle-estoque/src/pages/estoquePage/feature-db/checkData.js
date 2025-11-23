import { ref, get } from "firebase/database";
import { showToastify } from "../../../components/toastify.js";
import { updateUI } from "../feature-estoque/updateUI.js";
import { db } from "../../../app.js";

export async function checkData(){
    const massaRef = ref(db, "massa");
    const recheioRef = ref(db, "recheio");
    const bebidaRef = ref(db, "bebida");

    try{
        const [massaSnap, recheioSnap, bebidaSnap] = await Promise.all([
            get(massaRef),
            get(recheioRef),
            get(bebidaRef)
        ]);

        const hasData = massaSnap.exists() || recheioSnap.exists() || bebidaSnap.exists();

        if(hasData){
            updateUI();
        } 
        else{
            showToastify("Não contém produto no banco de dados");
        }
    } 
    catch(error){
        showToastify(`Erro ao buscar produtos no banco de dados: ${error}`);
    }
}

