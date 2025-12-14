# SweetShop - Full Stack MERN Application

A modern, responsive e-commerce platform for ordering premium sweets. Built with the MERN stack (MongoDB, Express, React, Node.js), this application features role-based authentication (Admin/Customer), a shopping cart, order management, and password recovery.

## 🚀 Live Demo

* **Frontend:** [https://sweet-shop-client.vercel.app/](https://sweet-shop-client.vercel.app/)
* **Backend API:** [https://sweet-shop-api.vercel.app/](https://sweet-shop-api.vercel.app/)
* **Backend Repository:** [https://github.com/inderkiranbhamra/sweet-shop-api](https://github.com/inderkiranbhamra/sweet-shop-api)

---

## ✨ Features

### 🛍️ Customer Features
* **Browse Products:** View all sweets with search and category filtering.
* **Guest Access:** Browse products without logging in ("Skip Login").
* **Cart Management:** Add items to cart (Login required for purchase).
* **Order History:** View past orders and payment status.
* **Authentication:** * Register/Login with Email & Password.
    * Google OAuth Login.
    * Forgot Password flow (Email reset link).

### 🛡️ Admin Features
* **Dashboard:** Manage inventory (Add, Edit, Delete sweets).
* **Order Management:** View all customer orders.
* **Secure Registration:** Admin accounts require OTP verification sent to the Super Admin.

---

## 🔑 Test Credentials

You can use these credentials to test the application immediately:

| Role | Email | Password | Note |
| :--- | :--- | :--- | :--- |
| **Admin** | `inderkiran2003@gmail.com` | `Inderkiran25` | Has full access to dashboard |
| **Customer** | `test@gmail.com` | `test` | Can browse and place orders |

> **Note on Admin Creation:** Anyone can attempt to register as an Admin, but the account will not be created without an OTP. This OTP is sent exclusively to `inderkiranbhamra2003@gmail.com` for approval.

---

## 🛠️ Tech Stack

* **Frontend:** React.js, TypeScript, Tailwind CSS, Vite, Context API (Auth & Cart).
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB (Mongoose).
* **Authentication:** JWT (JSON Web Tokens), Google OAuth, Nodemailer (OTP & Reset Emails).
* **Deployment:** Vercel.

---

## ⚙️ Local Setup Instructions

### 1. Backend Setup
1.  Clone the API repo:
    ```bash
    git clone [https://github.com/inderkiranbhamra/sweet-shop-api](https://github.com/inderkiranbhamra/sweet-shop-api)
    cd sweet-shop-api
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the root directory:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    
    # Email Config (Gmail App Password)
    MAIL_USER=your_email@gmail.com
    MAIL_PASS=your_app_password
    
    # Google OAuth
    GOOGLE_CLIENT_ID=your_google_client_id
    
    # Client URL for Redirects
    CLIENT_URL=http://localhost:5173
    ```
4.  Start the server:
    ```bash
    npm run dev
    ```

### 2. Frontend Setup
1.  Navigate to the client folder (if in a monorepo) or clone the client repo.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file:
    ```env
    VITE_API_URL=http://localhost:5000/api
    VITE_GOOGLE_CLIENT_ID=your_google_client_id
    ```
4.  Start the React app:
    ```bash
    npm run dev
    ```

---

## 🤖 My AI Usage

This project was developed with the assistance of AI tools to accelerate development, troubleshoot errors, and refine the architecture.

* **AI Tool Used:** **Google Gemini** (Large Language Model)
* **How I Used It:**
    * **Backend Architecture:** I used Gemini to brainstorm the optimal schema for Users and Orders, specifically asking how to handle the `resetPasswordToken` and `otpExpires` fields securely in Mongoose.
    * **Logic Implementation:** I asked Gemini to generate the specific controller logic for the "Forgot Password" flow, including generating a crypto token and configuring `nodemailer` to send the reset link.
    * **Frontend Troubleshooting:** When implementing the "Skip Login" feature, I faced issues with the `ProtectedRoute` wrapper redirecting guests. I pasted my `App.tsx` code into Gemini, which correctly identified that the Home route needed to be moved outside the protected component.
    * **Refactoring:** I used Gemini to convert my initial `AuthContext` from a basic state manager to a persistent one that uses `localStorage`, ensuring user sessions survived page refreshes.
    * **UI/UX Enhancements:** I utilized Gemini to generate the Tailwind CSS classes for the responsive product grid, specifically asking for a "css grid that keeps cards square and fills empty space" (`grid-cols-[repeat(auto-fit,minmax(280px,1fr))]`).

* **Reflection on AI Impact:**
    Using AI significantly reduced the time spent on "boilerplate" setup and debugging. Instead of spending hours searching for specific syntax (like `crypto.randomBytes` or `nodemailer` configurations), I could get working examples instantly. It acted as a pair programmer, catching logical errors in my routing and authentication flow that might have taken much longer to trace manually. However, I still needed to understand the underlying code to integrate the snippets correctly into my specific project structure.
