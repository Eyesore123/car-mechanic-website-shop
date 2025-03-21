'use client'

import React, { useEffect, useState } from 'react';
import { getFirestore, query, where, getDocs, DocumentData, doc, deleteDoc, orderBy } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { RotatingLines } from 'react-loader-spinner'; // Import the spinner component
import { RootState } from '@/redux/store/store';
import { useSelector } from 'react-redux';
import { getAuth, onAuthStateChanged, User, deleteUser } from 'firebase/auth';
import { collection } from 'firebase/firestore';
import { Card } from '@/components/ui/card';
import { db } from '@/firebase/firebaseConfig';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import NewsletterForm from '@/components/NewsLetterForm';

const deleteUserAccount = async (userId: string) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    const confirmation = await new Promise((resolve) => {
      const toastId = toast(
        <div>
          <p>Oletko varma, että haluat poistaa tilin? Tämä toiminto on peruuttamaton!</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <button className='bg-red-500 text-white px-2 py-1 rounded mr-2 hover:cursor-pointer' onClick={() => {
              toast.dismiss(toastId);
              resolve(true);
            }}>Kyllä</button>
            <button className='bg-gray-300 text-black px-2 py-1 rounded hover:cursor-pointer' onClick={() => {
              toast.dismiss(toastId);
              resolve(false);
            }}>Ei</button>
          </div>
        </div>,
        {
          position: 'top-center',
          autoClose: false,
          closeOnClick: false,
          hideProgressBar: true,
        }
      );
    });

    if (confirmation) {
      try {
        await deleteUser(user);
        console.log('User account deleted successfully.');
        await deleteDoc(doc(db, 'users', userId));
        console.log('User document deleted successfully.');
        toast.success('Tili poistettu onnistuneesti!');
      } catch (error) {
        console.error('Error deleting user account:', error);
        toast.error('Tilin poistaminen epäonnistui.');
      }
    } else {
      toast.info('Tilin poisto peruutettu.');
    }
  }

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = '/signin';
    }
  });

};

const Account = () => {
  const [userAuth, setUserAuth] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<DocumentData[]>([]);
  const [ordersFetched, setOrdersFetched] = useState(false);
  const auth = getAuth();
  const { user } = useSelector((state: RootState) => state.auth);
  const db = getFirestore();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserAuth(user);
        fetchOrders(user.uid);
      } else {
        router.push('/signin');
      }
    });

    return () => unsubscribe();
  }, [auth, router]);

  const fetchOrders = async (uid: any) => {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('userId', '==', uid), orderBy('timestamp', 'desc')); // Order by timestamp in descending order
    const ordersSnapshot = await getDocs(q);
    const ordersData = ordersSnapshot.docs.map((doc) => doc.data());
    console.log('Orders data:', ordersData);
    setOrders(ordersData);
    setLoading(false);
    setOrdersFetched(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[1000px]">
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

  return (
    <div className="p-0 -mt-6 flex flex-col justify-center items-center min-h-[1000px]">
      <h1 className="text-2xl font-bold mb-10 header">Omat tiedot</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Hei {user?.displayName || user?.email}!</h2>
      </div>
      <NewsletterForm />
      {orders.length > 0 ? (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-10">Tässä ovat aiemmat tilauksesi uusimmasta vanhimpaan:</h3>
          <div>
            <ul>
              {orders.map((order, index) => (
                <Card key={index} className='hover:scale-100 !hover:shadow-4xl border border-gray-600 !mb-6 m-4 md:m-0'>
                  <li key={index}>
                    <div className='flex-1 flex-col md:flex-row justify-between items-start w-full'>
                      {/* Left Column: Order Details */}
                      <div className='flex-1'>
                        <h4 className="text-lg flex justify-center text-center font-medium mb-6 mt-6">Tilaus {index + 1}</h4>
                        <div className="text-lg md:w-250 m-6 justify-center">Tilauskoodi: {order.orderID}</div>
                        <div className="text-lg m-6">Tilauspäivämäärä: {order.timestamp.toDate().toLocaleDateString('fi-FI')}</div>
                        <div className="text-lg m-6 pt-6 font-medium border-t">Tilatut tuotteet:</div>
                        <ul>
                          {order.orderData.cartItems.map((item: any, itemIndex: any) => (
                            <li key={itemIndex}>
                              <div className="text-lg m-6">{item.name} x {item.quantity}</div>
                              <div className="text-lg m-6">Hinta: {item.price} €</div>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Right Column: Contact Info */}
                      <div className='flex-1 justify-center text-center text-sm leading-tight p-6'>
                        <h4 className="text-lg font-medium border-t mb-4 pt-6">Tilaukseen liitetyt yhteystiedot:</h4>
                        <p className='!p-0 !text-[18px]'>Nimi: {order.orderData.formData.name}</p>
                        <p className='!p-0 !text-[18px]'>Sähköposti: {order.orderData.formData.email}</p>
                        <p className='!p-0 !text-[18px]'>Puhelinnumero: {order.orderData.formData.phone}</p>
                        <p className='!p-0 !text-[18px]'>Osoite: {order.orderData.formData.address}</p>
                        <p className='!p-0 !text-[18px]'>Postinumero: {order.orderData.formData.postalCode}</p>
                        <p className='!p-0 !text-[18px]'>Postitoimipaikka: {order.orderData.formData.postLocation}</p>
                        {order.orderData.formData.isBusinessCustomer && (
                          <>
                            <h4 className="text-lg font-medium mt-4">Yrityksen tiedot:</h4>
                            <p className='!p-0 !text-[18px]'>Yrityksen nimi: {order.orderData.formData.businessName}</p>
                            <p className='!p-0 !text-[18px]'>Yrityksen sähköpostiosoite: {order.orderData.formData.businessEmail}</p>
                            <p className='!p-0 !text-[18px]'>Yrityksen puhelinnumero: {order.orderData.formData.businessPhone}</p>
                            <p className='!p-0 !text-[18px]'>Yrityksen osoite: {order.orderData.formData.businessAddress}</p>
                            <p className='!p-0 !text-[18px]'>Yrityksen postinumero: {order.orderData.formData.businessPostalCode}</p>
                            <p className='!p-0 !text-[18px]'>Yrityksen postitoimipaikka: {order.orderData.formData.businessPostLocation}</p>
                            <p className='!p-0 !text-[18px]'>Yrityksen y-tunnus: {order.orderData.formData.businessId}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </li>
                </Card>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        ordersFetched && (
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-10">Sinulla ei ole vielä tehtyjä tilauksia.</h3>
          </div>
        )
      )}

      {/* Option to delete user account */}
      <div className="mt-8">
        {user?.uid && (
          <button
            onClick={() => deleteUserAccount(user.uid)}
            className="bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors hover:cursor-pointer px-6 py-2 mb-18"
          >
            Poista tili
          </button>
        )}
      </div>
    </div>
  );
};

export default Account;