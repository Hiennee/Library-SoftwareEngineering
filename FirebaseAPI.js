import express from 'express';
import cors from 'cors'
import { initializeApp } from "firebase/app";
import { Firestore, deleteDoc } from 'firebase/firestore/lite';'firebase/firestore';
import {getFirestore, collection, getDocs, getDoc, doc, setDoc, addDoc, query, where, updateDoc} from 'firebase/firestore/lite';
//----------------------------------------------------------------------------------------------------------//
const firebaseConfig = 
{
    apiKey: "AIzaSyA1xJ0gWOtqL1HsKbjFaMRAsivyWwHmhJ0",
    authDomain: "library-softwareengineering.firebaseapp.com",
    databaseURL: "https://library-softwareengineering-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "library-softwareengineering",
    storageBucket: "library-softwareengineering.appspot.com",
    messagingSenderId: "347751562680",
    appId: "1:347751562680:web:e517d4c5b1a25e9873634d",
    measurementId: "G-10ZHBN8ET4"
};
//----------------------------------------------------------------------------------------------------------//
var server = express();
server.use(cors());
server.use(express.json());

var fb = initializeApp(firebaseConfig);
var db = getFirestore(fb);
var bookCollection = collection(db, "Books");
//----------------------------------------------------------------------------------------------------------//
server.get("/book", async (req, res) =>
{
    var result = await getDocs(bookCollection);
    result.forEach((document) =>
    {
        console.log(document.data());
    })
})

server.get("/book/id/:id", async (req, res) =>
{
    var result = await getDoc(doc(bookCollection, req.params.id));
    if (result.exists())
    {
        res.status(234).send(result.data());
        console.log(result.data());
        return;
    }
    res.status(567).send(`Cannot find book with ID: ${req.params.id} in the collection Books, check again`);
    console.log(`Cannot find book with ID: ${req.params.id} in the collection Books, check again`);
})

server.get("/book/name/:name", async (req, res) =>
{
    var result = await getDocs(query(bookCollection, where("BookName", ">=", req.params.name)));
    result.forEach((document) => 
    {
        console.log("--");
        console.log(document.data());
        //res.send(data);
    })
    
})

server.post("/post", async (req, res) =>
{
    try
    {
        await setDoc(doc(bookCollection, req.body.BookID), 
        {
            BookName: req.body.BookName,
            Author: req.body.Author,
            Publisher: req.body.Publisher
        })
        .then((docRef) => 
        {
            console.log(`Added Book: ${req.body.BookName} to the database`);
            res.status(789).send("OK");
        })
    }
    catch (err)
    {
        console.log(err);
        res.status(567).send("Key fields are unspecified, or wrong format, hỏi Hiền đi");
    }
})

server.put("/update/:id", async (req, res) =>
{
    try
    {
        await updateDoc(doc(bookCollection, req.params.id), 
        {
            BookName: req.body.BookName,
            Author: req.body.Author,
            Publisher: req.body.Publisher
        })
        .then(() =>
        {
            console.log(`Updated BookID: ${req.params.id} to name: ${req.body.BookName}`);
            res.status(456).send(`Updated BookID: ${req.params.id} to name: ${req.body.BookName}`);
        })
    }
    catch(err)
    {
        console.log(err);
        res.status(567).send(err);
    }
})

server.delete("/delete/:id", async (req, res) =>
{
    try
    {
        deleteDoc(doc(bookCollection, req.params.id));
        console.log(`Deleted book with ID: ${req.params.id}!`);
        res.status(234).send(`Deleted book with ID: ${req.params.id}!`);
    }
    catch (err)
    {
        console.log(err);
        res.status(567).send(err);
    }
})

server.listen(8080, () =>
{
    console.log("Server is online");
})