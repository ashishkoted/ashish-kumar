import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyBxY7ggGNQ-d8HQTQbmIDs0CZPgu7RFCtc",
    authDomain: "ashish-kumar-3ea11.firebaseapp.com",
    projectId: "ashish-kumar-3ea11",
    storageBucket: "ashish-kumar-3ea11.firebasestorage.app",
    messagingSenderId: "749856465284",
    appId: "1:749856465284:web:52ac5fa556c7ff73007dd1",
    measurementId: "G-V9RCLW8E4B",
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)

export default app