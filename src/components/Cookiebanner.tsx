import React, { useState } from 'react';
import * as Cookiebannerstyles from '../app/styles/Cookiebannerstyles.module.css';

export default function Cookiebanner() {
  // Initialize state from cookie
  const [cookiesAccepted, setCookiesAccepted] = useState(() => {
    return getCookie('cookiesAccepted') === 'true';
  });

  // Function to accept cookies
  function acceptCookies() {
    setCookiesAccepted(true);
    setCookie('cookiesAccepted', 'true', 1);  // Store in cookies
  }

  // Set cookie function
  function setCookie(name: string, value: any, days: any) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "; expires=" + date.toUTCString();
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }

  // Get cookie function
  function getCookie(name: string) {
    const nameEQ = name + "=";
    const cookiesArray = document.cookie.split(';');
    for (let i = 0; i < cookiesArray.length; i++) {
      let cookie = cookiesArray[i];
      while (cookie.charAt(0) === ' ') cookie = cookie.substring(1, cookie.length);
      if (cookie.indexOf(nameEQ) === 0) return cookie.substring(nameEQ.length, cookie.length);
    }
    return null;
  }

  return (
    <div>
      {cookiesAccepted ? null : (
        <div id="cookiebanner" className={Cookiebannerstyles.cookiediv}>
          <div className={Cookiebannerstyles.bannertext}>
            <div className={Cookiebannerstyles.bannertext}>
              <div>Tämä sivusto käyttää pakollisia evästeitä perustoimintojen mahdollistamiseksi.</div>
            </div>
            <div className={Cookiebannerstyles.cookiebtnbox}>
              <button className={Cookiebannerstyles.cookiebtn} onClick={acceptCookies}>
                Hyväksy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}