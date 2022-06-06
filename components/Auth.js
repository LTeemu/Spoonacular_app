import { firebase, USERS_REF } from '../firebase/Config';
import { Alert, Platform } from "react-native";

export async function register(email, password) {
    try {
        await firebase.auth().createUserWithEmailAndPassword(email, password);
        const currentUser = firebase.auth().currentUser;
        firebase.database().ref(USERS_REF+currentUser.uid).set({
            email: currentUser.email
        })
    } catch (err) {
        console.log("Registration failed. ", err.message);
        Platform.OS === 'web' ? alert("Registration failed. " + err.message) : Alert.alert("Registration failed. ", err.message);
    }
}
export async function login(email, password) {
    try {
        await firebase.auth().signInWithEmailAndPassword(email, password);
    }
    catch (err) {
        console.log("Login failed. ", err.message);
        Platform.OS === 'web' ? alert("Login failed. " + err.message) : Alert.alert("Login failed. ", err.message);
    }
}
export async function logout() {
    try {
        await firebase.auth().signOut();
    } catch (err) {
        console.log("Logout error. ", err.message);
        Platform.OS === 'web' ? alert("Logout error. " + err.message) : Alert.alert("Logout error. ", err.message);
    }
}
