import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/database"
const firebaseConfig = {
    apiKey: "AIzaSyA9Wd7OPiKePCEZABSxa-H-J7rB2SiyYYc",
    authDomain: "esp32-project-trial.firebaseapp.com",
    databaseURL: "https://esp32-project-trial-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "esp32-project-trial",
    storageBucket: "esp32-project-trial.appspot.com",
    messagingSenderId: "685809132918",
    appId: "1:685809132918:web:8013291a3820e7f4cb8657",
    measurementId: "G-2G493LCRLH"
  };

firebase.initializeApp(firebaseConfig);
export default firebase;