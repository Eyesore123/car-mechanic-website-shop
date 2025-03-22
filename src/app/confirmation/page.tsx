'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { useSelector, useDispatch } from 'react-redux';
import CartItem from '@/components/CartItem';
import { CreateOrder } from '../../firebase/createOrder';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { updateOrderId } from '@/redux/store/actions/updateOrder';
import { clearCart } from '@/redux/cart/cartSlice';
import { RotatingLines } from 'react-loader-spinner';

// Testing
// import { sendOrderConfirmation } from '../../../functions/src/index';

const auth = getAuth();

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
  image?: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  postLocation: string;
  isBusinessCustomer: boolean;
  businessName?: string;
  businessEmail?: string;
  businessPhone?: string;
  businessAddress?: string;
  businessPostalCode?: string;
  businessPostLocation?: string;
  businessId?: string;
}

interface OrderData {
  cartItems: CartItem[];
  formData: FormData;
  totalAmount: number;
}

interface ConfirmationPageProps {
  orderData: OrderData;
}

const ConfirmationPage: React.FC<ConfirmationPageProps> = ({ orderData }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<any>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false); // State for tracking redirect
  const [uid, setUid] = useState<string | null>(null);
  const [isUidLoaded, setIsUidLoaded] = useState(false);
  const dispatch = useDispatch();

  // Cart items directly from Redux store
  const cartItems = useSelector((state: any) => state.cart.items);
  const totalAmount = useSelector((state: any) => state.cart.totalAmount);

  useEffect(() => {
    // Retrieve form data
    const savedFormData = localStorage.getItem('formData');
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }

    // Get user ID from Firebase Auth
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUid(uid);
        setIsUidLoaded(true);
      } else {
        console.log('No user signed in');
      }
    });
  }, []);

  const goBack = () => {
    router.push('/cart');
  };

  const sendOrder = async () => {
    if (!isUidLoaded) {
      console.log('UID is not loaded yet');
      return;
    }

    console.log('UID:', uid);
    const orderData = {
      cartItems,
      totalAmount,
      formData,
    };

    // image disabled, use this on deployment to serve the image from public folder: <img src="/icon.png">
    // Add this after "text-align: center" for the image:
    // <img src="http://localhost:3000/images/icon.png" alt="PNP Logo" style="width: 150px; height: auto; margin-bottom: 20px;" />

    setLoading(true);
    try {
      if (uid !== null) {
        const orderID = await CreateOrder(uid, orderData, 'ei toimitettu');
        dispatch(updateOrderId(orderID));

      // Send order confirmation email with SendGrid

      const emailData = {
        email: formData.email,
        subject: 'Tilausvahvistus PNP-Powerin verkkokaupasta',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <div style="text-align: center;">
              
            </div>
            <h1 style="color: black;">Tilausvahvistus</h1>
            <p>Hei ${formData.name},</p>
            <p>Olemme vastaanottaneet tilauksesi ja ryhdymme käsittelemään sitä mahdollisimman pian.</p>
            <h2 style="color: black;">Tilauksen tiedot</h2>
            <p><strong>Tilauksen koodi:</strong> ${orderID}</p>
            <p><strong>Tilauspäivämäärä:</strong> ${new Date().toLocaleDateString('fi-FI')}</p>
            <h3 style="color: black;">Tilattavat tuotteet:</h3>
            <ul>
              ${cartItems.map((item: any) => `
                <li>
                  <strong>${item.name}</strong> - ${item.quantity} x ${item.price} € = ${item.totalPrice} €
                </li>
              `).join('')}
            </ul>
            <p><strong>Tilauksen kokonaissumma:</strong> ${totalAmount} €</p>
            <h3 style="color: black;">Yhteystiedot:</h3>
            <p><strong>Nimi:</strong> ${formData.name}</p>
            <p><strong>Sähköposti:</strong> ${formData.email}</p>
            <p><strong>Puhelinnumero:</strong> ${formData.phone}</p>
            <p><strong>Osoite:</strong> ${formData.address}</p>
            <p><strong>Postinumero:</strong> ${formData.postalCode}</p>
            <p><strong>Postitoimipaikka:</strong> ${formData.postLocation}</p>
            ${formData.isBusinessCustomer ? `
              <h3 style="color: black;">Yrityksen tiedot:</h3>
              <p><strong>Yrityksen nimi:</strong> ${formData.businessName}</p>
              <p><strong>Yrityksen sähköpostiosoite:</strong> ${formData.businessEmail}</p>
              <p><strong>Yrityksen puhelinnumero:</strong> ${formData.businessPhone}</p>
              <p><strong>Yrityksen osoite:</strong> ${formData.businessAddress}</p>
              <p><strong>Yrityksen postinumero:</strong> ${formData.businessPostalCode}</p>
              <p><strong>Yrityksen y-tunnus:</strong> ${formData.businessId}</p>
            ` : ''}
            <p>Kiitos tilauksestasi!</p>
            <p>Ystävällisin terveisin,<br />Niko / PNP-Power</p>
            <footer style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="font-size: 12px; color: #888;">PNP-Power</p>
              <p style="font-size: 12px; color: #888;">Osoite: Kankaisentie 127, 58900 Rantasalmi</p>
              <p style="font-size: 12px; color: #888;">Suomi / Finland</p>
              <p style="font-size: 12px; color: #888;">Puhelin: 040 841 4698</p>
              <p style="font-size: 12px; color: #888;">Sähköposti: niko.putkinen96@gmail.com</p>
            </footer>
          </div>
        `,
        adminEmail: 'joni.a.putkinen@gmail.com',
        adminSubject: 'Uusi tilaus vastaanotettu',
        adminHtml: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h1 style="color: black;">Uusi tilaus vastaanotettu</h1>
            <p>Uusi tilaus on vastaanotettu. Tässä ovat tilauksen tiedot:</p>
            <h2 style="color: black;">Tilauksen tiedot</h2>
            <p><strong>Tilauksen koodi:</strong> ${orderID}</p>
            <p><strong>Tilauspäivämäärä:</strong> ${new Date().toLocaleDateString('fi-FI')}</p>
            <h3 style="color: black;">Tilattavat tuotteet:</h3>
            <ul>
              ${cartItems.map((item: any) => `
                <li>
                  <strong>${item.name}</strong> - ${item.quantity} x ${item.price} € = ${item.totalPrice} €
                </li>
              `).join('')}
            </ul>
            <p><strong>Tilauksen kokonaissumma:</strong> ${totalAmount} €</p>
            <h3 style="color: black;">Yhteystiedot:</h3>
            <p><strong>Nimi:</strong> ${formData.name}</p>
            <p><strong>Sähköposti:</strong> ${formData.email}</p>
            <p><strong>Puhelinnumero:</strong> ${formData.phone}</p>
            <p><strong>Osoite:</strong> ${formData.address}</p>
            <p><strong>Postinumero:</strong> ${formData.postalCode}</p>
            <p><strong>Postitoimipaikka:</strong> ${formData.postLocation}</p>
            ${formData.isBusinessCustomer ? `
              <h3 style="color: black;">Yrityksen tiedot:</h3>
              <p><strong>Yrityksen nimi:</strong> ${formData.businessName}</p>
              <p><strong>Yrityksen sähköpostiosoite:</strong> ${formData.businessEmail}</p>
              <p><strong>Yrityksen puhelinnumero:</strong> ${formData.businessPhone}</p>
              <p><strong>Yrityksen osoite:</strong> ${formData.businessAddress}</p>
              <p><strong>Yrityksen postinumero:</strong> ${formData.businessPostalCode}</p>
              <p><strong>Yrityksen postitoimipaikka:</strong> ${formData.businessPostLocation}</p>
              <p><strong>Yrityksen y-tunnus:</strong> ${formData.businessId}</p>
            ` : ''}
          </div>
        `,
      };

      await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      console.log('Email sent!');

      // Email ends here
        
        // Set redirecting state before clearing cart
        setIsRedirecting(true);
        
        // Clear cart and localStorage
        dispatch(clearCart());
        localStorage.removeItem('formData');

        // For testing:
        // const testEvent: any = {
        //   data: () => ({ formData: { email: 'joni.putkinen@protonmail.com' } }),
        //   params: { orderId: 'test-order-id' },
        // };
        
        // sendOrderConfirmation(testEvent);  

        // Testing ends
        
        // Keep loading state active during redirect
        // Use setTimeout to ensure the redirect happens after state updates
        setTimeout(() => {
          router.push('/orderreceived');
        }, 100);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      setLoading(false);
      setIsRedirecting(false);
    }
  };

  const orderTotalAmount = cartItems.reduce((total: any, item: any) => total + item.totalPrice, 0);

  // Show loading state during both processing and redirecting
  const isProcessing = loading || isRedirecting;

  return (
    <div className='min-h-[1000px]'>
      <h1 className='mainheader mb-20'>Tilauksen tiedot</h1>
     
      {isProcessing ? (
        <>
          <div className='text-xl font-bold text-center mb-6 mt-20 min-h-[200px]'>
            {isRedirecting ? 'Ohjataan eteenpäin...' : 'Käsitellään tilausta...'}
          </div>
          <div className="flex justify-center items-center mt-20">
            <RotatingLines
              width="80"
              height="80"
              color= "black"
              ariaLabel="loading"
              strokeWidth="4"
              animationDuration="0.75"
              visible={true}
            />
          </div>
        </>
      ) : formData && (
        <>
          <Card className='hover:scale-100 w-250 justify-self-center border border-gray-600 items-center'>
            <div className="header mb-6 flex flex-col justify-center items-center">
              Tilattavat tuotteet:
            </div>
            {/* Cart Items Section */}
            {cartItems.length > 0 ? (
              cartItems.map((item: CartItem) => (
                <div key={item.id} className="w-95 mb-4 md:w-200 p-4 border rounded-lg shadow-lg flex flex-row justify-center items-center">
                  <div className="scale-85 md:scale-100 flex flex-row justify-evenly md:gap-20 items-center">
                    {/* Left: Image */}
                    <div className="flex p-2 items-center">
                      {item.image && <img src={item.image} alt={item.name} className="w-16 h-16 mr-4" />}
                    </div>
               
                    {/* Middle: Name and Quantity/Price */}
                    <div className="flex flex-col p-2 items-center">
                      <div className="font-semibold text-center md:min-w-[220px]">{item.name}</div>
                      <div className="text-gray-500">{item.quantity} x {item.price} €</div>
                    </div>
               
                    {/* Right: Total Price */}
                    <div className="text-right">
                      <div className="font-semibold">Yhteensä: {item.totalPrice} €</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No items in your cart.</p>
            )}

            {/* Display total amount below the cart items */}
            <div className="mt-4 mb-6 text-right">
              <div className="font-semibold text-lg">
                Tilauksen kokonaissumma: {orderTotalAmount} €
              </div>
            </div>

            <div className="header mb-6 !mt-4 flex flex-col justify-center items-center">
              Yhteystiedot:
            </div>
            <div className="space-y-4">
              <p className="!text-gray-500 !p-0 !m-2">Nimi: {formData.name}</p>
              <p className="!text-gray-500 !p-0 !m-2">Sähköposti: {formData.email}</p>
              <p className="!text-gray-500 !p-0 !m-2">Puhelinnumero: {formData.phone}</p>
              <p className="!text-gray-500 !p-0 !m-2">Osoite: {formData.address}</p>
              <p className="!text-gray-500 !p-0 !m-2">Postinumero: {formData.postalCode}</p>
              <p className="!text-gray-500 !p-0 !m-2">Postitoimipaikka: {formData.postLocation}</p>
              <p className="!text-gray-500 !p-0 !m-2 !mb-10">Yritysasiakas: {formData.isBusinessCustomer ? 'Kyllä' : 'Ei'}</p>

              {formData.isBusinessCustomer && (
                <div className="space-y-4">
                  <p className="!text-gray-500 !p-0 !m-2 !mt-10">Yrityksen nimi: {formData.businessName}</p>
                  <p className="!text-gray-500 !p-0 !m-2">Yrityksen sähköpostiosoite: {formData.businessEmail}</p>
                  <p className="!text-gray-500 !p-0 !m-2">Yrtiyksen puhelinnumero: {formData.businessPhone}</p>
                  <p className="!text-gray-500 !p-0 !m-2">Yrityksen osoite: {formData.businessAddress}</p>
                  <p className="!text-gray-500 !p-0 !m-2">Yrityksen postinumero: {formData.businessPostalCode}</p>
                  <p className="!text-gray-500 !p-0 !m-2">Yrityksen postitoimipaikka: {formData.businessCity}</p>
                  <p className="!text-gray-500 !p-0 !m-2">Yrityksen y-tunnus: {formData.businessId}</p>
                </div>
              )}
            </div>
          </Card>

          <div className="mt-18 mb-10 flex justify-center space-x-4">
            <button
              onClick={goBack}
              className="bg-gray-500 text-white gobtn rounded-lg hover:bg-gray-600 transition-colors"
            >
              Muuta tietoja
            </button>
            <button
              onClick={sendOrder}
              className="submitbtn text-whiterounded-lg hover:bg-blue-600 transition-colors"
            >
              Lähetä tilaus
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ConfirmationPage;
