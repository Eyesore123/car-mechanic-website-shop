'use client'

import React from 'react'
import '../app/globals.css'
import styles from '../app/styles/Footer.module.css'
import Icon2 from '../../public/images/icon.png'
// import Envelope from '../../src/assets/Envelope.svg'
// import Phone from '../../src/assets/Phone.svg'
import Link from 'next/link';
import { getAuth } from 'firebase/auth';
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store/store'

export default function Footer() {

  const auth = getAuth();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  return (
    <div className={styles.footercontainer}>
      {!auth.currentUser ? (
        <Link href="/" onClick={() => window.scrollTo(0, 0)}>
        <button className='cursor-pointer'>
            <img src={Icon2.src} alt="PNP-Power icon2" className={styles.icon2} />
        </button>
        </Link>
      ) : (
        <button>
            <img src={Icon2.src} alt="PNP-Power icon2" className={styles.icon2} />
        </button>
      )}

          <div className={styles.footer}>
            <div className='grid grid-cols-2 w-auto'>
              <ul className='m-4'>
                <Link href="/products">
                <li className='m-2 flex !justify-start'>
                Kauppa
                </li>
                </Link>
                <Link href="/registerinfo">
                <li className='m-2 flex !justify-start'>
                  Rekisteriseloste
                </li>
                </Link>
                <Link href="/instructions">
                <li className='m-2 flex !justify-start'>
                  Tilausohjeet
                </li>
                </Link>
              </ul>
              <ul className='m-4'>
                <Link href="/cart">
                <li className='m-2 flex !justify-start'>
                  Ostoskori
                </li>
                </Link>
                {isAuthenticated &&
                <Link href="/account">
                <li className='m-2 flex !justify-start'>
                  Oma tili
                </li>
                </Link>
                }
                <li className='m-2 flex !justify-start'>
                  <a href="https://www.pnp-power.fi" target="_blank" rel="noopener noreferrer">PNP-Power.fi</a>
                </li>
              </ul>
            </div>
          </div>
          <div className={styles.footer}>

          {/* <span>
                <li className='list-none flex !justify-start items-center gap-4 mb-4'>
                  <img src={Phone.src} alt="Phone icon" className={styles.footericon} />
                  040 841 4698
                </li>
              </span> */}

              {/* <span>
                <li className='list-none flex !justify-start items-center gap-4 mb-8'>
                  <img src={Envelope.src} alt="Envelope icon" className={styles.footericon} />
                  niko.putkinen96@gmail.com
                </li>
              </span> */}
            <span>
              <li id="copyright" className='list-none flex justify-start items-center gap-4 md:w-100'>
              © 2025 Niko Putkinen / PNP-POWER
              </li>
              </span>
              
              {/* <span className='m-2'>
              <li className='list-none flex justify-start items-center gap-4 md:w-100'>
              Kaikki oikeudet pidätetään
              </li>
            </span> */}
          </div>
    </div>
  )
}
