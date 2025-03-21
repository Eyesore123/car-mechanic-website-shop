import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const db = getFirestore();
        const userDoc = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setIsSubscribed(data.subscribed || false);
        }
      }
      setLoading(false);
    };

    fetchSubscriptionStatus();
  }, []);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setMessage('You need to be logged in to subscribe.');
      return;
    }

    try {
      const db = getFirestore();
      const userDoc = doc(db, 'users', user.uid);

      await setDoc(userDoc, { subEmail: email, subscribed: !isSubscribed }, { merge: true });

      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, action: isSubscribed ? 'unsubscribe' : 'subscribe' }),
      });

      const data = await response.json();
      setMessage(data.message);
      setIsSubscribed(!isSubscribed);
    } catch (error) {
      setMessage('Error subscribing to newsletter.');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="newsletter-form flex flex-col justify-center items-center">
      {!isSubscribed && <h2>Tilaa PNP-Powerin uutiskirje niin saat tiedon uusista tuotteista suoraan sähköpostiisi:</h2>}
      {isSubscribed ? (
        <>
        <p className='!text-lg'>Olet tilannut uutiskirjeen. Voit peruuttaa tilauksen alla olevalla painikkeella.</p>
        <button onClick={handleSubmit} className="submitbtn mt-6">
          Peruuta tilaus
        </button>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Kirjoita sähköpostiosoitteesi"
          />
          <button type="submit" className="submitbtn mt-6">
            Tilaa
          </button>
        </form>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default NewsletterForm;