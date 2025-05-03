// src/pages/Register.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Определение перечисления Role для соответствия с бэкендом
const Role = {
  CLIENT: 'Client'
};

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email,
          password,
          role: Role.CLIENT,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.message || 'Ошибка регистрации');
        return;
      }

      setMsg('Регистрация прошла успешно!');
      setTimeout(() => navigate('/login'), 1000);
    } catch (error) {
      console.error('Ошибка:', error);
      setMsg('Сервер недоступен');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white shadow-lg rounded-lg border border-gray-200">
      <h2 className="text-3xl font-semibold mb-6 text-center text-green-600">Регистрация</h2>
      <form onSubmit={handleRegister} className="space-y-6">
        <div>
          <input
            type="text"
            placeholder="Имя пользователя"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          />
        </div>

        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          />
        </div>

        <div>
          <input
            minLength={8}
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          />
        </div>

        {msg && <p className="text-sm text-red-600 mt-2 text-center">{msg}</p>}

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-300"
        >
          Зарегистрироваться
        </button>

        <p className="text-sm text-center mt-4 text-gray-600">
          Уже есть аккаунт?{' '}
          <a href="/login" className="text-green-600 hover:underline">
            Войти
          </a>
        </p>
      </form>
    </div>
  );
}
