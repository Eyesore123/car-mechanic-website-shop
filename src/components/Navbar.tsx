'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLogout } from '../hooks/useLogout'
import stylesnav from '../app/styles/Navbar.module.css'
import Icon from '../../public/images/icon.png'
import InstaIcon from '../assets/Insta.png'
import TiktokIcon from '../assets/tiktok.png'
import { getAuth } from 'firebase/auth'

import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../redux/store/store'
import { logoutSuccess } from '@/redux/store/authSlice'

// import { useTranslation } from 'react-i18next';
// import { LanguageContext } from '../context/LanguageContext';


export default function Navbar() {

  const pathname = usePathname()
  const dispatch = useDispatch()
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)
  const router = useRouter();
  const { logout } = useLogout();
  const auth = getAuth();


  const handleLogout = () => {
    dispatch(logoutSuccess())
    logout();
    router.push('/signin')
  }

  // const { t } = useTranslation();
  // const { language, changeLanguage } = useContext(LanguageContext);

  return (
    <div className={stylesnav.navbar}>
        <div className="flex justify-center items-center gap-3 sm:gap-14 md:gap-10 lg:gap-30 p-2 mb-2 w-full">
        <div className='iconcontainer md:mr-40 md:ml-10 xl:ml-0'>
          {!auth.currentUser ? (
              <Link href="/">
                  <button className='cursor-pointer'>
                      <img src={Icon.src} alt="PNP-Power icon" className={stylesnav.icon} />
                  </button>
              </Link>
          ) : (
              <button>
                  <img src={Icon.src} alt="PNP-Power icon" className={stylesnav.icon} />
              </button>
          )}
      </div>
            <div className="flex flex-col md:flex-row justify-center items-center titlecontainer border-1 bottom border-white rounded-lg p-2">
              <div className="buttonscontainer">
              {!isAuthenticated && <Link href="/signin"><button className={stylesnav.navbutton}>Kirjaudu sisään</button></Link>}
              <Link href="/products"><button className={stylesnav.navbutton}>Kauppa</button></Link>
              <Link href="/registerinfo"><button className={stylesnav.navbutton}>Rekisteriseloste</button></Link>
              <Link href="/instructions"><button className={stylesnav.navbutton}>Tilausohjeet</button></Link>
              {user?.role === 'admin' &&
              <Link href="/admin"><button className={stylesnav.navbutton}>Admin</button></Link>}
              {isAuthenticated && <Link href="/account"><button className={stylesnav.navbutton}>Oma tili</button></Link>}
              {!isAuthenticated &&
              <a href="https://pnp-power.fi/" target="_blank"><button className={stylesnav.navbutton}>PNP-Power.fi</button></a>}
              </div>
            </div>
              <div className="flex flex-col justify-center items-center md:ml-10 md:flex-row">
                
                {(pathname === '/' || pathname === '/signin' || pathname === '/signup') && (
                  <div>
                  <button className='ml-2 mr-2'>
                  <a href="https://www.instagram.com/putkinen_/" target="_blank
                  " rel="noreferrer">
                    <img src={InstaIcon.src} alt="Instagram icon" className={stylesnav.instaicon} />
                  </a>
                  </button>

                  <button className='ml-2 mr-2'>
                  <a href="https://www.tiktok.com/@putkinen__" target="_blank
                  " rel="noreferrer">
                    <img src={TiktokIcon.src} alt="Tiktok icon" className={stylesnav.tiktokicon} />
                  </a>
                  </button>
                </div>
                )}
                {isAuthenticated &&
                <span className="text-[16px] !pt-0 !mb-0 !mt-0 !pb-0 md:text-[16px] md:mr-8 ml-0 flex flex-col justify-center text-center w-24 h-28 md:!w-52 break-words">
                  Hei {user?.displayName || user?.email}!
                </span>
                }

                {/* Show logout button if authenticated */}
                {isAuthenticated && (
                  <button onClick={handleLogout} className="border-1 border-white rounded-lg p-2 hover:bg-gray-600 hover:scale-110 hover:cursor-pointer">
                    Kirjaudu ulos
                  </button>
                )}

                {/* <button className={stylesnav.languagebutton} onClick={() => changeLanguage(language === 'fi' ? 'en' : 'fi')}>
                {language === 'fi' ? 'EN' : 'FI'} */}
              {/* </button> */}
          
            </div>

        </div>
    </div>
  )
}