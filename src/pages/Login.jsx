import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';
import { login } from '../redux/userSlice';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username === '' || password === '') {
      setErrorMessage('Пожалуйста, заполните все поля');
      return;
    }

    fetch('http://localhost:3000/users')
      .then(res => res.json())
      .then(users => {
        const user = users.find(u => u.username === username);

        if (!user) {
          setErrorMessage('Пользователь не найден');
          return;
        }

        bcrypt.compare(password, user.password, (err, result) => {
          if (err) {
            console.error('Ошибка сравнения паролей:', err);
            setErrorMessage('Ошибка входа');
            return;
          }

          if (result) {
            dispatch(login({ user: user.username, role: user.role }));
            navigate('/');
          } else {
            setErrorMessage('Неверный пароль');
          }
        });
      })
      .catch(err => {
        console.error('Ошибка при получении пользователей:', err);
        setErrorMessage('Произошла ошибка при входе');
      });
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg p-8 rounded-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Вход</h2>

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Имя пользователя"
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
