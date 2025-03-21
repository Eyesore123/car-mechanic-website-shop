'use client';

import '../globals.css'
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useSignup } from '../../hooks/useSignup';

import { useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const { signup, error, isPending } = useSignup();
  const router = useRouter();

  const auth = getAuth();

  useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
              router.push('/');
          }
      });

      return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      setConfirmPassword('');
      return;
    }

    // Call signup function
    const result = await signup(email, password, displayName);
    if (result) {
      toast.success('Rekisteröityminen onnistui. Tervetuloa PNP-Powerin verkkokauppaan!', {
          position: "bottom-center",
          autoClose: 8000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          className: 'custom-toast-center',
      });
  
        router.push('/products');
       // display toast for 2 seconds before redirecting
    } else {
      toast.error('Rekisteröityminen epäonnistui. Ole hyvä ja yritä uudelleen.');
    }
  };

  return (
    <form 
    // className={styles.authForm} 
    onSubmit={handleSubmit}>
      <p className='!text-[24px]'>Rekisteröidy</p>
      
      <label>
        <span>Sähköposti:</span>
        <input
          type="email"
          id="email"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          autoComplete='off'
        />
      </label>
      
      <label>
        <span>Salasana:</span>
        <input
          type="password"
          id="password"
          required
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          autoComplete='off'
        />
      </label>
      
      <label>
        <span>Vahvista salasana:</span>
        <input
          type="password"
          id="confirmPassword"
          required
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
          autoComplete='off'
        />
      </label>
      
      <label>
        <span>Käyttäjänimi:</span>
        <input
          type="text"
          id="displayName"
          required
          onChange={(e) => setDisplayName(e.target.value)}
          value={displayName}
          autoComplete='off'
        />
      </label>

      {!isPending && 
      <div className="action"><button className="gobtn mt-4 mb-4">Rekisteröidy</button></div>}
      {isPending && <button className="gobtn" disabled>Ladataan...</button>}
      
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default Signup;
