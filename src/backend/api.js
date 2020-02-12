import * as firebase from "firebase/app";
import { db } from './firebaseInit';

export const getStoredListsApi = async (userId) => (
    await db.collection("lists").where("owner", "==", userId).get()
        .then(data => {
            let listsObject = {};
            data.forEach((doc) => {
                listsObject[doc.id] = doc.data()
            });
            return listsObject
        }
    )
)

export const getProductsApi = async () => (
    await db.collection("products").orderBy("productName").get()
        .then((data) => {

            let productsArray = [];
            data.forEach((doc) => {
                productsArray.push({
                    productId: doc.id,
                    ...doc.data()
                })
            });

            let productsObject = {};
            data.forEach((doc) => {
                productsObject[doc.id] = doc.data()
            });

            return productsObject
        }
    )
)

export const loginUserApi = (email, password) => (
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then((data) => data)
)

export const isUserNameExistApi = (userName) => (
    db.collection("users").where("userName", "==", userName).limit(1).get()
    .then(querySnapshot => {
            if (querySnapshot.docs.length > 0){
                return true
            } else {
                return false
            }
        })
)

export const isEmailTakenApi = (email) => (
    firebase.auth().fetchSignInMethodsForEmail(email)
        .then(data => {
            if (data.length > 0) {
                return true
            }
        })
)

export const addUserApi = () => (
    db.collection("users").add({
        userId: "123123",
        userName: "albatros",
        storedLists: []
    })
)

export const signupUserApi = (email, password, userName) => (   
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((data) => {
            return Promise.all([
                data.user.sendEmailVerification()
                    .then(() => {
                    }),
                db.collection("users").doc(data.user.uid).set({
                    userName: userName,
                    storedLists: []
                }).then(() => {
                    firebase.auth().signOut()
                })
            ]).then(() => true)
        })    
)

export const getUserDataApi = async (userId) => (
    await db.doc(`/users/${userId}`).get()
        .then(doc => doc.data())
)

export const addListApi = async (list) => (
    await db.collection("lists").add({
        ...list
    })
    .then(docRef => {
        console.log("Document written with ID: ", docRef.id);
        return docRef
    })
    .catch(error => {
        console.error("Error adding document: ", error);
    })
)

export const deleteListApi = async (listId) => (
    await db.doc(`/lists/${listId}`).delete()
        .then(() => console.log("List deleted successfully"))
        .catch(error => {
            console.log(error.code);
            console.log(error.message);
        })
)

// add products
export const addProduct = (product) => {
    db.collection("products").add({
        productName: product.productName,
        type: product.type,
        location: product.location
    })
    .then(docRef => {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(error => {
        console.error("Error adding document: ", error);
    });
}

export const firebaseProductsDispatch = (products) => {
    products.map(product => {
        return addProduct(product)
    })
}

export const firebaseProductsDownload = async () => (
    await db.collection("products").get()
    .then((data) => {

        let productsArray = [];
        data.forEach((doc) => {
            productsArray.push({
                productId: doc.id,
                ...doc.data()
            })
        });
        return productsArray
    })
)

export const firebaseProductsExport = async (productsArray) => {
    var batch = db.batch();

    productsArray.map(({productId, ...props}) => (
        batch.set(db.collection("productsOther").doc(productId), {...props})
    ))
    
    await batch.commit()
    .then(() => (
        console.log("Export executed")
    ));
}

export const firebaseProductsExportNew = async (productsArray) => {
    var batch = db.batch();

    productsArray.map((props) => (
        batch.set(db.collection("productsOther").doc(), {...props})
    ))
    
    await batch.commit()
    .then(() => (
        console.log("Export executed")
    ));
}