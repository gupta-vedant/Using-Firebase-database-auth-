import { initializeApp } from 'firebase/app'
import { getAuth } from "firebase/auth";
import {
    getFirestore , collection , onSnapshot,
    addDoc, deleteDoc, doc, 
    query, where, orderBy, serverTimestamp, getDoc,
    updateDoc, getDocs

} from 'firebase/firestore'
import {
    createUserWithEmailAndPassword,
    signOut , signInWithEmailAndPassword
} from 'firebase/auth'
const firebaseConfig = {
    apiKey: "AIzaSyDn_9-YmP3fB-AycVPj7WheZnev3pfU0_0",
    authDomain: "fir-9-dojo-f3c70.firebaseapp.com",
    projectId: "fir-9-dojo-f3c70",
    storageBucket: "fir-9-dojo-f3c70.appspot.com",
    messagingSenderId: "299656659892",
    appId: "1:299656659892:web:1f8f0def3c7e156a9168e1",
    measurementId: "G-7WH9NFPTCN"
}

initializeApp(firebaseConfig)

//init services
const db = getFirestore()
const auth = getAuth()

//collection ref
const colRef = collection(db, 'books')
//queries
const q = query(colRef, where("author", "==","patrick rothfuss"), orderBy('createdAt' ))

//get collection data
getDocs(colRef)
   .then((snapshot) => {
    let books=[]
     snapshot.docs.forEach((doc) => {
        books.push({...doc.data(), id: doc.id})
     })
    console.log(books)
   })
   .catch(err => {
    console.log(err.message)
   })
//real time colection
onSnapshot(q,(snapshot) => {
    let books = []
    snapshot.docs.forEach((doc) => {
        books.push({ ...doc.data(), id: doc.id})
    })
    console.log(books)
})

//onSnapshot(colRef, (Snapshot) => {
  //  let books=[]
    //Snapshot.docs.forEach((doc) => {
      // books.push({...doc.data(), id: doc.id})
    //})
    //console.log(books)

//})
   
//adding documents 
const addBookForm = document.querySelector('.add')
addBookForm.addEventListener('submit',(e) => {
    e.preventDefault()

    addDoc(colRef, {
        title: addBookForm.title.value,
        author: addBookForm.author.value,
        createdAt: serverTimestamp()
    })
    .then(() => {
        addBookForm.reset()
    })

})


//deleting documents
const deleteBookForm = document.querySelector('.delete')
deleteBookForm.addEventListener('submit', (e) => {
    e.preventDefault()


    const docRef = doc(db, 'books', deleteBookForm.id.value)

    deleteDoc(docRef)
      .then(() => {
        deleteBookForm.reset()
      })



})
//get a single Document
const docRef = doc(db, 'books', '0OmyPMCCiaHP0Twv0gOM')

getDoc(docRef)
.then((doc) => {
    console.log(doc.data())
})

onSnapshot(docRef, (doc) => {
    console.log(doc.data(), doc.id)
})

//updating a document
const updateForm = document.querySelector('.update')
updateForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const docRef = doc(db, 'books', updateForm.id.value)

    updateDoc(docRef, {
        title: 'updated title'
})
.then(() => {
    updateForm.reset()
})
})

//signup form

const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit', (e) => {
    e.preventDefault()

const email= signupForm.email.value
const password= signupForm.password.value

createUserWithEmailAndPassword(auth, email, password)
.then((cred) => {
    console.log('user created:', cred.user)
    signupForm.reset()
})
.catch((err) => {
    console.log(err.message)
})
})

//logging in aand out
const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click',() => {
    signOut(auth)
    .then(() => {
        console.log('the user signed out')

    })
    .catch((err) => {
        console.log(err.message)
    })
})

const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = loginForm.email.value
    const password = loginForm.password.value

    signInWithEmailAndPassword(auth, email, password)
    .then((cred) => {
        console.log('user logged in:', cred.user)
    })
    .catch((err) => {
        console.log(err.message)
    }) 
})