import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs'; 

const setUser = (user, role) => {
  return {
    type: 'SET_USER',
    payload: { user, role },
  };
};

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
      .then((res) => res.json())
      .then((users) => {
        const user = users.find((u) => u.username === username);

        if (!user) {
          setErrorMessage('Пользователь не найден');
          return;
        }

        bcrypt.compare(password, user.password, (err, result) => {
          if (result) {
            dispatch(setUser(user.username, user.role));
            navigate('/');
          } else {
            setErrorMessage('Неверный пароль');
            console.log(err);
          }
        });
      })
      .catch((err) => {
        console.error('Ошибка при получении пользователей:', err);
        setErrorMessage('Произошла ошибка при входе');
      });
  };

  return (
    <div className="w-full max-w-xs mx-auto mt-10">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg p-6 rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">Вход</h2>

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Имя пользователя"
          className="w-full mb-4 p-2 border border-gray-300 rounded"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          className="w-full mb-4 p-2 border border-gray-300 rounded"
        />

        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">
          Войти
        </button>

        {errorMessage && (
          <p className="text-red-500 text-center mt-4">{errorMessage}</p>
        )}
      </form>
    </div>
  );
}
