import { ref, remove } from "firebase/database";
import { showToastify } from "../../../../src/components/toastify.js";
import { loadingOverlay } from "../../../../src/components/loadingOverlay.js";
import { db } from "../../../../src/app.js";

export async function cleanDB(){
    loadingOverlay.show();

    try{
        await remove(ref(db, "massa"));
        await remove(ref(db, "recheio"));
        await remove(ref(db, "bebida"));
        await remove(ref(db, "dbCurrentRecheio"));
        await remove(ref(db, "dbCurrentMassa"));
        
        showToastify("✅ Produtos apagados do banco de dados")
        loadingOverlay.hide();
    }
    catch(error){
        showToastify(`❌ Erro ao apagar do banco de dados: ${error.message}`);
        loadingOverlay.hide();
    }
};