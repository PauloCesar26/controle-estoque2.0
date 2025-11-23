import { ref, onValue } from "firebase/database";
import { renderOrders } from "../pedidoPage/feature-display/renderOrders.js";
import { db } from "../../app.js";

export function ordersPanel(){
    onValue(ref(db, "orders"), (snapshot) => {
        renderOrders(snapshot);
    });
}