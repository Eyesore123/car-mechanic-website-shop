import { db } from '../../src/firebase/firebaseConfig';
import { collection, query, getDocs, where, updateDoc, setDoc } from 'firebase/firestore';
import crypto from 'crypto';
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import { NextApiRequest, NextApiResponse } from 'next';

dotenv.config();

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  throw new Error('SENDGRID_API_KEY environment variable is not set');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, action, templateId, recipient, testEmail } = req.body as {
    email?: string;
    action?: string;
    templateId?: string;
    recipient?: string;
    testEmail?: string;
  };

  console.log('Received request body:', req.body); // Log the request body

  if (action) {
    // Handle subscription/unsubscription
    if (!email || !action) {
      return res.status(400).json({ message: 'Email and action are required.' });
    }

    try {
      console.log('Querying for subEmail:', email); // Log the email being queried

      // Find user by subEmail
      const usersRef = collection(db, 'users');
      const queryRef = query(usersRef, where('subEmail', '==', email));
      const snapshot = await getDocs(queryRef);

      if (snapshot.empty) {
        console.log('No user found for the provided subEmail:', email); // Log if no user is found
        return res.status(404).json({ message: 'Käyttäjää ei löytynyt.' });
      }

      const userDoc = snapshot.docs[0];
      const userData = userDoc.data();
      let unsubscribeToken = userData.unsubscribeToken;

      // Assign unsubscribe token if it doesn't exist
      if (!unsubscribeToken) {
        unsubscribeToken = crypto.randomBytes(16).toString('hex');
        await setDoc(userDoc.ref, { unsubscribeToken }, { merge: true });
      }

      const unsubscribeLink = `http://localhost:3000/api/unsubscribe?token=${unsubscribeToken}`;

      if (action === 'subscribe') {
        await setDoc(userDoc.ref, { subEmail: email, subscribed: true }, { merge: true });
        res.status(200).json({ message: 'Uutiskirjeen tilaus onnistui.' });
      } else if (action === 'unsubscribe') {
        await setDoc(userDoc.ref, { subEmail: null, subscribed: false }, { merge: true });
        res.status(200).json({ message: 'Uutiskirjeen tilaus on nyt lopetettu.' });
      } else {
        return res.status(400).json({ message: 'Invalid action.' });
      }
    } catch (error) {
      console.error('Error handling newsletter subscription:', error);
      res.status(500).json({ message: 'Virhe uutiskirjeen tilauksessa.', error: error.message });
    }
  } else if (templateId && recipient) {
    // Handle sending newsletters from admin panel
    try {
      if (recipient === 'test') {
        if (!testEmail) {
          return res.status(400).json({ message: 'Test email is required for test recipient.' });
        }

        // Find user by testEmail
        const usersRef = collection(db, 'users');
        const queryRef = query(usersRef, where('subEmail', '==', testEmail));
        const snapshot = await getDocs(queryRef);

        if (snapshot.empty) {
          console.log('No user found for the provided testEmail:', testEmail); // Log if no user is found
          return res.status(404).json({ message: 'Käyttäjää ei löytynyt.' });
        }

        const userDoc = snapshot.docs[0];
        const userData = userDoc.data();
        let unsubscribeToken = userData.unsubscribeToken;

        if (!unsubscribeToken) {
          unsubscribeToken = crypto.randomBytes(16).toString('hex');
          await setDoc(userDoc.ref, { unsubscribeToken }, { merge: true });
        }

        const unsubscribeLink = `http://localhost:3000/api/unsubscribe?token=${unsubscribeToken}`;

        const msg = {
          to: testEmail,
          from: 'joni.putkinen@protonmail.com',
          subject: 'PNP-Power.fi Shop - Test Uutiskirje',
          templateId: templateId,
          dynamic_template_data: {
            unsubscribeLink,
            toggleSubscriptionLink: `http://localhost:3000/api/unsubscribe-confirmation?token=${unsubscribeToken}`,
          },
        };

        console.log('Sending test email to:', testEmail);
        console.log('Email message:', msg);

        await sgMail.send(msg);
        return res.status(200).json({ message: 'Test email sent successfully.' });
      } else if (recipient === 'subscribers') {
        // Find all subscribed users
        const usersRef = collection(db, 'users');
        const queryRef = query(usersRef, where('subscribed', '==', true));
        const snapshot = await getDocs(queryRef);

        if (snapshot.empty) {
          return res.status(404).json({ message: 'No subscribed users found.' });
        }

        const emailData = await Promise.all(snapshot.docs.map(async (doc) => {
          const userData = doc.data();
          let unsubscribeToken = userData.unsubscribeToken;

          if (!unsubscribeToken) {
            unsubscribeToken = crypto.randomBytes(16).toString('hex');
            await setDoc(doc.ref, { unsubscribeToken }, { merge: true });
          }

          return {
            email: userData.subEmail,
            unsubscribeToken,
          };
        }));

        // Send individual emails to each recipient
        const msgArray = emailData.map((data) => ({
          to: data.email,
          from: 'joni.putkinen@protonmail.com',
          subject: 'PNP-Power.fi Shop - Uutiskirje',
          templateId: templateId,
          dynamic_template_data: {
            unsubscribeLink: `http://localhost:3000/api/unsubscribe?token=${data.unsubscribeToken}`,
            toggleSubscriptionLink: `http://localhost:3000/api/unsubscribe-confirmation?token=${data.unsubscribeToken}`,
          }
        }));

        try {
          await Promise.all(msgArray.map((msg) => sgMail.send(msg)));
          res.status(200).json({ message: 'Newsletter sent successfully.' });
        } catch (error) {
          console.error('Error sending newsletter:', error);
          res.status(500).json({ message: 'Virhe uutiskirjeen lähetyksessä.', error: error.message });
        }
      }
    } catch (error) {
      console.error('Error handling newsletter sending:', error);
      res.status(500).json({ message: 'Virhe uutiskirjeen lähetyksessä.', error: error.message });
    }
  } else {
    return res.status(400).json({ message: 'Template ID and recipient are required.' });
  }
}

    // Send the email to the user. For testing purposes, this will send the newsletter as soon as the user subscribes.

      // const msg = {
      //   to: email,
      //   from: 'joni.putkinen@protonmail.com',
      //   subject: 'PNP-Power.fi Shop - Uutiskirje',
      //   templateId: 'd-f4a308bbfb324517b2fd3f456cdc4bb4', // Your template ID
      //   dynamic_template_data: {
      //     unsubscribeLink, // Include the unsubscribe link in the email
      //     subscriptionStatus: userData.subscribed ? 'Olet tilannut uutiskirjeen' : 'Et ole tilannut uutiskirjettä',
      //     toggleSubscriptionLink: `http.//localhost:3000/api/newsletter/toggle-subscription?token=${data.unsubscribeToken}`, // Optional for toggling subscription
      //   },
      // };

      // await sgMail.send(msg);