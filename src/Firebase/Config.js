// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDhEAIg5VwW3j5LS-QDRVal2b_ev0H2i18",
  authDomain: "ecorganic-project.firebaseapp.com",
  projectId: "ecorganic-project",
  storageBucket: "ecorganic-project.appspot.com",
  messagingSenderId: "51520988287",
  appId: "1:51520988287:web:4c91e922bf7ffd64df4b4a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const imgDB = getStorage(app)