import { ref, remove } from "firebase/database";
import { showToastify } from "../../../../src/components/toastify.js";
import { loadingOverlay } from "../../../../src/components/loadingOverlay.js";
import { db } from "../../../../src/app.js";

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