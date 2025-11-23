import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "firebase/auth";
import { render } from "../../../app.js";
import { auth } from "../../../app.js";
import { showToastify } from "../../../components/toastify.js";

function validationEmail(email){
    const regexEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    return regexEmail.test(email);
}

export const loginEmailAndPassword = async (
    email,
    password
) => {
    console.log(email.value);
    console.log(password.value);

    const loginEmail = email.value;
    const loginPassword = password.value;
    const checkEmail = validationEmail(loginEmail);

    try{
        if(checkEmail === true && loginPassword.length > 0){
            const userInfo = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
            const user = userInfo.user;
            
            console.log("Login success");
            console.log(`Email: ${user.email}`);
    
            console.log(`Welcome to System Jojoca Doces ${user.email}`);
            history.pushState({}, "", "/Home");
            render("/Home");
        }
        else{
            if(checkEmail === false){
                showToastify("Invalid email");    
                return;
            }
            if(loginPassword.length === 0){
                showToastify("Invalid password");
                return;
            }
        }
    }
    catch(error){
        console.log(error);
        showToastify("Login failed");
        history.pushState({}, "", "/");
        render("/");
    }
}

export const monitorAuthState = async () => {
    onAuthStateChanged(auth, user => {
        if(user){
            console.log(`User logged: ${user.email}`);
        }
        else{
            console.log("You're not logged in");
        }
    })
};

export const logout = async () => {
    await signOut(auth);
    history.pushState({}, "", "/");
    render("/");
};