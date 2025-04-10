'use client'

import './globals.css'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { auth } from '../firebase/firebaseConfig'
import Cookiebanner from '../components/Cookiebanner'
import MarqueeComponent from '@/components/MarqueeComponent'

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push('/products');
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Tarkastetaan kirjautumistila...</p>
      </div>
    );
  }

  return (
    <div className='md:min-h-[600px] flex flex-col justify-center'>
      <MarqueeComponent />
      <h1 className='mainheader md:!mt-4 landingpageheader'>PNP-POWER Shop</h1>
        <div className='flex flex-col justify-center items-center text-center'>
          <p className='!pt-0 !pb-0 !m-4 !p-4'>Tervetuloa PNP-Powerin uuteen verkkokauppaan! Täällä voit selata ja tilata PNP-Powerin tuotteita helposti.</p>
          <p className='!m-4 !p-4'>Siirry suoraan kauppaan tai kirjaudu sisään:</p>
            
          <div className='flex flex-col md:flex-row justify-center items-center'>
          <Link href="/products">
            <button className='gobtn m-4'>Kauppaan</button>
          </Link>
          <Link href="/signin">
            <button className='gobtn m-4'>Kirjaudu sisään</button>
          </Link>
        </div>
            
          <p className='!p-4 !m-4 !md:mt-60'>Käyttäjätilin luominen on vapaaehtoista. Voit tehdä tilauksen ilman rekisteröitymistä, mutta jos haluat tarkastella aiempia tilauksiasi, voit luoda käyttäjätilin: </p>
            
              <Link href="/signup"><button className='gobtn mb-16'>Luo tili</button></Link>
            
        </div>
        <Cookiebanner />
    </div>
  );
}
