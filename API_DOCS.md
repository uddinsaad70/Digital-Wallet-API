# 📚 Digital Wallet - API Endpoints

### 🔐 Authentication (Auth)

- **Register User:** `POST http://localhost:3000/api/auth/register`
  _(Must provide name, email, and password in the body)_
- **Login User:** `POST http://localhost:3000/api/auth/login`
  _(Must provide email and password in the body)_
- **Get Profile:** `GET http://localhost:3000/api/auth/profile`
  _(Must provide Token in the Headers)_

### 💻 Products (RBAC)

- **Get All Products:** `GET http://localhost:3000/api/products`
  _(Open to all, Token is not required)_
- **Add New Product:** `POST http://localhost:3000/api/products`
  _(Requires Token in the Headers and user's Role must be 'admin')_

### 💰 Wallet

- **Check Balance:** `GET http://localhost:3000/api/wallet`
  _(Must provide Token in the Headers)_
- **Deposit Money:** `POST http://localhost:3000/api/wallet/deposit`
  _(Must provide Token in the Headers and amount in the body)_

### 🛒 Transactions

- **Purchase Product:** `POST http://localhost:3000/api/transactions/purchase/:productId`
  _(Must provide Token in the Headers. Replace :productId at the end of the URL with the actual ID)_
