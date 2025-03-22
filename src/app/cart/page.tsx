'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import CustomerForm from '../../components/CustomerForm';
import BusinessForm from '../../components/BusinessForm';
import CartItem from '@/components/CartItem';
import '../../app/globals.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CartPage: React.FC = () => {
    const [enterName, setEnterName] = useState<string>('');
    const [enterEmail, setEnterEmail] = useState<string>('');
    const [enterPhone, setEnterPhone] = useState<string>('');
    const [enterAddress, setEnterAddress] = useState<string>('');
    const [enterPostalCode, setEnterPostalCode] = useState<string>('');
    const [enterPostLocation, setEnterPostLocation] = useState<string>('');
    const [isBusinessCustomer, setIsBusinessCustomer] = useState<boolean>(false);
    const [businessName, setBusinessName] = useState<string>('');
    const [businessEmail, setBusinessEmail] = useState<string>('');
    const [businessPhone, setBusinessPhone] = useState<string>('');
    const [businessAddress, setBusinessAddress] = useState<string>('');
    const [businessPostalCode, setBusinessPostalCode] = useState<string>('');
    const [businessPostLocation, setBusinessPostLocation] = useState<string>('');
    const [businessId, setBusinessId] = useState<string>('');
    const [dataLoaded, setDataLoaded] = useState<boolean>(false);

    const cartItems = useSelector((state: any) => state.cart.items);
    const totalAmount = useSelector((state: any) => state.cart.totalAmount);

    const router = useRouter();

    // Load saved form data when component mounts
    useEffect(() => {
        // Use a try-catch to handle potential JSON parsing errors
        try {
            if (typeof window !== 'undefined') {
                const savedFormData = localStorage.getItem('formData');
                
                if (savedFormData) {
                    const parsedData = JSON.parse(savedFormData);
                    
                    // Set state with the parsed data
                    setEnterName(parsedData.name || '');
                    setEnterEmail(parsedData.email || '');
                    setEnterPhone(parsedData.phone || '');
                    setEnterAddress(parsedData.address || '');
                    setEnterPostalCode(parsedData.postalCode || '');
                    setEnterPostLocation(parsedData.postLocation || '');
                    setIsBusinessCustomer(parsedData.isBusinessCustomer || false);
                    setBusinessName(parsedData.businessName || '');
                    setBusinessEmail(parsedData.businessEmail || '');
                    setBusinessPhone(parsedData.businessPhone || '');
                    setBusinessAddress(parsedData.businessAddress || '');
                    setBusinessPostalCode(parsedData.businessPostalCode || '');
                    setBusinessPostLocation(parsedData.businessPostLocation || '');
                    setBusinessId(parsedData.businessId || '');
                }
                
                setDataLoaded(true);
            }
        } catch (error) {
            console.error('Error loading form data:', error);
            setDataLoaded(true);
        }
    }, []);

    // Save form data to localStorage whenever any field changes
    useEffect(() => {
        // Only save data after initial load is complete
        if (!dataLoaded) return;
        
        try {
            const formData = {
                name: enterName,
                email: enterEmail, 
                phone: enterPhone,
                address: enterAddress,
                postalCode: enterPostalCode,
                postLocation: enterPostLocation,
                isBusinessCustomer: isBusinessCustomer,
                businessName: businessName,
                businessEmail: businessEmail,
                businessPhone: businessPhone,
                businessAddress: businessAddress,
                businessPostalCode: businessPostalCode,
                businessPostLocation: businessPostLocation,
                businessId: businessId,
            };

            localStorage.setItem('formData', JSON.stringify(formData));
            console.log('Form data saved to localStorage'); // Debug log
        } catch (error) {
            console.error('Error saving form data:', error);
        }
    }, [
        dataLoaded,
        enterName, enterEmail, enterPhone, enterAddress, enterPostalCode, enterPostLocation,
        isBusinessCustomer, businessName, businessEmail, businessPhone, businessAddress,
        businessPostalCode, businessPostLocation, businessId
    ]);

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsBusinessCustomer(event.target.checked);
    };

    const placeOrder = () => {
        // Validate required fields
        if (!enterName || !enterEmail || !enterPhone || !enterAddress || !enterPostalCode || !enterPostLocation) {
        toast.error('Ole hyvä ja täytä kaikki pakolliset kentät.');
        return;
      }
        // Save the current form data before navigating
        const formData = {
            name: enterName,
            email: enterEmail, 
            phone: enterPhone,
            address: enterAddress,
            postalCode: enterPostalCode,
            postLocation: enterPostLocation,
            isBusinessCustomer: isBusinessCustomer,
            businessName: businessName,
            businessEmail: businessEmail,
            businessPhone: businessPhone,
            businessAddress: businessAddress,
            businessPostalCode: businessPostalCode,
            businessPostLocation: businessPostLocation,
            businessId: businessId,
        };

        localStorage.setItem('formData', JSON.stringify(formData));

        router.push('/confirmation');
        window.scrollTo(0, 0);
    }

    return (
        <div className='cart-page md:min-h-[500px] flex flex-col items-center justify-center '>
            <h2 className='header md:mb-10'>Ostoskori</h2>
            <div className='cart-items pl-9 md:pl-0'>
                {cartItems.length === 0 ? (
                    <p>Ostoskori on tyhjä.</p>
                ) : (
                    cartItems.map((item: any) => (
                        <CartItem key={item.id} item={item} />
                    ))
                )}
            </div>

            {cartItems.length > 0 && (
                <div className="checkout-section flex flex-col items-center justify-center">
                    <h2 className='header !mt-0 md:!mt-14 mb-15'>Tilaustiedot</h2>
                    <form>
                        <CustomerForm
                        name={enterName}
                        email={enterEmail}
                        phone={enterPhone}
                        setName={setEnterName}
                        setEmail={setEnterEmail}
                        setPhone={setEnterPhone}
                        address={enterAddress}
                        postalCode={enterPostalCode}
                        postLocation={enterPostLocation}
                        setAddress={setEnterAddress}
                        setPostalCode={setEnterPostalCode}
                        setPostLocation={setEnterPostLocation}
                        />
                    </form>
                    <div>
              <label>
              Yritysasiakas
                <input
                  type="checkbox"
                  checked={isBusinessCustomer}
                  onChange={handleCheckboxChange}
                  className='mb-8 mt-8'
                />
              </label>
            </div>

            {isBusinessCustomer && (
              <BusinessForm
                businessName={businessName}
                businessEmail={businessEmail}
                businessPhone={businessPhone}
                businessAddress={businessAddress}
                businessPostalCode={businessPostalCode}
                businessPostLocation={businessPostLocation}
                businessId={businessId}
                setBusinessName={setBusinessName}
                setBusinessEmail={setBusinessEmail}
                setBusinessPhone={setBusinessPhone}
                setBusinessAddress={setBusinessAddress}
                setBusinessPostalCode={setBusinessPostalCode}
                setBusinessPostLocation={setBusinessPostLocation}
                setBusinessId={setBusinessId}
              />
            )}

            <div className="order-summary flex flex-col justify-center items-center w-full">
                <div className="w-full">
                    <h4 className='mb-6 w-full text-center'>Tilaus yhteensä: € {totalAmount}</h4>
                </div>
                <div className="w-full">
                    <h4 className='mb-12 w-full text-center'>Siirry vielä tarkistamaan tilauksesi tiedot ennen tilausta:</h4>
                </div>
                <button type="button" className="submitbtn mb-10" onClick={placeOrder}>
                    Yhteenveto
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
