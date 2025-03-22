import { motion } from "framer-motion";
import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addItem, removeItem } from "../redux/cart/cartSlice";

interface CartItemProps {
  item: {
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    totalPrice: number;
    availability: string | number;
  };
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const dispatch = useDispatch();
  const { id, name, image, price, quantity, totalPrice } = item;

  // Increment item quantity
  const incrementItem = () => {
    dispatch(
      addItem({
        id,
        name,
        image,
        price,
        quantity: 1, // Increment by 1
        totalPrice: price * (quantity + 1),
        availability: item.availability,
      })
    );
    toast.success("Tuotteen määrä ostoskorissa lisääntyi!");
  };

  // Decrement item quantity
  const decrementItem = () => {
    if (quantity > 1) {
      dispatch(
        addItem({
          id,
          name,
          image,
          price,
          quantity: -1, // Decrement by 1
          totalPrice: price * (quantity - 1),
          availability: item.availability
        })
      );
      toast.info("Tuotteen määrä ostoskorissa väheni.");
    } else {
      // Call delete action if quantity is 1
      deleteItem();
    }
  };

  // Delete item from cart
  const deleteItem = () => {
    dispatch(removeItem({ id }));
  };

  return (
    <div className="cart-item scale-80 mr-20 md:mr-0 md:scale-100 flex items-center justify-between p-4 md:border-b-2 md:mt-10  border-gray-500 h-60">
      <div className="flex items-center -ml-18 md:-ml-10">
        <img src={image} alt={name} className="w-20 h-20 object-cover md:mr-4 ml-6 md:ml-8 rounded-sm" />
        <div className="scale-85 md:scale-100 w-54 mr-6 md:mr-0 md:w-full flex flex-col justify-center text-center">
          <h5 className="text-lg font-bold mt-6 w-full">{name}</h5>
          <p className="text-gray-600 mr-4 !text-[18px] md:!pt-6 md:!pb-6 md:!pr-4 md:!pl-4 md:!mb-23">
            {quantity} x € {price.toFixed(2)} = € {totalPrice.toFixed(2)}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-4 -ml-4">
        {/* Increment/Decrement Buttons */}
        <div className="flex items-center">
          <button
            onClick={decrementItem}
            className="w-12 hover:cursor-pointer bg-gray-300 rounded hover:bg-gray-400"
          >
            -
          </button>
          <span className="px-2 md:px-4">{quantity}</span>
          <button
            onClick={incrementItem}
            className="w-12 hover:cursor-pointer bg-gray-300 rounded hover:bg-gray-400"
          >
            +
          </button>
        </div>

        {/* Delete Button with Framer Motion */}
        <motion.button
          whileTap={{ scale: 1.2 }}
          onClick={deleteItem}
          className="text-red-500 hover:text-red-700"
        >
          <i className="ri-close-line"></i>
        </motion.button>
      </div>
    </div>
  );
};

export default CartItem;
