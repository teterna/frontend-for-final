import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LogoutButton from './LogoutButton';

export default function NavBar() {
  const { user = null, role = '' } = useSelector((state) => state.user || {});

  return (
    <nav className="bg-green-600 shadow-md p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-6">
          <Link to="/" className="font-semibold text-lg hover:text-green-300 transition duration-200">Главная</Link>
          <Link to="/products" className="font-semibold text-lg hover:text-green-300 transition duration-200">Продукты</Link>
          <Link to="/animals" className="font-semibold text-lg hover:text-green-300 transition duration-200">Животные</Link>
          <Link to="/vets" className="font-semibold text-lg hover:text-green-300 transition duration-200">Ветеринары</Link>

          {role === 'admin' && (
            <Link to="/users" className="font-semibold text-lg hover:text-green-300 transition duration-200">Пользователи</Link>
          )}
        </div>

        <div className="flex space-x-6">
          {!user ? (
            <>
              <Link to="/login" className="font-semibold text-lg hover:text-green-300 transition duration-200">Вход</Link>
              <Link to="/register" className="font-semibold text-lg hover:text-green-300 transition duration-200">Регистрация</Link>
            </>
          ) : (
            <LogoutButton />
          )}
        </div>
      </div>
    </nav>
  );
}
