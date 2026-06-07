# 🛒 Cartique

A modern, full-stack e-commerce platform built with **React 19** and **Express 5**. Cartique supports both buyer and seller workflows — buyers can browse products, manage carts, and pay via Razorpay, while sellers get a full dashboard to create, edit, and manage their product listings with variant support.

---

## ✨ Features

### 🔐 Authentication
- Email/password registration & login with **JWT**-based auth
- **Google OAuth 2.0** sign-in via Passport.js
- Role-based access control (**buyer** / **seller**)
- Protected routes on both frontend and backend

### 🛍️ Product Management (Seller)
- Create, edit, and delete products with rich details
- **Multi-variant support** — each variant has its own attributes (size, color, etc.), stock, price, and images
- Up to **7 images per variant** with drag-and-drop upload
- Image hosting via **ImageKit**
- Seller dashboard with product overview
- Detailed seller product view

### 🏠 Storefront (Buyer)
- Homepage with product browsing
- Detailed product pages with **image magnifier**
- Variant selection with dynamic pricing
- User ratings per variant (0–10 scale)

### 🛒 Cart & Checkout
- Add to cart with variant & quantity selection
- Real-time cart management (update quantity, remove items)
- **Shipping address** management
- **Razorpay** payment gateway integration
- Order success & payment failure pages
- Toast notifications for cart actions

---

## 🏗️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **Vite 8** | Build tool & dev server |
| **Redux Toolkit** | Global state management |
| **React Router 7** | Client-side routing |
| **Tailwind CSS 4** | Utility-first styling |
| **Axios** | HTTP client |
| **React Razorpay** | Payment integration |

### Backend
| Technology | Purpose |
|---|---|
| **Express 5** | Web framework |
| **MongoDB + Mongoose 9** | Database & ODM |
| **JWT** | Authentication tokens |
| **Passport.js** | Google OAuth strategy |
| **bcrypt.js** | Password hashing |
| **ImageKit** | Image upload & CDN |
| **Razorpay** | Payment processing |
| **Multer** | File upload middleware |
| **Morgan** | HTTP request logging |
| **express-validator** | Input validation |

---

## 📁 Project Structure

```
cartique/
├── Backend/
│   ├── server.js                 # Entry point — starts Express & connects DB
│   ├── package.json
│   └── src/
│       ├── app.js                # Express app config, middleware, routes
│       ├── config/
│       │   ├── config.js         # Environment variable validation & export
│       │   └── db.js             # MongoDB connection
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   ├── product.controller.js
│       │   ├── cart.controller.js
│       │   ├── payment.controller.js
│       │   └── address.controller.js
│       ├── models/
│       │   ├── user.model.js     # User schema (buyer/seller, Google OAuth)
│       │   ├── product.model.js  # Product schema (variants, images, ratings)
│       │   ├── cart.model.js
│       │   ├── order.model.js
│       │   ├── address.model.js
│       │   └── price.schema.js   # Reusable price sub-schema
│       ├── routes/
│       │   ├── auth.routes.js
│       │   ├── product.routes.js
│       │   ├── cart.routes.js
│       │   ├── payment.routes.js
│       │   └── address.routes.js
│       ├── middleware/
│       │   └── auth.middleware.js # JWT verification & route protection
│       ├── services/
│       │   ├── payment.service.js # Razorpay order creation
│       │   └── storage.service.js # ImageKit upload service
│       ├── dao/
│       │   └── product.dao.js    # Product data access layer
│       └── validator/            # Request validation schemas
│
├── Frontend/
│   ├── index.html                # HTML entry with Google Fonts
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx              # React root with Provider & Router
│       ├── app/
│       │   ├── App.jsx           # Root component
│       │   ├── App.css           # Global styles
│       │   ├── AppLayout.jsx     # Layout wrapper with Navbar
│       │   ├── app.routes.jsx    # All route definitions
│       │   └── app.store.js      # Redux store configuration
│       └── features/
│           ├── auth/
│           │   ├── components/   # Protected route wrapper
│           │   ├── hook/         # Auth custom hooks
│           │   ├── pages/        # Login, Register
│           │   ├── service/      # Auth API calls
│           │   └── state/        # Auth Redux slice
│           ├── products/
│           │   ├── components/   # ImageMagnifier
│           │   ├── hooks/        # Product custom hooks
│           │   ├── pages/        # Home, ProductDetail, CreateProduct,
│           │   │                 # EditProduct, Dashboard, SellerProductDetails
│           │   ├── service/      # Product API calls
│           │   └── state/        # Product Redux slice
│           ├── cart/
│           │   ├── components/   # CartToast, ShippingAddress
│           │   ├── hook/         # Cart custom hooks
│           │   ├── pages/        # Cart, OrderSuccess, PaymentFailed
│           │   ├── service/      # Cart API calls
│           │   └── state/        # Cart & Toast Redux slices
│           └── Shared/
│               └── Components/   # Nav (shared navbar)
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **MongoDB** (local instance or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **Razorpay** account ([dashboard.razorpay.com](https://dashboard.razorpay.com))
- **Google Cloud** OAuth 2.0 credentials
- **ImageKit** account ([imagekit.io](https://imagekit.io))

### 1. Clone the Repository

```bash
git clone https://github.com/Soumipal56/cartique_soumi.git
cd cartique_soumi
```

### 2. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend/` directory:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/cartique
JWT_SECRET=your_jwt_secret_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Start the backend:

