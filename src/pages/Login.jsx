import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../redux/authSlice'; // Import from renamed authSlice

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email === '' || password === '') {
      setErrorMessage('Пожалуйста, заполните все поля');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || 'Ошибка входа');
        return;
      }

      dispatch(login({ // Dispatch action from authSlice
        token: data.access_token,
        user: data.user.username,
        role: data.user.role,
        email: data.user.email,
      }));

      navigate('/');
    } catch (err) {
      console.error('Ошибка при входе:', err);
      setErrorMessage('Сервер недоступен');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg p-8 rounded-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Вход</h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full mb-5 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          className="w-full mb-6 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-3 rounded-lg transition duration-200 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Войти
        </button>

        {errorMessage && (
          <p className="text-red-500 text-center mt-4">{errorMessage}</p>
        )}
      </form>
    </div>
  );
}
