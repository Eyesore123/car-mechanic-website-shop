'use client';

import React, { useState, useEffect } from 'react';
import { logOut } from '../../firebase/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector, useStore } from 'react-redux';

const OrderReceivedPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const store = useStore();
  
  // Debug: Log the entire Redux state
  useEffect(() => {
    console.log('Current Redux State:', store.getState());
  }, [store]);
  
  // Access the order ID directly from state.orderId
  const orderIdFromRedux = useSelector((state: any) => state.orderId);
  const [displayOrderId, setDisplayOrderId] = useState<string | { orderId: string }>('');
  
  useEffect(() => {
    console.log('Order ID from Redux:', orderIdFromRedux);
    
    // First try to get order ID from Redux
    if (orderIdFromRedux) {
      setDisplayOrderId(orderIdFromRedux);
      return;
    }
    
    // Then try URL parameters as fallback
    const orderIdFromUrl = searchParams?.get('orderId');
    if (orderIdFromUrl) {
      setDisplayOrderId(orderIdFromUrl);
    }
  }, [orderIdFromRedux, searchParams]);

  const goToMyAccount = () => {
    router.push('/account');
  };

  const handleSignOut = async () => {
    try {
      await logOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="flex justify-center items-center flex-col mt-20 min-h-[700px]">
      <h1 className="text-3xl font-bold text-green-600 mb-6">Tilauksesi on vastaanotettu!</h1>
      <p className="text-xl mb-6">Kiitos tilauksestasi! Lähetimme tilausvahvistuksen sähköpostiisi.</p>
      
      <p className="text-lg mb-6">
      Tilauksesi koodi: <strong>{typeof displayOrderId === 'object' ? displayOrderId.orderId : 'Ei saatavilla'}</strong>
      </p>

      <div className="mt-8 space-x-4">
        <button
          onClick={goToMyAccount}
          className="gobtn text-white rounded-lg hover:bg-blue-600 transition-colors px-6 py-2"
        >
          Mene omiin tietoihin
        </button>
        <button
          onClick={handleSignOut}
          className="gobtn text-white rounded-lg hover:bg-red-600 transition-colors px-6 py-2"
        >
          Kirjaudu ulos
        </button>
      </div>
    </div>
  );
};

export default OrderReceivedPage;
