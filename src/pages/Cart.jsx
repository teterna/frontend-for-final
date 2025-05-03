// src/pages/Cart.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  removeProductFromCart,
  updateProductQuantity,
  removePetFromCart,
  clearCart,
  selectCartProducts,
  selectCartPets,
  selectCartTotalItems,
  selectCartTotalPrice,
} from '../redux/cartSlice';
import { createOrderAsync } from '../redux/orderSlice'; // Импорт для создания заказа

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector(selectCartProducts);
  const pets = useSelector(selectCartPets);
  const totalItems = useSelector(selectCartTotalItems);
  const totalPrice = useSelector(selectCartTotalPrice);
  const { user } = useSelector((state) => state.auth);
  const { loading: orderLoading } = useSelector((state) => state.orders); // Получаем статус загрузки заказа

  const handleQuantityChange = (productId, newQuantity) => {
    const quantity = parseInt(newQuantity, 10);
    if (!isNaN(quantity)) {
      dispatch(updateProductQuantity({ productId, quantity }));
    }
  };

  const handleCreateOrder = () => {
    if (!user) {
      toast.error('Пожалуйста, войдите, чтобы оформить заказ.');
      navigate('/login');
      return;
    }

    if (products.length === 0 && pets.length === 0) {
      toast.warn('Ваша корзина пуста.');
      return;
    }

    const orderData = {
      products: products.map(p => ({ id: p.id, quantity: p.quantity })),
      pets: pets.map(p => p.id),
    };

    dispatch(createOrderAsync(orderData))
      .unwrap()
      .then((result) => {
        toast.success(result.message || 'Заказ успешно создан!');
        dispatch(clearCart()); // Очищаем корзину после успешного заказа
        navigate('/my-orders'); // Перенаправляем на страницу заказов
      })
      .catch((error) => {
        // Ошибка уже обработана в thunk с помощью toast
        console.error('Order creation failed:', error);
      });
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-primary mb-6">Корзина</h1>

      {totalItems === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-500 mb-4">Ваша корзина пуста.</p>
          <Link to="/products" className="text-blue-500 hover:underline">
            Перейти к покупкам
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Список товаров и питомцев */} 
          <div className="lg:col-span-2 space-y-4">
            {/* Товары */} 
            {products.length > 0 && (
              <div className="bg-white p-4 rounded-lg shadow border">
                <h2 className="text-xl font-semibold mb-3 text-gray-700">Товары</h2>
                {products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between border-b py-3 last:border-b-0">
                    <div>
                      <p className="font-medium text-gray-800">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.price} $</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="number"
                        min="1"
                        value={product.quantity}
                        onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                        className="w-16 p-1 border rounded text-center"
                      />
                      <button
                        onClick={() => dispatch(removeProductFromCart(product.id))}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Питомцы */} 
            {pets.length > 0 && (
              <div className="bg-white p-4 rounded-lg shadow border mt-4">
                <h2 className="text-xl font-semibold mb-3 text-gray-700">Питомцы</h2>
                {pets.map((pet) => (
                  <div key={pet.id} className="flex items-center justify-between border-b py-3 last:border-b-0">
                    <div>
                      <p className="font-medium text-gray-800">{pet.name} <span className="text-sm text-gray-500">({pet.species})</span></p>
                      <p className="text-sm text-gray-600">{pet.price} $</p>
                    </div>
                    <button
                      onClick={() => dispatch(removePetFromCart(pet.id))}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Удалить
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Итоги и оформление заказа */} 
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow border sticky top-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Итог заказа</h2>
              <div className="flex justify-between mb-2 text-gray-600">
                <span>Количество товаров:</span>
                <span>{products.reduce((sum, p) => sum + p.quantity, 0)}</span>
              </div>
              <div className="flex justify-between mb-2 text-gray-600">
                <span>Количество питомцев:</span>
                <span>{pets.length}</span>
              </div>
              <div className="flex justify-between mb-4 text-gray-800 font-semibold text-lg border-t pt-3 mt-3">
                <span>Общая сумма:</span>
                <span>{totalPrice.toFixed(2)} $</span>
              </div>
              <button
                onClick={handleCreateOrder}
                disabled={orderLoading}
                className={`w-full py-3 px-4 rounded text-white font-semibold transition duration-300 
                  ${orderLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-secondary'}`}
              >
                {orderLoading ? 'Оформление...' : 'Оформить заказ'}
              </button>
              <button
                onClick={() => dispatch(clearCart())}
                className="w-full mt-3 py-2 px-4 rounded text-red-600 border border-red-300 hover:bg-red-50 transition duration-300 text-sm"
              >
                Очистить корзину
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}