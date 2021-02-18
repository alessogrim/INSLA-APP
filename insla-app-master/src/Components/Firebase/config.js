import Firebase from "firebase";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyDBr5rfjngxoDhAqUK0Wr66IN9oir8bFtk",
  authDomain: "insla-51024.firebaseapp.com",
  databaseURL: "https://insla-51024.firebaseio.com",
  projectId: "insla-51024",
  storageBucket: "insla-51024.appspot.com",
  messagingSenderId: "51422794425",
  appId: "1:51422794425:web:e29deecb06cbd59dd88168",
  measurementId: "G-XDQWKW6V3D"
};
let app = Firebase.initializeApp(config);
export const db = app.database();
export const firebase = app;
export const fs = app.firestore();
