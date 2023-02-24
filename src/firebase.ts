import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDbt1yritPzn69hrVzNq1NZ486MHq8Lu0E",
  authDomain: "blog-app-60059.firebaseapp.com",
  projectId: "blog-app-60059",
  storageBucket: "blog-app-60059.appspot.com",
  messagingSenderId: "1013642344870",
  appId: "1:1013642344870:web:34c75118e563aeca483767"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const blogsCollection = collection(db, "blogs");
export const profilesCollection = collection(db, "profiles");
export const storage = getStorage(app);