import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice'; // Обновляем импорт
import { useNavigate } from 'react-router-dom';

export default function LogoutButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector(state => state.auth.token); // Обновляем селектор

  const handleLogout = async () => {
    try {
      const res = await fetch('http://localhost:5000/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // передаём токен
        },
      });

      if (res.ok) {
        dispatch(logout());
        navigate('/');
      } else {
        const data = await res.json();
        console.error('Ошибка при выходе:', data.message);
      }
    } catch (err) {
      console.error('Ошибка соединения при выходе:', err);
    }
  };

  return (
    <button onClick={handleLogout} className="hover:underline">
      Выйти
    </button>
  );
}