```bash
npm run dev     # Development (with nodemon)
npm start       # Production
```

The API server runs at **http://localhost:3000**.

### 3. Frontend Setup

```bash
cd Frontend
npm install
```

Create a `.env` file in the `Frontend/` directory:

```env
VITE_API_URL=http://localhost:3000
```

Start the frontend:

```bash
npm run dev
```

The app runs at **http://localhost:5173**.

---

## 🔌 API Endpoints

### Auth — `/api/auth`
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/register` | Register a new user |
| `POST` | `/login` | Login with email & password |
| `GET` | `/google` | Initiate Google OAuth flow |
| `GET` | `/google/callback` | Google OAuth callback |

### Products — `/api/products`
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | List all products |
| `GET` | `/:productId` | Get product details |
| `POST` | `/` | Create a product (seller only) |
| `PUT` | `/:productId` | Update a product (seller only) |
| `DELETE` | `/:productId` | Delete a product (seller only) |

### Cart — `/api/cart`
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Get user's cart |
| `POST` | `/` | Add item to cart |
| `PUT` | `/:itemId` | Update cart item quantity |
| `DELETE` | `/:itemId` | Remove item from cart |

### Payments — `/api/payment`
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/` | Create a Razorpay order |

### Addresses — `/api/address`
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Get user's addresses |
| `POST` | `/` | Add a new address |

---

## 🔑 Environment Variables

### Backend

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (default: `3000`) |
| `MONGO_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | Secret key for signing JWTs |
| `GOOGLE_CLIENT_ID` | ✅ | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | ✅ | Google OAuth client secret |
| `IMAGEKIT_PRIVATE_KEY` | ✅ | ImageKit private API key |
| `RAZORPAY_KEY_ID` | ✅ | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | ✅ | Razorpay key secret |

### Frontend

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | ✅ | Backend API base URL |

---

## 🛣️ Frontend Routes

| Path | Access | Description |
|---|---|---|
| `/` | Public | Homepage — browse products |
| `/register` | Public | User registration |
| `/login` | Public | User login |
| `/product/:productId` | Public | Product detail page |
| `/cart` | Buyer | Shopping cart & checkout |
| `/order-success` | Buyer | Order confirmation |
| `/payment-failed` | Buyer | Payment failure page |
| `/seller/dashboard` | Seller | Seller product dashboard |
| `/seller/create-product` | Seller | Create new product |
| `/seller/edit-product/:productId` | Seller | Edit existing product |
| `/seller/product/:productId` | Seller | Seller product detail view |

---

## 📜 Available Scripts

### Backend
```bash
npm start        # Start the production server
npm run dev      # Start with nodemon (auto-reload)
```

### Frontend
```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.
