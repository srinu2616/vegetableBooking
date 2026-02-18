# Vegetable Booking App - Interview Guide

This guide is designed to help you explain your project during an interview. It covers the high-level overview, technical details, and potential deep-dive questions.

---

## 1. Project Overview (The "Elevator Pitch")
"I built a full-stack **Vegetable Booking Application** (MERN stack) that allows users to browse, search, and purchase fresh organic vegetables. It features a complete shopping experience from product discovery to secure checkout using Razorpay, along with a dedicated Admin Dashboard for managing inventory and orders."

---

## 2. Tech Stack
*   **Frontend**: React.js with Vite, Tailwind CSS (Material Tailwind), and Framer Motion for animations.
*   **Backend**: Node.js & Express.js.
*   **Database**: MongoDB with Mongoose ODM.
*   **Authentication**: Passport.js (Google OAuth) and custom JWT implementation (Dual-token system).
*   **State Management**: React Context API (Auth and Cart contexts).
*   **Storage**: Cloudinary (via Multer) for image uploads.
*   **Payments**: Razorpay Integration.

---

## 3. Core Features & Functionality

### 🛒 Shopping Experience
*   **Product Browsing**: Dynamic product listing with category filtering and search functionality.
*   **Cart System**: Persistent cart management using React Context and LocalStorage.
*   **Secure Checkout**: Integration with Razorpay for real-time payments and COD (Cash on Delivery) option.

### 🔐 Authentication & Security
*   **Dual-Token System**: Implemented short-lived **Access Tokens (15m)** and long-lived **Refresh Tokens (30d)** to balance security and user experience.
*   **Google OAuth**: Social login integration using Passport.js.
*   **Axios Interceptors**: Automated token refreshing on the client-side. If an access token expires (401 error), the interceptor automatically requests a new one using the refresh token without interrupting the user's flow.

### 📦 Inventory & Order Management (Stock Management)
*   **Real-time Stock Tracking**: The system automatically deducts stock upon order placement. It handles different units like **kg, grams, and pieces**, converting quantities as needed (e.g., 500g deduction from a kg-based stock).
*   **Stock Restoration**: If an order is cancelled, the system automatically restores the stock to the inventory.

### 🛠 Admin Dashboard
*   **Stats Overview**: Real-time revenue, total orders, and user metrics.
*   **Product Management**: Full CRUD (Create, Read, Update, Delete) for vegetables, including multi-image uploads to Cloudinary.
*   **Order Tracking**: Admin can update order status (Processing, Shipped, Delivered, Cancelled).

---

## 4. Technical Deep Dives (Interview "Wow" Factors)

### How did you handle Authentication?
"I implemented a secure dual-token authentication system. I used **JWT (JSON Web Tokens)** where the Access Token is short-lived for security, and the Refresh Token is stored in the database. On the frontend, I used **Axios Interceptors**. When a request fails with a 401 status, the interceptor catches it, calls the `/refresh` endpoint, updates the local storage with a new access token, and retries the original request seamlessly."

### How did you manage Stock?
"Stock management was critical. I implemented logic in the `orderController` to handle various units. For example, if a vegetable is sold in 'kg' but a user buys a '500g' pack, the system calculates the decimal deduction (0.5kg) from the total stock. I also ensured **atomicity** by updating the stock during the order creation process and included a rollback mechanism (stock restoration) if an order is cancelled."

### Why Vite over CRA?
"I chose **Vite** because of its superior developer experience—specifically the lightning-fast Hot Module Replacement (HMR) and significantly faster build times compared to Create React App, which uses Webpack."

---

## 5. Challenges Faced & Solutions

*   **Challenge**: Handling token expiration without forcing the user to log in again.
    *   **Solution**: Implemented the Refresh Token logic with Axios Interceptors.
*   **Challenge**: Managing complex stock logic with different units (kg, g, pieces).
    *   **Solution**: Created a centralized deduction logic that normalizes all units to the base unit stored in the database.
*   **Challenge**: Image handling and storage.
    *   **Solution**: Integrated **Cloudinary** to offload image hosting, ensuring the app remains fast and doesn't consume server storage.

---

## 6. Future Enhancements
*   Implementing **WebSockets** for real-time order status updates.
*   Adding **Redis** for caching frequently accessed product data to improve performance.
*   Implementing a **Recommendation Engine** based on user purchase history.
