import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import app from "./firebaseConfig";
import { addDoc, collection, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { v4 as uuidv4} from "uuid";

const storage = getStorage(app);

interface Product {
    id?: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
}
// Need to use React state to show the product info in both the product page and product list page. Also need it in admin page.


// Function to upload a product image

export const uploadProductImage = async (product: Product): Promise<string> => {
    try {
        const storageRef = ref(storage, `products/${product.name}`);
        const response = await fetch(product.imageUrl);  
        const blob = await response.blob();  
        await uploadBytes(storageRef, blob);  Storage
        const imageUrl = await getDownloadURL(storageRef);  
        return imageUrl;
    } catch (error) {
        console.error("Error uploading product image:", error);
        throw new Error("Failed to upload product image.");
    }
};

// Function to add a new product to Firestore
export const addProduct = async (product: Product): Promise<any> => {
    try {

        const productID = uuidv4();
        const formattedProduct = {
            ...product,
            price: Number(product.price),
        };

        const imageUrl = await uploadProductImage(product);
        const newProduct = {
            id: productID,
            ...formattedProduct,
            imageUrl  
        };

        // Add the new product to the Firestore "products" collection
        const productCollection = collection(db, "products");
        const newProductRef = await addDoc(productCollection, newProduct);

        console.log("Product added successfully:", newProduct);
        return newProduct;
    } catch (error) {
        console.error("Error adding product:", error);
        throw new Error("Failed to add product.");
    }
};

// Function to get all products from Firestore

export const getProducts = async (): Promise<Product[]> => {
    try {
        const productCollection = collection(db, "products");
        const querySnapshot = await getDocs(productCollection);
        const productList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        return productList;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw new Error("Failed to fetch products.");
    }
};


export const deleteProductByCustomId = async (customId: string): Promise<void> => {
    try {
        // Query Firestore for the document with the custom `id`
        const q = query(collection(db, 'products'), where('id', '==', customId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            querySnapshot.forEach(async (docSnapshot) => {
                // Get the Firestore document ID
                const firestoreDocId = docSnapshot.id;

                // Delete the document from Firestore
                await deleteDoc(doc(db, 'products', firestoreDocId));
                console.log('Product document deleted successfully from Firestore.');

                // Delete the image from Firebase Storage
                const productData = docSnapshot.data();
                const imageRef = ref(storage, `products/${productData.name}`);
                await deleteObject(imageRef);
                console.log('Product image deleted successfully from Firebase Storage.');
            });
        } else {
            throw new Error('No document found with the specified custom ID.');
        }
    } catch (error) {
        console.error('Error deleting product or image:', error);
        throw new Error('Failed to delete product.');
    }
};



