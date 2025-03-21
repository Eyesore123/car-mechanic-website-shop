import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import  app from "./firebaseConfig";

const db = getFirestore(app);

export const getProducts = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const products = querySnapshot.docs.map((doc) => doc.data());
        return products;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
};

export const addProduct = async (product: any) => {
    try {
        await addDoc(collection(db, "products"), product);
    } catch (error) {
        console.error("Error adding product:", error);
    }
};