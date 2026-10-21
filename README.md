# TastyFoodBackend

# Tasty Food — Full-Stack Restaurant Ordering App

A full-stack food ordering and restaurant management application. Customers browse a menu, build a cart, and check out; staff manage incoming orders and assign drivers; admins manage staff, drivers, and customer accounts.

The project has two parts:

- **`xyz_restaurant/`** — React single-page app (the client)
- **`restuaurantdb/`** — Spring Boot service (the API, Java 21)

The React app talks to the API over REST at `http://localhost:8080`.

---

## Tech Stack

**Frontend**
- React 19 (Create React App / `react-scripts` 5)
- React Router 7 for client-side routing
- Axios and `fetch` for API calls
- React Toastify for notifications
- Tailwind CSS 4

**Backend**
- Spring Boot 3.5.6
- Java 21
- Spring Web + Spring Security
- Lombok
- Gradle (wrapper included)

> Note: the backend module in this repo is a starter scaffold (application entry point and build config). The REST endpoints listed below are the contract the React client is built against and is wired to consume.

---

## Features

### Customer
- Browse the menu, filtered by category (All, Burger, Chicken, Pizza)
- View item details in a modal and add items to the cart
- Cart drawer with quantity adjustment and running total
- Register an account and log in with a customer code
- Checkout and payment screen with saved-card lookup
- Order tracking view (order received → preparing → delivered)

### Staff
- Log in to the staff panel
- View all incoming orders
- Assign an available driver to an order
- Mark an order as delivered
- Change account password

### Admin
- Dashboard for managing the restaurant
- Create and remove staff members
- Add, remove, and enable/disable drivers
- Review and approve new customer registrations
- View all customers

Order lifecycle: **Pending → Assigned Driver → Delivered**

---

## Project Structure

```
TastyFoodFull-stack-code/
├── xyz_restaurant/                 # React frontend
│   ├── public/                     # Static assets (logo, menu images, icons)
│   └── src/
│       ├── App.js                  # Routes
│       ├── Constants.js            # Order status constants
│       ├── Views/                  # Full pages (screens)
│       │   ├── RestaurantHome.jsx  # Menu, cart, checkout entry
│       │   ├── CustomerLogin.jsx
│       │   ├── CustomerRegister.jsx
│       │   ├── PaymentScreen.jsx
│       │   ├── StaffLogin.jsx
│       │   ├── StaffPanel.jsx
│       │   ├── AdminLogin.jsx
│       │   ├── Dashboard.jsx       # Admin management
│       │   └── ChangePassword.jsx
│       ├── Component/              # Reusable UI
│       │   ├── Header.jsx
│       │   ├── MenuCard.jsx
│       │   ├── FoodModal.jsx
│       │   ├── CartDrawer.jsx
│       │   ├── OrderTracking.jsx
│       │   └── headBarCategorii.jsx
│       └── data/                   # Category bar + local menu data
│
├── restuaurantdb/                  # Spring Boot backend
│   ├── src/main/java/...           # Application entry point
│   ├── src/main/resources/         # application.properties
│   └── build.gradle
│
└── TestData-CS7336-Sec401.xlsx     # Sample seed data
```

The sample workbook includes sheets for Menu Items, Completed Orders, Pending Orders, Drivers, Staff Members, and Customers — useful for seeding the database during development.

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Java 21 (JDK)

### Run the backend

```bash
cd restuaurantdb
./gradlew bootRun
```

The service starts on `http://localhost:8080`.

### Run the frontend

```bash
cd xyz_restaurant
npm install
npm start
```

The app runs on `http://localhost:3000` and expects the API at `http://localhost:8080`.

### Build the frontend for production

```bash
cd xyz_restaurant
npm run build
```

---

## Routes (Frontend)

| Path                 | Screen            |
|----------------------|-------------------|
| `/`                  | Restaurant home / menu |
| `/customerlogin`     | Customer login    |
| `/customerregister`  | Customer registration |
| `/staff`             | Staff login       |
| `/staffpanel`        | Staff order panel |
| `/admin`             | Admin login       |
| `/dashboard`         | Admin dashboard   |
| `/change-password`   | Change password   |

---

## API Endpoints

The REST API the client consumes, grouped by resource:

**Auth**
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/change-password`

**Menu**
- `GET /api/menu/all`

**Customers**
- `POST /api/customers/register`
- `GET /api/customers/all`
- `GET /api/customers/code/{code}`
- `POST /api/customers/approve/{id}`

**Orders**
- `POST /api/orders/create`
- `GET /api/orders/all`
- `POST /api/orders/{orderId}/assignDriver?driverId={driverId}`
- `POST /api/orders/{orderId}/deliver`

**Drivers**
- `GET /api/drivers/all`
- `POST /api/drivers/add`
- `POST /api/drivers/toggle/{driverUnique}`
- `DELETE /api/drivers/delete/{driverUnique}`

**Staff**
- `GET /api/staff/all`
- `POST /api/staff/create`
- `DELETE /api/staff/delete/{staffId}`

**Cards**
- `GET /api/cards/customer/{customerNumber}`

---

## Author

**Mobin Ezzati**
