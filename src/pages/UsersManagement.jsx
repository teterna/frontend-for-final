// src/pages/UsersManagement.jsx
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import bcrypt from 'bcryptjs';

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'client' });
  const [roles] = useState(['admin', 'client', 'vet', 'seller']);
  const currentUser = useSelector(state => state.user?.user);

  useEffect(() => {
    fetch('http://localhost:3000/users')
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();

    // Хешируем пароль перед отправкой
    const hashedPassword = await bcrypt.hash(newUser.password, 10);

    // Отправляем данные с хешированным паролем
    fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newUser, password: hashedPassword }),
    })
      .then(res => res.json())
      .then(data => {
        setUsers([...users, data]);
        setNewUser({ username: '', password: '', role: 'client' });
      })
      .catch(err => alert('Ошибка при добавлении пользователя'));
  };

  const handleRoleChange = (id, newRole) => {
    if (currentUser.role !== 'admin') {
      alert('Только администратор может изменять роль пользователей!');
      return;
    }

    if (newRole === 'admin') {
      alert('Невозможно изменить роль на админ!');
      return;
    }

    fetch(`http://localhost:3000/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole })
    }).then(() => {
      setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Удалить пользователя?")) return;

    fetch(`http://localhost:3000/users/${id}`, {
      method: 'DELETE'
    }).then(() => {
      setUsers(users.filter(u => u.id !== id));
    });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold text-center text-green-600 mb-6">Управление пользователями</h1>

      {/* Форма для добавления нового пользователя */}
      <form onSubmit={handleAddUser} className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Имя"
            value={newUser.username}
            onChange={e => setNewUser({ ...newUser, username: e.target.value })}
            className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <div className="mb-4">
          <input
            minLength={8}
            type="password"
            placeholder="Пароль"
            value={newUser.password}
            onChange={e => setNewUser({ ...newUser, password: e.target.value })}
            className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <div className="mb-4">
          <select
            value={newUser.role}
            onChange={e => setNewUser({ ...newUser, role: e.target.value })}
            className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-green-500"
          >
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-3 rounded-lg w-full hover:bg-green-700 transition duration-300"
        >
          Добавить пользователя
        </button>
      </form>

      {/* Таблица пользователей */}
      <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
        <thead className="bg-green-200">
          <tr>
            <th className="border p-3 text-left">ID</th>
            <th className="border p-3 text-left">Имя</th>
            <th className="border p-3 text-left">Роль</th>
            <th className="border p-3 text-left">Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-t">
              <td className="border p-3">{user.id}</td>
              <td className="border p-3">{user.username}</td>
              <td className="border p-3">
                <select
                  value={user.role}
                  onChange={e => handleRoleChange(user.id, e.target.value)}
                  className="p-2 rounded-lg focus:ring-2 focus:ring-green-500"
                  disabled={user.role === 'admin' || user.id === currentUser.id || currentUser.role !== 'admin'}
                >
                  {roles.filter(role => role !== 'admin').map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </td>
              <td className="border p-3">
                <button
                  onClick={() => handleDelete(user.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
