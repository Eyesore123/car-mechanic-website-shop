export const UPDATE_ORDER_ID = 'UPDATE_ORDER_ID';

export const updateOrderId = (orderId: string) => {
  console.log('Updating order ID:', orderId);
  return {
    type: UPDATE_ORDER_ID,
    orderId,
  };
};