import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../redux/cart/cartSlice";
import CartItem from "./CartItem";
import { RootState } from "../redux/store/store";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import '../app/styles/Sidecart.module.css';
import { useRouter } from "next/navigation";

interface SideCartProps extends React.ComponentProps<"div"> {
  closeCart: () => void;
}

const SideCart: React.FC<SideCartProps> = ({ closeCart }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalAmount = useSelector((state: RootState) => state.cart.totalAmount);
  const router = useRouter();

  const clearCartHandler = () => {
    dispatch(clearCart());
    toast.info("Ostoskori tyhjennetty!");
  };

  return (
    <motion.div
      className="side-cart bg-white shadow-lg p-6 fixed right-0 top-0 h-full w-170 overflow-y-auto z-50"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
    >
      <h2 className="text-2xl font-bold pt-20 pb-16 border-b-2 border-gray-500">Ostoskori:</h2>

      {cartItems.length === 0 ? (
      <>
        <p className="text-gray-500">Ostoskorisi on tyhjä!</p>
        <button
          onClick={closeCart}
          className=" bg-blue-500 text-xl text-white px-4 mt-20 py-2 rounded-lg hover:cursor-pointer hover:scale-105 transform transition-transform duration-100 ease-in-out"
        >
          Sulje ostoskori
        </button>
      </>
      ) : (
        <div>
          {/* Render each CartItem */}
          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}

          {/* Total Amount */}
          <div className="mt-6 border-t-2 border-gray-500 pt-4">
            <div className="flex justify-evenly text-lg font-semibold">
              <span>Yhteensä:</span>
              <span>€ {totalAmount.toFixed(2)}</span>
            </div>

            {/* Clear Cart and Checkout buttons */}
            <div className="mt-4 flex justify-evenly">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={clearCartHandler}
                className="bg-red-500 text-white text-xl px-4 py-2 rounded-lg hover:bg-red-600 hover:cursor-pointer m-10"
              >
                Tyhjennä kori
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="bg-green-500 text-white text-xl px-4 py-2 rounded-lg hover:bg-green-600 hover:cursor-pointer m-10"
                onClick={() => {
                  // Go to  the shopping basket page
                  router.push('/cart');
                }}
              >
                Siirry tilaamaan
              </motion.button>
            </div>
            {/* Close Button */}
          <button
          onClick={closeCart} // Close cart on click
          className=" bg-blue-500 text-xl text-white px-4 md:!mt-20 py-2 rounded-lg hover:cursor-pointer hover:scale-105 transform transition-transform duration-100 ease-in-out"
        >
          Sulje ostoskori
        </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SideCart;
