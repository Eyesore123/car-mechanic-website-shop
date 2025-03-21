// AdminAddProductForm.tsx

'use client'

import React, { useState } from 'react'
import { addProduct } from '../firebase/storage';
import { v4 as uuidv4 } from 'uuid';

const AdminAddProductForm: React.FC = () => {
    const [product, setProduct] = useState({
        id: uuidv4(),
        name: '',
        description: '',
        price: 0,
        imageUrl: '',
        availability: '',
        category: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Make sure you are saving the product to Firestore
            await addProduct(product);
            console.log('Product added successfully!');
            scrollTo({ top: 0 });
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    return (
        <div>
            <div className='w-130 flex flex-col mt-10 p-6 bg-grey-900 border border-gray-600 ml-6 shadow-md rounded-lg mb-20'>
                <h3 className='font-bold text-center w-full'>Lisää uusi tuote tietokantaan</h3>
                <form onSubmit={handleSubmit} className='flex flex-col items-center'>
                    <input
                        type='text'
                        placeholder="tuotteen nimi"
                        value={product.name}
                        onChange={(e) => setProduct({ ...product, name: e.target.value })}
                        className='w-2/3 p-3 m-4 border dorder-gray-300 rounded-md mb-4 focus:outline-none focus:border-blue-500'
                    />

                    <textarea
                        placeholder="tuotekuvaus"
                        value={product.description}
                        onChange={(e) => setProduct({ ...product, description: e.target.value })}
                        className='w-80 h-60 p-3 m-4 border border-gray-600 rounded-md mb-4 focus:outline-none focus:border-blue-500 items-center text-center'
                    />

                    <label id="price">Kirjoita hinta (jos hinnassa desimaaleja, käytä pilkkua):</label>
                    <input
                        type="number"
                        placeholder="tuotteen hinta"
                        value={product.price.toString()}
                        onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
                        className='w-2/3 p-3 m-4 border dorder-gray-300 rounded-md mb-4 focus:outline-none focus:border-blue-500'
                    />

                    {/* Availability */}
                    <label id="availability">Saatavuus:</label>
                    <input
                        type="text"
                        placeholder="Saatavuus (esim. 10 tai 'tilauksesta')"
                        value={product.availability}
                        onChange={(e) => setProduct({ ...product, availability: e.target.value })}
                        className='w-2/3 p-3 m-4 border dorder-gray-300 rounded-md mb-4 focus:outline-none focus:border-blue-500'
                    />

                    {/* Category */}
                    <label id="category">Tuotekategoria:</label>
                    <input
                        type="text"
                        placeholder="tuotteen kategoria"
                        value={product.category}
                        onChange={(e) => setProduct({ ...product, category: e.target.value })}
                        className='w-2/3 p-3 m-4 border dorder-gray-300 rounded-md mb-4 focus:outline-none focus:border-blue-500'
                    />

                    {/* Image */}
                    <label id="image">Klikkaa ja valitse kuva:</label>
                    <input
                        type='file'
                        placeholder="kuva"
                        onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                                setProduct({ ...product, imageUrl: URL.createObjectURL(e.target.files[0]) });
                            }
                        }}
                        className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                    <br />
                    <button type="submit" className='submitbtn'>Lisää tuote</button>
                </form>
            </div>
        </div>
    );
};

export default AdminAddProductForm;
