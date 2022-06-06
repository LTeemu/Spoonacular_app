import firebase from 'firebase/compat/app';
import "firebase/compat/auth";

const firebaseConfig = ({
    
        apiKey: "AIzaSyDEGajFgz21d_2ckQ8x3HlJmZKpHy6V0sQ",
        authDomain: "spoonacular-app-71c4b.firebaseapp.com",
        projectId: "spoonacular-app-71c4b",
        storageBucket: "spoonacular-app-71c4b.appspot.com",
        messagingSenderId: "714295654993",
        appId: "1:714295654993:web:42f52971ddf5672a6fd670",
        databaseURL: "https://spoonacular-app-71c4b-default-rtdb.europe-west1.firebasedatabase.app/",
      
});
if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig)
}

export { firebase };
export const USERS_REF = '/users/'; 
export const NOTES_REF = '/notes/'
