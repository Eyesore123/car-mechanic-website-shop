'use client';

import "./globals.css";
import { Provider } from "react-redux";

import store, { persistor } from "../redux/store/store";
import { PersistGate } from "redux-persist/integration/react";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="font-sans" 
        style={{
          fontFamily: 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'
        }}
      >
        <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Navbar />
          {children}
          <ToastContainer 
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                closeOnClick
                toastStyle={{ width: "600px" }}
            />
          <Footer />
        </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
