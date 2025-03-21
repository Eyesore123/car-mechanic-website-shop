'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { addItem } from '../redux/cart/cartSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RotatingLines } from 'react-loader-spinner';
import { notFound } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  availability: string;
}

const ProductPage: React.FC = () => {
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const id = useParams()?.id ?? '';
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  // Additional state for tracking image loading
  const [imageLoading, setImageLoading] = useState(true);

  // State for modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check if product is out of stock
  const isOutOfStock = currentProduct?.availability === "0";

  const handleAddToCart = () => {
    if (currentProduct) {
      // Prevent adding to cart if out of stock
      if (isOutOfStock) {
        toast.error("Tuote ei ole saatavilla!");
        return;
      }
      
      const item = {
        id: currentProduct.id,
        name: currentProduct.name,
        price: currentProduct.price,
        quantity,
        image: currentProduct.imageUrl,
        totalPrice: currentProduct.price * quantity,
        availability: currentProduct.availability,
      };
      dispatch(addItem(item));
      toast.success("Tuotteesi on lisätty ostoskoriin!");
    }
  };

  useEffect(() => {
    const fetchProductById = async () => {
      console.log('Fetching product by ID:', id);
      setLoading(true);

      try {
        const productsCollection = collection(db, 'products');
        const q = query(productsCollection, where('id', '==', id));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0].data();
          setCurrentProduct(docData as Product);
        } else {
          notFound();
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        return notFound();
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductById();
    }
  }, [id]);

  if (loading) {
    return (
      <>
        <div className="text-center header">Ladataan tuotteen tietoja...</div>
        <div className="flex justify-center min-h-[1000px]">
          <RotatingLines
            width="140"
            height="140"
            color="#4fa94d"
            ariaLabel="loading"
            strokeWidth="4"
            animationDuration="0.75"
            visible={true}
            className="mb-20"
          />
        </div>
      </>
    );
  }

  if (error) {
    return <div className="text-center">{error}</div>;
  }

  if (!currentProduct) {
    return notFound();
  }

  return (
    <>
      <div className={`!min-h-[400px] md:min-h-[1000px] ${isOutOfStock ? 'opacity-70' : ''}`}>
        <h1 className="product-name header text-center md:!mb-10">{currentProduct.name}</h1>
        <p className="product-description text-center !max-w-[1200px] leading-loose mt-10 md:mt-0 !pb-0 md:!mb-10 !pl-6 !pr-6">{currentProduct.description}</p>
        <div className="flex justify-center md:max-h-[500px] w-auto">
          {/* Show image loader while the image is loading */}
          {imageLoading && (
            <div className="flex items-center justify-center w-[800px] !mt-40 mb-20 !h-800px md:h-auto">
              <RotatingLines
                width="70"
                height="70"
                color="#4fa94d"
                ariaLabel="loading"
                strokeWidth="4"
                animationDuration="0.75"
                visible={true}
              />
            </div>
          )}
          <img
            src={currentProduct.imageUrl}
            alt={currentProduct.name}
            className={`m-10 !w-84 md:!w-auto product-image rounded p-0 md:mt-30 hover:cursor-pointer md:!h-[400px] md:shadow-xl md:mb-40 self-center ${imageLoading ? 'hidden' : ''} ${isOutOfStock ? 'grayscale' : ''}`}
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
            onClick={() => setIsModalOpen(true)}
          />
        </div>
        <p className="product-price !mt-0 !pb-0 !pt-0 text-center">Hinta: € {currentProduct.price}</p>
        
        {/* availability information */}
        <p className={`text-center text-xl !mt-6 md:!mt-18 !p-0 !mb-6 md:!mb-10 ${isOutOfStock ? 'text-red-500' : 'text-green-600'}`}>
          Saatavuus: {isOutOfStock ? 'Ei saatavilla' : currentProduct.availability}
        </p>
        
        {/* Quantity selector - only show if product is in stock */}
        {!isOutOfStock && (
          <div className="flex justify-center items-center gap-4 mb-6">
            <label htmlFor="quantity" className="text-lg !m-0">Määrä:</label>
            <input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="!w-20 !md:w-38 !h-10 !m-0 border border-gray-300 rounded"
            />
          </div>
        )}
        <div className="flex justify-center gap-6 mb-10 mt-10">
          <button className="gobtn" onClick={() => router.back()}>
            Takaisin
          </button>
          <button 
            className={`submitbtn ${isOutOfStock ? 'bg-gray-400 cursor-not-allowed' : ''}`} 
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? 'Loppunut' : 'Lisää koriin'}
          </button>
        </div>
      </div>

      {/* Modal for enlarged image */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="relative">
            <button
              className="absolute top-2 right-2 text-white text-4xl hover:cursor-pointer"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>
            <img
              src={currentProduct.imageUrl}
              alt={currentProduct.name}
              className="max-w-full max-h-full"
              onClick={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProductPage;