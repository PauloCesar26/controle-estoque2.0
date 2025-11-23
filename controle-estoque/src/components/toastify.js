import Toastify from "https://cdn.jsdelivr.net/npm/toastify-js/src/toastify-es.js";

export function showToastify(text){
    Toastify({
        text: `${text}`,
        duration: 2500,
        gravity: "bottom", 
        position: "right", 
        stopOnFocus: true, 
        style: {
            background: "rgb(0, 0, 0)",
            color: "white",
            borderRadius: "10px",
            fontWeight: "bold"
        },
    }).showToast();
}