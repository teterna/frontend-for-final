// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Animals from "./pages/Animals";
import Vets from "./pages/Vets";
import NavBar from "./components/Navbar";
import AdminRoute from "./components/AdminRoute"; // Import AdminRoute
import Register from "./pages/Register";
import Login from "./pages/Login";
import UsersManagement from "./pages/UsersManagement";
import Footer from "./components/Footer"; // Import Footer
import MyOrders from "./pages/MyOrders"; // Импортируем страницу заказов
import Cart from "./pages/Cart"; // Импортируем страницу корзины
import MyAppointments from "./pages/MyAppointments"; // Импортируем страницу записей
import Chat from "./pages/Chat"; // Импортируем страницу чата

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {" "}
        {/* Ensure footer sticks to bottom */}
        <NavBar />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <main className="flex-grow">
          {" "}
          {/* Allow main content to grow */}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/animals" element={<Animals />} />
            <Route path="/vets" element={<Vets />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/my-orders" element={<MyOrders />} /> {/* Добавляем маршрут для заказов */}
            <Route path="/cart" element={<Cart />} /> {/* Добавляем маршрут для корзины */}
            <Route path="/my-appointments" element={<MyAppointments />} /> {/* Добавляем маршрут для записей */}
            <Route path="/chat" element={<Chat />} /> {/* Добавляем маршрут для чата */}
            <Route
              path="/users"
              element={
                <AdminRoute>
                  <UsersManagement />
                </AdminRoute>
              }
            />
          </Routes>
        </main>
        <Footer /> {/* Add Footer here */}
      </div>
    </Router>
  );
}

export default App;
