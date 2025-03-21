import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CustomAlert = () => {
  // Function that will handle the button click
  const handleButtonClick = () => {
    toast.dismiss(); // Close the toast when the button is clicked
    console.log("Button clicked!");
  };

  // Function to show the custom toast
  const showToast = () => {
    toast(
      <div>
        <p>Haluatko varmasti poistaa valitsemasi tuotteen?</p>
        <button onClick={handleButtonClick}>Kyllä</button>
      </div>,
      {
        position: "top-right",
        autoClose: false,
        closeOnClick: false,
        hideProgressBar: true,
      }
    );
  };

  return (
    <div>
      <button onClick={showToast}>Show Custom Alert</button>
      <ToastContainer />
    </div>
  );
};

export default CustomAlert;
