import { ref, remove } from "firebase/database";
import { showToastify } from "../../../components/toastify.js";
import { loadingOverlay } from "../../../components/loadingOverlay.js";
import { db } from "../../../app.js";

export async function cleanOrderDb(){
    const order = document.getElementById("exibir-order");
    
    const dbRef = ref(db, "orders");
    remove(dbRef)

    loadingOverlay.show();
    try{
        showToastify("✅ Todos os pedidos apagados");
        order.innerHTML = "";
    }
    catch(error){
        showToastify(`❌ Erro ao apagar os pedidos: ${error.message}`);
    }
    finally{
        loadingOverlay.hide();
    }
}