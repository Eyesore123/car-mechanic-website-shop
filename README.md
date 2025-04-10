
## This is a shop extension for pnp-power.fi website

NOTE! This website is up and running but it's not used as a shop. Also it's written entirely in Finnish.

## Tech stack

- Next.js
- Typescript
- TailwindCSS
- React Redux
- Firebase
- Node.js
- SendGrid for email notifications and order confirmations

For stylings:

- Shadcn used for shop item cards (including card, button, input, label)
- Framer motion for shopping basket animation
- React-toastify for toast notifications (cart, signup welcome, alerts)
- React-loader-spinner for animating some of the components, especially images. Also used when pages are loading.
- React-fast-marquee for marquee animation on the landing page.


## Description


- Slicers are used from redux toolkit for both user authentication and cart. AuthSlice slicer keeps tabs on user role and cartSlice keeps tabs on cart items.
- Custom redux storage is used for cart items and regular local storage is used for maintaining user's authentication status when the user refreshes the page etc.
- PersistGate wrapper is used to persist user action and status across application without errors.
- Firebase is used for authentication and database. Yes, authentication is used doubly in this application to ensure that user's authentication status is not lost when the user refreshes the page or when anything weird happens, but Firebase auth is in charge of the authentication.
- Database stores users' roles and their sign-up data in "users" collection. "Products" collection stores product data which is added and controlled by admin. "Orders" collection stores all the order data. 
- Admin page has components (4 of which display as different tabs inside the admin page) for 1) showing products, 2) adding and deleting products 3) modifying a selected product (including name, price and description) 4) making a quick order search with the order ID and 5) sending newsletters either to a selected email for testing or to all newsletter subscribers.
- Admin can make changes to products, change text or upload new images. Admin can also track the status of orders and write comments and mark orders as "delivered" or "not delivered" (are the products delivered or not) and "handled" or "waiting for handling" (is the order handled or not).
- Admin can set a custom stock description for products (for example, "Out of stock" or "9 available"). When the stock is 0, the product card is greyed out and the user can't add it to the cart.
- Products are fetched dynamically from the database and displayed on the shop page.
- Links are shown dynamically based on user's role. There are three roles: "admin", "user" and "guest". Only admin has access to admin page. Guests can see the store page and make orders. Users can make orders and they have access to their account page.
- Orders are stored in the separate orders collection from where they are fetched and displayed in admin panel. Orders are queried by timestamp and the newest orders are shown first.
- Users can check their orders in the "My account" tab. Users can also toggle the newsletter status and delete their account.
- All the code for firebase functions is included in the project files (and nodemailer is used for sending emails), but the current project setup uses SendGrid for sending emails. 
- Order confirmation gets sent to the customer's email and an email notification of a new order gets sent to the store owner.

Note:

.env configured to use env variables on the server (root directory).
If you want to test the site, put all the required keys in a .env file in the project root and launch with "npm run dev" after installing the dependencies with "npm i".
If you want to test the admin panel, change the user role to "admin" in firebase database. Otherwise you won't see the content that's authorized only to admin.
