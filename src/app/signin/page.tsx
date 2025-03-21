'use client'

import '../globals.css';
import { useState, FormEvent } from 'react';
import { useLogin } from '../../hooks/useLogin';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { useRouter } from 'next/navigation';
// import styles from './Login.module.css';

const Login = () => {

  const auth = getAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isPending } = useLogin();
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const result = await login(email, password);
    if (result.success) {
      router.push('/products');
    } else {
      console.error('Login failed:', error);
    }

  };

  const handleResetSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setResetError(null);
    setResetSuccess(false);

    if (!resetEmail || !resetEmail.includes('@')) {
      setResetError('Please enter a valid email address.');
      return;
    }

    try {
      if (auth.currentUser) {
        await sendPasswordResetEmail(auth, resetEmail);
        setResetSuccess(true);
        setResetEmail('');
      } else {
        setResetError('No user is currently signed in.');
      }
    } catch (error: any) {
      setResetError(`Error: ${error.message}`);
    }
  }

  return (
    <div className='md:min-h-[1000px]'>
      {!showResetForm ? (
        <form
        //  className={styles.authForm} 
         onSubmit={handleSubmit}>
          <p className='!text-[24px]'>Kirjaudu sisään</p>
          <label>
            <span className='mr-4'>Sähköposti:</span>
            <input
              type="email"
              id='email'
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              autoComplete='on'
            />
          </label>
          <label>
            <span className='mr-4'>Salasana:</span>
            <input
              type="password"
              id='password'
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              autoComplete='on'
            />
          </label>

          {!isPending && <div className='actions'><button className="gobtn">Kirjaudu sisään</button></div>}
          {isPending && <button className="gobtn" disabled>Ladataan...</button>}
          {error && <div className="error">{error}</div>}
        </form>
      ) : (
        <form 
        className='min-h-[500px]' 
        onSubmit={handleResetSubmit}>
          <p>Salasana unohtunut? Ei hätää! Syötä sähköpostiosoitteesi alla olevaan kenttään. Saat sähköpostiisi viestin, jonka avulla voit asettaa salasanasi uudelleen.</p>
          <label>
            <span>Sähköpostiosoite:</span>
            <input
              type="email"
              id='resetEmail'
              required
              onChange={(e) => setResetEmail(e.target.value)}
              value={resetEmail}
              autoComplete='off'
            />
          </label>
          <button className="gobtn">Lähetä viesti</button>

          {resetError && <div className="error">{resetError}</div>}
          {resetSuccess && (
            <div className="success">Sähköpostin lähettäminen onnistui!</div>
          )}
        </form>
      )}

      <div className='textbox'>
        <p className='!text-[24px]'>Ei vielä käyttäjätiliä?</p>
        <a href="/signup">
        <button className="gobtn">
          Rekisteröidy
        </button></a>
        <p className='!text-[24px]'>Unohditko salasanasi?</p>
        <button
          className="gobtn mb-6"
          type="button"
          onClick={() => {
            setShowResetForm(!showResetForm),
            scrollTo({
              top: 0,
              behavior: 'smooth',
            })
          }}
        >
          Aseta salasana uudelleen
        </button>
      </div>
    </div>
  );
};

export default Login;
