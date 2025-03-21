import React, { useState, useEffect } from 'react';
import { db } from '@/firebase/firebaseConfig';
import { collection, getDocs, getDoc, updateDoc, doc, query, orderBy, where } from 'firebase/firestore';
import { RotatingLines } from 'react-loader-spinner';
import * as stylesadmin from '../app/styles/AdminOrderList.module.css';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface CartItem {
  id: string;
  image: string;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

interface FormData {
  address: string;
  email: string;
  name: string;
  phone: string;
  postalCode: string;
  totalAmount: number;
  orderID: string;
  timestamp: any;
}

interface Order {
  id: string;
  customerName: string;
  orderDate: string;
  cartItems: CartItem[] | undefined;
  formData: FormData | null;
  totalAmount: number;
  delivery: string;  // Delivery status,
  sendStatus: string; // Send status, 
  comments?: string[]; // Optional comments field
}

const AdminOrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [comments, setComments] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef, orderBy('timestamp', 'desc')); // Order by timestamp in descending order
        const ordersSnapshot = await getDocs(q);
        const orders = ordersSnapshot.docs.map((doc) => {
          const data = doc.data();
          const formData = data.orderData?.formData || {};
          const timestamp = data.timestamp.toDate();
          const totalAmount = data.orderData?.totalAmount || 0;
          const delivery = data.delivery || 'käsiteltävänä';
          const sendStatus = data.sendStatus || 'ei toimitettu';
          const comments = data.comments || [];
          return {
            id: data.orderID,
            customerName: formData.name || 'No Name',
            cartItems: data.orderData?.cartItems || [],
            formData: formData || null,
            totalAmount: totalAmount,
            orderDate: timestamp.toLocaleString('fi-FI') || null,
            delivery: delivery,
            sendStatus: sendStatus,
            comments: comments,
          };
        });
        setOrders(orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);

  // Comments function

  const handleCommentChange = (orderId: string, value: string) => {
    setComments(prevComments => ({ ...prevComments, [orderId]: value }));
  };
  
  const saveComment = async (orderId: string) => {
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, where('orderID', '==', orderId));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const docId = querySnapshot.docs[0].id;
        const orderRef = doc(db, 'orders', docId);
  
        // Fetch the existing comments from Firestore
        const orderSnapshot = await getDoc(orderRef);
        const existingComments = orderSnapshot.data()?.comments || [];
  
        // Append the new comment to the existing comments array
        const newComment = comments[orderId]?.trim();
        if (newComment) {
          const updatedComments = [...existingComments, newComment];
  
          // Update Firestore with the new comments array
          await updateDoc(orderRef, {
            comments: updatedComments,
          });
  
          // Clear the comment textarea after saving
          setComments(prevComments => ({ ...prevComments, [orderId]: '' }));
  
          // Update the local state to reflect the new comment
          setOrders(prevOrders => 
            prevOrders.map(o => 
              o.id === orderId 
                ? { ...o, comments: updatedComments } 
                : o
            )
          );
  
          toast.success('Kommentti tallennettu!');
        } else {
          toast.error('Kommentti ei voi olla tyhjä!');
        }
      } else {
        toast.error('Tilausta ei löytynyt!');
      }
    } catch (error) {
      console.error('Error saving comment:', error);
      toast.error('Virhe kommentin tallentamisessa!');
    }
  };

  // Function to define the "Send" status between "ei toimitettu" and "toimitettu"

  const toggleSendStatus = async (orderId: string) => {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('orderID', '==', orderId));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length > 0) {
      const docRef = querySnapshot.docs[0].ref;
      const currentOrder = querySnapshot.docs[0].data();
      await updateDoc(docRef, {
        sendStatus: currentOrder.sendStatus === 'toimitettu' ? 'ei toimitettu' : 'toimitettu',
      });
  
      // Fetch the latest data from the database
      const updatedQuerySnapshot = await getDocs(q);
      const updatedOrder = updatedQuerySnapshot.docs[0].data();
      setOrders(prevOrders => 
        prevOrders.map(o => 
          o.id === orderId 
            ? { ...o, sendStatus: updatedOrder.sendStatus } 
            : o
        )
      );
    }
  };

  // Function to show confirmation toast and handle order status update
  const markOrderAsDelivered = async (orderId: string) => {
    // Show confirmation toast
    const confirmation = await new Promise((resolve) => {
      const toastId = toast(
        <div>
          <p>Oletko varma, että haluat merkitä tilauksen käsitellyksi?</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
            <button 
              className='bg-green-500 text-white px-2 py-1 rounded mr-2 hover:cursor-pointer' 
              onClick={() => {
                toast.dismiss(toastId);
                resolve(true);
              }}
            >
              Kyllä
            </button>
            <button 
              className='bg-gray-300 text-black px-2 py-1 rounded hover:cursor-pointer' 
              onClick={() => {
                toast.dismiss(toastId);
                resolve(false);
              }}
            >
              Ei
            </button>
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
        // Query for the document with matching orderID
        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef, where('orderID', '==', orderId));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          // Get the first matching document
          const docId = querySnapshot.docs[0].id;
          const orderRef = doc(db, 'orders', docId);
          
          await updateDoc(orderRef, {
            'delivery': 'käsitelty',
          });

          toast.success('Tilaus merkitty käsitellyksi!');

          setOrders(prevOrders => 
            prevOrders.map(o => 
              o.id === orderId 
                ? { ...o, delivery: 'käsitelty' } 
                : o
            )
          );
        } else {
          console.error('No matching document found for orderID:', orderId);
          toast.error('Tilausta ei löytynyt!');
        }
      } catch (error) {
        console.error('Error updating order:', error);
        toast.error('Virhe tilauksen päivityksessä!');
      }
    }
  };

       // Function to return order to "käsiteltävänä"
       const markOrderAsPending = async (orderId: string) => {
        const confirmation2 = await new Promise((resolve) => {
          const toastId = toast(
            <div>
              <p>Oletko varma, että haluat palauttaa tuotteen käsiteltäväksi?</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
                <button 
                  className='bg-green-500 text-white px-2 py-1 rounded mr-2 hover:cursor-pointer' 
                  onClick={() => {
                    toast.dismiss(toastId);
                    resolve(true);
                  }}
                >
                  Kyllä
                </button>
                <button 
                  className='bg-gray-300 text-black px-2 py-1 rounded hover:cursor-pointer' 
                  onClick={() => {
                    toast.dismiss(toastId);
                    resolve(false);
                  }}
                >
                  Ei
                </button>
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
    
        if (confirmation2) {
          try {
            // Query for the document with matching orderID
            const ordersRef = collection(db, 'orders');
            const q = query(ordersRef, where('orderID', '==', orderId));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
              // Get the first matching document
              const docId = querySnapshot.docs[0].id;
              const orderRef = doc(db, 'orders', docId);
              
              await updateDoc(orderRef, {
                'delivery': 'käsiteltävänä',
              });
    
              toast.success('Tilaus merkitty käsiteltäväksi!');
    
              setOrders(prevOrders => 
                prevOrders.map(o => 
                  o.id === orderId 
                    ? { ...o, delivery: 'käsiteltävänä' } 
                    : o
                )
              );
            } else {
              console.error('No matching document found for orderID:', orderId);
              toast.error('Tilausta ei löytynyt!');
            }
          } catch (error) {
            console.error('Error updating order:', error);
            toast.error('Virhe tilauksen päivityksessä!');
          }
        }
      };

  // Render loading spinner when data is being fetched
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 mt-20">
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
    );
  }

  return (
    <div className={stylesadmin.orderListContainer}>
      <h2 className='font-bold text-xl mb-18 mt-10'>Uudet tilaukset</h2>
      <div className='mb-10 text-center text-[14px]'>Ohjeet: merkitse ensin tilauksen toimitustila klikkaamalla "Merkitse toimitetuksi" (joko tilaus toimitetaan asiakkaalle tai ei) ja sitten kun tilaus on lopullisesti käsitelty, merkitse tilaus käsitellyksi. Silloin tilaus siirtyy käsiteltyihin tilauksiin.</div>
      <ul className='-mb-6'>
        {orders.length > 0 ? (
          orders.map((order) => (
            order.delivery !== 'käsitelty' && (
              <li key={order.id} className={stylesadmin.orderItem}>
                {/* Customer Information Section */}
                {order.formData ? (
                  <div className={stylesadmin.orderDetails}>
                    <p className='!m-2 !p-0'>Tilauksen ID: <br /><br />{order.id}</p>
                    <p className='!m-6 !p-0'><strong>Asiakkaan nimi: </strong> {order.formData.name}</p>
                    <p className='!m-2 !p-0'><strong>Sähköposti: </strong> {order.formData.email}</p>
                    <p className='!m-2 !p-0'><strong>Puhelinnumero: </strong> {order.formData.phone}</p>
                    <p className='!m-2 !p-0'><strong>Osoite: </strong> {order.formData.address}</p>
                    <p className='!m-2 !p-0'><strong>Postinumero: </strong> {order.formData.postalCode}</p>
                    <p className='!m-6 !p-0'><strong>Tilaussumma yhteensä: </strong> €{order.totalAmount}</p>
                    <p className={stylesadmin.orderDate}><strong>Tilauspäivämäärä: </strong> {order.orderDate}</p>
                    <p><strong>Tilaustila: </strong> {order.delivery}</p>
                    <button className='gobtn' onClick={() => markOrderAsDelivered(order.id)}>
                      Merkitse käsitellyksi
                    </button>
                  </div>
                ) : (
                  <p>Asiakastietoja ei saatavilla.</p>
                )}
                {/* Cart Items Section */}
                <div className={stylesadmin.cartItems}>
                  <h4 className='mb-4'>Tilaukseen sisältyvät tuotteet:</h4>
                  {order.cartItems && order.cartItems.length > 0 ? (
                    order.cartItems.map((item) => (
                      <div key={item.id} className={stylesadmin.cartItemRow}>
                        <div className={stylesadmin.cartItem}>
                          <img className={stylesadmin.image} src={item.image} alt={item.name} />
                          <div className={stylesadmin.itemDetails}>
                            <p className='!p-0 !w-90'><strong>Tuotteen nimi: </strong> {item.name}</p>
                            <p className='!p-0'><strong>Hinta: </strong> €{item.price}</p>
                            <p className='!p-0'><strong>Määrä: </strong> {item.quantity}</p>
                            <p className='!p-0'><strong>Yhteensä: </strong> €{item.totalPrice}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>Ei tuotteita.</p>
                  )}

                  {/* A section for the button which toggles the order status based on "toimitettu" status */}
                  {/* Add Comment Field for Pending Orders */}
                  {order.delivery === 'käsiteltävänä' && (
                <div>
                  {/* Display existing comments above the textarea */}
                  {order.comments && (
                  <div className="mb-4 mt-6 p-2 border border-gray-600 rounded">
                    <h4 className="font-bold mb-2 underline">Aiemmat kommentit:</h4>
                    {Array.isArray(order.comments) ? (
                      order.comments.map((comment: string, index: number) => (
                        <p className='!p-4' key={index}>{comment}</p>
                      ))
                    ) : (
                      <p>{order.comments}</p>
                    )}
                  </div>
                )}

                  {/* Textarea for adding or editing comments */}
                  <textarea
                    value={comments[order.id] || ''}
                    onChange={(e) => handleCommentChange(order.id, e.target.value)}
                    className="w-full p-2 border-2 text-center border-blue-600 rounded mt-4"
                    placeholder="Lisää kommentti tilaukseen"
                  />
                  
                  <button
                    onClick={() => saveComment(order.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:cursor-pointer"
                  >
                    Tallenna kommentti
                  </button>
                </div>
              )}
                <div className="mt-10">Toimitustila: {order.sendStatus}</div>

                <button className='gobtn mt-10' onClick={() => toggleSendStatus(order.id)}>
                {order.sendStatus === 'toimitettu' ? 'Merkitse ei-toimitetuksi' : 'Merkitse toimitetuksi'}
              </button>
                </div>
              </li>
            )
          ))
        ) : (
          <p>Ei uusia tilauksia.</p>
        )}
      </ul>

      {/* Processed Orders Section */}
<div className="relative mt-20">
  <h2 className='font-bold mb-18 text-xl !mt-20 pt-24 border-t-2 border-gray-300 cursor-pointer'
    onClick={() => {
      const dropdown = document.querySelector('.dropdown');
      if (dropdown) {
        dropdown.classList.toggle('hidden');
      }
    }}
  >
    Käsitellyt tilaukset
  </h2>
  <ul className="dropdown mb-6">
    {orders.length > 0 ? (
      orders.map((order) => (
        order.delivery === 'käsitelty' && (
          <li key={order.id} className={`${stylesadmin.orderItem} bg-gray-50`}>
            {/* Customer Information Section */}
            {order.formData ? (
              <div className={stylesadmin.orderDetails}>
                <p>Tilauksen ID: <br /><br />{order.id}</p>
                <p><strong>Asiakkaan nimi: </strong> {order.formData.name}</p>
                <p><strong>Sähköposti: </strong> {order.formData.email}</p>
                <p><strong>Puhelinnumero: </strong> {order.formData.phone}</p>
                <p><strong>Osoite: </strong> {order.formData.address}</p>
                <p><strong>Postinumero: </strong> {order.formData.postalCode}</p>
                <p><strong>Tilaussumma yhteensä: </strong> €{order.totalAmount}</p>
                <p className={stylesadmin.orderDate}><strong>Tilauspäivämäärä: </strong> {order.orderDate}</p>
                <p className="text-green-600"><strong>Tilaustila: </strong> {order.delivery}</p>
                <button className='gobtn' onClick={() => markOrderAsPending(order.id)}>
                    Palauta käsiteltäväksi
                  </button>
              </div>
            ) : (
              <p>Asiakastietoja ei saatavilla.</p>
            )}
            {/* Cart Items Section */}
            <div className={stylesadmin.cartItems}>
              <h4 className='mb-4'>Tilaukseen sisältyvät tuotteet:</h4>
              {order.cartItems && order.cartItems.length > 0 ? (
                order.cartItems.map((item) => (
                  <div key={item.id} className={stylesadmin.cartItemRow}>
                    <div className={stylesadmin.cartItem}>
                      <img className={stylesadmin.image} src={item.image} alt={item.name} />
                      <div className={stylesadmin.itemDetails}>
                        <p className='!p-0 !w-90'><strong>Tuotteen nimi: </strong> {item.name}</p>
                        <p className='!p-0'><strong>Hinta: </strong> €{item.price}</p>
                        <p className='!p-0'><strong>Määrä: </strong> {item.quantity}</p>
                        <p className='!p-0'><strong>Yhteensä: </strong> €{item.totalPrice}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>Ei tuotteita.</p>
              )}
            <div className="mt-10">Toimitustila: {order.sendStatus}</div>
            </div>
          </li>
        )
      ))
    ) : (
      <p>Ei käsiteltyjä tilauksia.</p>
    )}
  </ul>
</div>

    </div>
  );
};

export default AdminOrderList;
export const markOrderAsPending = async (orderId: string) => {};
