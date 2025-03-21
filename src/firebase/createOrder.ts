import { db } from './firebaseConfig';
import { v4 as uuidv4 } from 'uuid';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

export const CreateOrder = async (userId: string, orderData: { [key: string]: any }, sendStatus: string) => {
    const orderID = uuidv4();

    // Check for undefined or empty orderData
    if (!orderData || Object.keys(orderData).length === 0) {
        throw new Error('Order data is invalid or missing.');
    }

    try {
        const ordersRef = collection(db, 'orders');
        await addDoc(ordersRef, {
            userId: userId,
            orderID: orderID,
            orderData: orderData,
            timestamp: serverTimestamp(),
            delivery: 'käsiteltävänä',
            sendStatus: 'ei toimitettu',
        });
        
        return orderID;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};
