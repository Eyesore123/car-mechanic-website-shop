'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import '../globals.css';
import StoreProductList from '@/components/StoreProductList';
import SideCart from '../../components/Sidecart';
import { RootState } from '@/redux/store/store';

export default function Shop() {

  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const isInitialMount = useRef(true);

useEffect(() => {
  if (isInitialMount.current) {
    isInitialMount.current = false;
    setIsCartOpen(false);
    return;
  }

  const cartOpenState = localStorage.getItem('cartOpenState');
  if (cartOpenState === 'true') {

    setIsCartOpen(false);
  }
}, []);

useEffect(() => {

  if (cartItems.length > 0 && !isInitialMount.current) {
    setIsCartOpen(true);
  }
}, [cartItems]);

const toggleCart = () => {
  setIsCartOpen((prevState) => {
    const newState = !prevState;
    localStorage.setItem('cartOpenState', newState.toString());
    return newState;
  });
};

const closeCart = () => {
  setIsCartOpen(false);
  localStorage.setItem('cartOpenState', 'false');
};

  return (
    <div className='header justify-center items-center text-center m-auto'>
      <div className='mainheader !mt-0 !pt-0 mb-20 lg:mb-20'>
        Kauppa
      </div>
      <div className='flex justify-center items-center text-center ml-10 mr-10'>
        <StoreProductList />
      </div>

      {/* Add a button to toggle the cart */}
      <button onClick={toggleCart} className='fixed bottom-15 md:bottom-60 right-5 bg-blue-500 text-white text-xl px-4 py-2 rounded-lg hover:cursor-pointer hover:scale-105 transform transition-transform duration-100 ease-in-out z-10'>
        {isCartOpen ? 'Sulje ostoskori' : 'Avaa ostoskori'}
      </button>

            {/* Background overlay */}
            {isCartOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 z-10"
          onClick={closeCart} // Close the cart when clicking outside
        />
      )}

      {/* SideCart component */}
      {isCartOpen && (
        <div
        className="fixed inset-0 bg-opacity-50 z-10"
        onClick={closeCart} // Close the cart when clicking outside
      />
    )}
      
      {/* Conditionally render the SideCart based on its visibility */}
      {isCartOpen && <SideCart closeCart={closeCart} />}
    </div>
  );
}

