import React, { useState } from 'react';
import { db } from '../firebase/firebaseConfig';
import { query, where, getDocs, collection } from 'firebase/firestore';

interface Order {
  orderID: string;
  orderData: any; // Define specific type if you know it
  cartItems: CartItem[]; // Define the structure of each cart item
  delivery: string;
  formData: any; // Define specific type if you know it
  sendStatus: string;
  timestamp: any; // Define specific type if you know it
  totalAmount: number;
  userId: string;
  comments?: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
  image: string;
}

const AdminOrderSearch = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<Order | null>(null);

  const getOrderById = async (orderId: string): Promise<Order | null> => {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('orderID', '==', orderId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const data = querySnapshot.docs[0].data();
      const order: Order = {
        orderID: data.orderID,
        orderData: data.orderData,
        cartItems: data.orderData.cartItems,
        delivery: data.delivery,
        formData: data.orderData.formData,
        sendStatus: data.sendStatus,
        timestamp: data.timestamp,
        totalAmount: data.orderData.totalAmount,
        userId: data.userId,
      };
      return order;
    } else {
      return null;
    }
  };

  const handleSearch = async () => {
    console.log('handleSearch called');
    const foundOrder = await getOrderById(orderId);
    console.log('foundOrder:', foundOrder);
    if (foundOrder) {
      setOrder(foundOrder);
    } else {
      setOrder(null);
    }
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-center p-6">
      <input
        type="text"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        placeholder="Kirjoita tilauksen ID"
      />
      <button className='gobtn mt-10' onClick={handleSearch}>Search</button>
      {order ? (
        <div className="container mx-auto flex flex-col items-center justify-center p-6">
          <h2 className='mb-4'>Tulokset ID:llä:</h2>
          <h2>{order.orderID}</h2>
          {/* Customer Information Section */}
          {order.formData ? (
            <div className="customer-info flex flex-col items-center justify-center p-6">
              <div><strong>Asiakkaan nimi: </strong> {order.formData.name}</div>
              <div><strong>Sähköposti: </strong> {order.formData.email}</div>
              <div><strong>Puhelinnumero: </strong> {order.formData.phone}</div>
              <div><strong>Osoite: </strong> {order.formData.address}</div>
              <div><strong>Postinumero: </strong> {order.formData.postalCode}</div>
              <div><strong>Tilaussumma yhteensä: </strong> €{order.totalAmount}</div>
              <div><strong>Tilauspäivämäärä: </strong> {order.timestamp.toDate().toLocaleString()}</div>
              <div className="text-green-600 mt-10"><strong>Tilaustila: </strong> {order.delivery}</div>
            </div>
          ) : (
            <p>Asiakastietoja ei saatavilla.</p>
          )}
          {/* Cart Items Section */}
          <div>
            <h4 className='mb-10'>Tilaukseen sisältyvät tuotteet:</h4>
            {order.cartItems && order.cartItems.length > 0 ? (
              order.cartItems.map((item) => (
                <div key={item.id} className="flex mb-4">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-16 h-16 mr-4" />
                  )}
                  <div>
                    <div><strong>Tuotteen nimi: </strong> {item.name}</div>
                    <div><strong>Hinta: </strong> €{item.price}</div>
                    <div><strong>Määrä: </strong> {item.quantity}</div>
                    <div><strong>Yhteensä: </strong> €{item.totalPrice}</div>
                  </div>
                </div>
              ))
            ) : (
              <p>Ei tuotteita.</p>
            )}
            <div className="mt-10">Toimitustila: {order.sendStatus}</div>
          </div>
        </div>
      ) : (
        <p>Hae tilausta ID:llä ja tiedot tulevat tähän.</p>
      )}
    </div>
  );
};

export default AdminOrderSearch;
