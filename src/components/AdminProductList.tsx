'use client'

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import '../app/globals.css';
import liststyles from '../app/styles/Productlist.module.css';
import { deleteProductByCustomId } from "../firebase/storage";
import { RotatingLines } from "react-loader-spinner";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Product {
    id?: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    availability: string;
}

interface AdminProductListProps {
    onSelectProduct: (productId: string) => void;
}

const AdminProductList: React.FC<AdminProductListProps> = ({ onSelectProduct }) => {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            const productCollection = collection(db, 'products');
            const productSnapshot = await getDocs(productCollection);
            const productList = productSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Product[];
            setProducts(productList);
            setLoading(false); // stop the loading animation
        };

        fetchProducts();
    }, []);

    const confirmDelete = (customId: string) => {
        toast(
            <div>
                <p>Haluatko varmasti poistaa valitsemasi tuotteen?</p>
                <div className="flex justify-center gap-3 mt-4">
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
                        onClick={() => handleDelete(customId)}
                    >
                        Kyllä
                    </button>
                    <button
                        className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 transition-all"
                        onClick={() => toast.dismiss()}
                    >
                        Ei
                    </button>
                </div>
            </div>,
            {
                position: "top-right",
                autoClose: false,
                closeOnClick: false,
                hideProgressBar: true,
            }
        );
    };

    const handleDelete = async (customId: string) => {
        try {
            toast.dismiss();
            await deleteProductByCustomId(customId);
            setProducts(products.filter((product) => product.id !== customId));
            console.log('Product deleted successfully:', customId);
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <p className="text-xl font-bold text-center !mb-16">Ladataan tuotteita...</p>
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
        );
    }

    const handleProductClick = (productId: string) => {
        setSelectedProductId(productId);
        onSelectProduct(productId);
    };

    return (
        <div className="mt-10 p-6">
            {products.length === 0 ? (
                <div className="text-center mt-40">
                    <p className={liststyles.para}>Ei tuotteita tuotelistalla.</p>
                </div>
            ) : (
                <>
                    <h1 className="text-xl font-bold text-center mb-6">Tuotelista:</h1>
                    <br /><br />
                    <p className="!-mt-10 !text-[14px] leading-5.5">Ohjeet: klikkaa tuotteen nimeä tuotelistalta niin pääset muokkaamaan sitä. Jos haluat että tuote näkyy harmaana kaupassa ja kuvauksessa lukee "Ei saatavilla", niin kirjoita saatavuuden kohdalle "0". Jos haluat, että saatavuuden kohdalla lukee erilainen viesti, esimerkiksi 7-14 päivää, niin kirjoita "7-14 päivää".</p>
                    <ul className="space-y-4">
                        {products.map((product) => (
                            <li className="p-4 border rounded-lg shadow-sm hover:shadow-lg transition-all cursor-pointer" key={product.id}>
                                <h2
                                    className="text-lg font-semibold text-center mb-2"
                                    onClick={() => handleProductClick(product.id || product.name)}
                                >
                                    {product.name}
                                </h2>
                                <p className="!m-0 !p-4 !text-sm">{product.description}</p>
                                <div className="text-sm !p-6 text-gray-600">Hinta: €{product.price}</div>
                                <img src={product.imageUrl} alt={product.name} className="mt-2 w-24 h-24 object-cover mx-auto" />
                                <button
                                    className="m-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all hover:cursor-pointer"
                                    onClick={() => product.id && confirmDelete(product.id)}
                                >
                                    Poista tuote
                                </button>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default AdminProductList;
