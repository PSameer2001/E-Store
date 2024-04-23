import { initializeApp } from "firebase/app";
import getStorage from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AuthDomain,
  projectId: process.env.ProjectId,
  storageBucket: process.env.StorageBucket,
  messagingSenderId: process.env.MessagingSenderId,
  appId: process.env.AppId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const imageDB = getStorage(app);