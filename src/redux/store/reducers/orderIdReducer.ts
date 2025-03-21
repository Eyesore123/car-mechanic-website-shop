import { UPDATE_ORDER_ID } from '../actions/updateOrder';

interface OrderIdState {
  orderId: string | null;
}

const initialState: OrderIdState = {
  orderId: null,
};

const orderIdReducer = (state = initialState, action: any): OrderIdState => {
  switch (action.type) {
    case UPDATE_ORDER_ID:
      console.log('UPDATE_ORDER_ID', action.orderId);
      return { ...state, orderId: action.orderId };
    default:
      return state;
  }
};

export default orderIdReducer;