import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Animals from './pages/Animals';
import Vets from './pages/Vets';
import NavBar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/Register';
import Login from './pages/Login';
import UsersManagement from './pages/UsersManagement';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/animals" element={<Animals />} />
        <Route path="/vets" element={<Vets />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UsersManagement />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
