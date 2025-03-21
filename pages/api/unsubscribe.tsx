import { db } from '../../src/firebase/firebaseConfig';
import { updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: 'Unsubscribe token is required.' });
  }

  try {
    console.log('Received unsubscribe token:', token);  // Log the token value

    // Find user by the unsubscribe token
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('unsubscribeToken', '==', token));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log('No user found for the provided token.');
      return res.status(404).json({ message: 'User not found for this token.' });
    }

    // Update subscription status
    const userDoc = snapshot.docs[0];
    await updateDoc(userDoc.ref, { subscribed: false, subEmail: null });
    // Redirect to the unsubscribe confirmation page
    res.writeHead(302, { Location: '/unsubscribe-confirmation' });
    res.end();
    // res.status(200).json({ message: 'Unsubscribed successfully.' });
  } catch (error) {
    console.error('Error unsubscribing:', error);  // Log the error for debugging
    res.status(500).json({ message: 'Error unsubscribing.' });
  }
}