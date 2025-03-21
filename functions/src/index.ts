/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// Not needeed for this project, logger used for logging:
// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

import * as admin from "firebase-admin";
// import * as functions from "firebase-functions";
import * as nodemailer from "nodemailer";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(__dirname, "../../.env") });

admin.initializeApp();

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Firestore trigger for order confirmation email
export const sendOrderConfirmation = onDocumentCreated("orders/{orderId}", async (event) => {
  const snap = event.data;
  const orderData = snap?.data();
  const orderId = event.params.orderId;
  const userEmail = orderData?.formData?.email;

  if (!userEmail) {
    console.error("No user email found for order:", orderId);
    return;
  }

  // Email to customer (order confirmation)
  const customerMailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Tilausvahvistus",
    text: `Tilauksesi on vastaanotettu. Tässä ovat tilauksesi tiedot:\n\n${JSON.stringify(orderData, null, 2)}`,
  };

  // Email to admin (notification)
  const adminMailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: "Uusi tilaus vastaanotettu",
    text: `Uusi tilaus vastaanotettu. Tässä ovat tilauksen tiedot:\n\nTilaus-ID: ${orderId}\n\n${JSON.stringify(orderData, null, 2)}`,
  };

  try {
    // Send confirmation email to customer
    await transporter.sendMail(customerMailOptions);
    console.log("Tilausvahvistus lähetetty sähköpostiosoitteeseen:", userEmail);

    // Send notification email to admin
    await transporter.sendMail(adminMailOptions);
    console.log("Ilmoitus uudesta tilauksesta lähetetty adminille:", process.env.ADMIN_EMAIL);
  } catch (error) {
    console.error("Viestin lähetys epäonnistui:", error);
  }
});