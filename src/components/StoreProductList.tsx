'use client'

import React from 'react'
import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import '../app/globals.css';
import { RotatingLines } from 'react-loader-spinner';

import { ProductCard } from './ProductCard';

interface Product {
    key: string;
    id?: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    availability: string;
  }

const StoreProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch products from Firestore

    useEffect(() => {
        const productsRef = collection(db, 'products');
        const unsubscribe = onSnapshot(productsRef, (snapshot) => {
            const products = snapshot.docs.map(
              (doc) => ({ id: doc.id, ...doc.data() } as Product)
            );
            setProducts(products);
            setLoading(false);
          });
      
          return unsubscribe;
        }, []);

        if (loading) {
            return <div>Ladataan tuotteita...
              <div className="flex justify-center items-center min-h-[400px]">
                      <RotatingLines
                        width="80"
                        height="80"
                        color="#4fa94d"
                        ariaLabel="loading"
                        strokeWidth="4"
                        animationDuration="0.75"
                        visible={true}
                      />
                    </div>
            </div>;
          }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xxl:grid-cols-4 gap-15 md:gap-40 xl:gap-10 justify-items-center mb-10'>
      {products.map((product) => (
      <ProductCard
        key={product.id || ''}
        id={product.id || ''}
        name={product.name}
        description={product.description}
        price={product.price}
        imageUrl={product.imageUrl}
        availability={product.availability || ''}
       />

      ))}
    </div>
  )
}

export default StoreProductList;
