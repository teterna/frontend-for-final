import { useState, useEffect } from 'react';

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'client' });
  const [roles] = useState(['admin', 'client', 'vet', 'seller']);

  useEffect(() => {
    fetch('http://localhost:3000/users')
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  const handleAddUser = (e) => {
    e.preventDefault();
    fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    }).then(res => res.json())
      .then(data => {
        setUsers([...users, data]);
        setNewUser({ username: '', password: '', role: 'client' });
      });
  };

  const handleRoleChange = (id, newRole) => {
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
    <div className="p-6">
      <h1 className="text-2xl font-bold text-primary mb-4">Управление пользователями</h1>

      {/* Форма для добавления нового пользователя */}
      <form onSubmit={handleAddUser} className="mb-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Имя"
            value={newUser.username}
            onChange={e => setNewUser({ ...newUser, username: e.target.value })}
            className="border p-2 rounded w-full"
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
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <div className="mb-4">
          <select
            value={newUser.role}
            onChange={e => setNewUser({ ...newUser, role: e.target.value })}
            className="border p-2 rounded w-full"
          >
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Добавить пользователя
        </button>
      </form>

      {/* Таблица пользователей */}
      <table className="min-w-full border mb-[100px]">
        <thead className="bg-green-100">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Имя</th>
            <th className="border p-2">Роль</th>
            <th className="border p-2">Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="text-center">
              <td className="border p-2">{user.id}</td>
              <td className="border p-2">{user.username}</td>
              <td className="border p-2">
                <select
                  value={user.role}
                  onChange={e => handleRoleChange(user.id, e.target.value)}
                  className="p-1 rounded "
                >
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </td>
              <td className="border p-2">
                <button
                  onClick={() => handleDelete(user.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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
