//Firebase
import * as firebase from "firebase/app";
import "firebase/auth";
import '@firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCe8O-6vlOXw8sDFdb8BxAwXRVgyOiMd8E",
  authDomain: "shopping-list-storage.firebaseapp.com",
  databaseURL: "https://shopping-list-storage.firebaseio.com",
  projectId: "shopping-list-storage",
  storageBucket: "shopping-list-storage.appspot.com",
  messagingSenderId: "857207138584",
  appId: "1:857207138584:web:612ff3880152b1b80c966d",
  measurementId: "G-1G9BDQ58SG"
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();

export const auth = firebase.auth();