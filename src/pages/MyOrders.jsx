// src/pages/MyOrders.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrdersAsync } from '../redux/orderSlice';
import { Link } from 'react-router-dom'; // Для ссылок на детали заказа

export default function MyOrders() {
  const dispatch = useDispatch();
  const { items: orders, loading, error } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Загружаем заказы только если пользователь авторизован
    if (user?.token) {
      dispatch(fetchOrdersAsync());
    }
  }, [dispatch, user?.token]);

  if (!user) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-xl text-gray-600">Пожалуйста, <Link to="/login" className="text-blue-500 hover:underline">войдите</Link>, чтобы просмотреть свои заказы.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-primary mb-6">Мои Заказы</h1>

      {loading && <p className="text-center text-gray-600">Загрузка заказов...</p>}
      {error && <p className="text-center text-red-500">Ошибка загрузки заказов: {error}</p>}

      {!loading && !error && orders.length === 0 && (
        <p className="text-center text-gray-500">У вас пока нет заказов.</p>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Заказ #{order.id}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium 
                  ${order.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                  order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 
                  'bg-yellow-100 text-yellow-800'}`}>
                  {order.status}
                </span>
              </div>
              <p className="text-gray-600 mb-2">Дата заказа: {new Date(order.order_date).toLocaleDateString()}</p>
              <p className="text-gray-800 font-medium mb-4">Сумма: {order.total_amount} тг</p>

              {/* Детали продуктов */}
              {order.products && order.products.length > 0 && (
                <div className="mb-3">
                  <h4 className="font-semibold text-gray-700 mb-1">Товары:</h4>
                  <ul className="list-disc list-inside pl-4 text-sm text-gray-600">
                    {order.products.map(p => (
                      <li key={p.id}>{p.name} (x{p.quantity}) - {p.price} тг</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Детали питомцев */}
              {order.pets && order.pets.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1">Питомцы:</h4>
                  <ul className="list-disc list-inside pl-4 text-sm text-gray-600">
                    {order.pets.map(pet => (
                      <li key={pet.id}>{pet.name} ({pet.species}) - {pet.price} тг</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Можно добавить ссылку на страницу деталей заказа, если она будет */}
              {/* <Link to={`/orders/${order.id}`} className="text-blue-500 hover:underline mt-4 inline-block">Подробнее</Link> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}