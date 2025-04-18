import { useDispatch } from 'react-redux';
import { logout } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';

export default function LogoutButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    window.location.reload();
    navigate('/');
  };

  return (
    <button onClick={handleLogout} className="hover:underline">
      Выйти
    </button>
  );
}
