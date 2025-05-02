// src/components/Navbar.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { selectCartTotalItems } from '../redux/cartSlice'; // Импорт селектора для количества товаров в корзине

export default function NavBar() {
  const { user } = useSelector((state) => state.auth);
  const totalCartItems = useSelector(selectCartTotalItems); // Получаем количество товаров в корзине
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
<nav className="bg-green-800 shadow-md">
<div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <NavLink to="/" className="text-2xl font-bold text-white hover:text-gray-200">
          ЗооМагазин
        </NavLink>
        <div className="flex items-center space-x-4">
          <NavLink to="/" className={({ isActive }) => 
            `text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-secondary' : ''}`
          }>
            Главная
          </NavLink>
          <NavLink to="/products" className={({ isActive }) => 
            `text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-secondary' : ''}`
          }>
            Товары
          </NavLink>
          <NavLink to="/animals" className={({ isActive }) => 
            `text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-secondary' : ''}`
          }>
            Животные
          </NavLink>
          <NavLink to="/vets" className={({ isActive }) => 
            `text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-secondary' : ''}`
          }>
            Ветеринары
          </NavLink>
          {user && (user.role === 'admin' || user.role === 'owner') && (
            <NavLink to="/users" className={({ isActive }) => 
              `text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-secondary' : ''}`
            }>
              Пользователи
            </NavLink>
          )}
          {user && (
            <NavLink to="/my-orders" className={({ isActive }) => 
              `text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-secondary' : ''}`
            }>
              Мои заказы
            </NavLink>
          )}
          {user && (
            <NavLink to="/my-appointments" className={({ isActive }) => 
              `text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-secondary' : ''}`
            }>
              Мои записи
            </NavLink>
          )}
          {user && (
            <NavLink to="/chat" className={({ isActive }) => 
              `text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-secondary' : ''}`
            }>
              Чат
            </NavLink>
          )}
          {/* Ссылка на корзину */} 
          <NavLink to="/cart" className={({ isActive }) => 
            `relative text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-secondary' : ''}`
          }>
            Корзина
            {totalCartItems > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                {totalCartItems}
              </span>
            )}
          </NavLink>
          {user ? (
            <button 
              onClick={handleLogout} 
              className="text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Выйти ({user.username})
            </button>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => 
                `text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-secondary' : ''}`
              }>
                Войти
              </NavLink>
              <NavLink to="/register" className={({ isActive }) => 
                `text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-secondary' : ''}`
              }>
                Регистрация
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
