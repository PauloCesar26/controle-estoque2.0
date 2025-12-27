import { auth } from "../../../../src/app.js";
import { onAuthStateChanged } from "firebase/auth";

export const checkAuth = async () => {
    return new Promise(resolve => {
        onAuthStateChanged(auth, (user) => {
            resolve(user);
        })
    });   
};