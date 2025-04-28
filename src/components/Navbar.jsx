import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import LogoutButton from './LogoutButton';

export default function NavBar() {
  const { user = null, role = '' } = useSelector((state) => state.user || {});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className="bg-green-600 shadow-md p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo or brand (optional) */}
        <div className="text-xl font-semibold">
          <Link to="/" className="hover:text-green-300 transition duration-200" aria-label="Перейти на главную">
            ZOO Store
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="font-semibold text-lg hover:text-green-300 transition duration-200" aria-label="Перейти на главную">Главная</Link>
          <Link to="/products" className="font-semibold text-lg hover:text-green-300 transition duration-200" aria-label="Перейти к продуктам">Продукты</Link>
          <Link to="/animals" className="font-semibold text-lg hover:text-green-300 transition duration-200" aria-label="Перейти к животным">Животные</Link>
          <Link to="/vets" className="font-semibold text-lg hover:text-green-300 transition duration-200" aria-label="Перейти к ветеринарам">Ветеринары</Link>

          {role === 'admin' && (
            <Link to="/users" className="font-semibold text-lg hover:text-green-300 transition duration-200" aria-label="Перейти к пользователям">Пользователи</Link>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <button
          className="md:hidden text-2xl"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
        >
          {isMobileMenuOpen ? '×' : '☰'}
        </button>

        {/* Mobile Links */}
        {isMobileMenuOpen && (
          <div className="absolute top-16 left-0 w-full bg-green-600 p-4 flex flex-col items-center space-y-4 md:hidden">
            <Link to="/" className="font-semibold text-lg text-white hover:text-green-300 transition duration-200" aria-label="Перейти на главную">Главная</Link>
            <Link to="/products" className="font-semibold text-lg text-white hover:text-green-300 transition duration-200" aria-label="Перейти к продуктам">Продукты</Link>
            <Link to="/animals" className="font-semibold text-lg text-white hover:text-green-300 transition duration-200" aria-label="Перейти к животным">Животные</Link>
            <Link to="/vets" className="font-semibold text-lg text-white hover:text-green-300 transition duration-200" aria-label="Перейти к ветеринарам">Ветеринары</Link>

            {role === 'admin' && (
              <Link to="/users" className="font-semibold text-lg text-white hover:text-green-300 transition duration-200" aria-label="Перейти к пользователям">Пользователи</Link>
            )}

            {!user ? (
              <>
                <Link to="/login" className="font-semibold text-lg text-white hover:text-green-300 transition duration-200" aria-label="Перейти на страницу входа">Вход</Link>
                <Link to="/register" className="font-semibold text-lg text-white hover:text-green-300 transition duration-200" aria-label="Перейти на страницу регистрации">Регистрация</Link>
              </>
            ) : (
              <LogoutButton />
            )}
          </div>
        )}

        {/* Desktop User Links */}
        <div className="hidden md:flex space-x-6">
          {!user ? (
            <>
              <Link to="/login" className="font-semibold text-lg hover:text-green-300 transition duration-200" aria-label="Перейти на страницу входа">Вход</Link>
              <Link to="/register" className="font-semibold text-lg hover:text-green-300 transition duration-200" aria-label="Перейти на страницу регистрации">Регистрация</Link>
            </>
          ) : (
            <LogoutButton />
          )}
        </div>
      </div>
    </nav>
  );
}
