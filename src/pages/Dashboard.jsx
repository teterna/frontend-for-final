// Файл: src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchVets } from '../redux/vetSlice'; // Импортируем thunk для ветеринаров
import { fetchProducts } from '../redux/productSlice'; // Импортируем thunk для продуктов
import { fetchAnimals } from '../redux/animalSlice'; // Импортируем thunk для животных

export default function Dashboard() {
  const dispatch = useDispatch();
  const { items: vets, loading: vetsLoading, error: vetsError } = useSelector((state) => state.vets);
  const { items: products, loading: productsLoading, error: productsError } = useSelector((state) => state.products); // Получаем продукты из Redux
  const { items: animals, loading: animalsLoading, error: animalsError } = useSelector((state) => state.animals); // Получаем животных из Redux

  useEffect(() => {
    // Загружаем ветеринаров через Redux
    dispatch(fetchVets());
    dispatch(fetchProducts()); // Загружаем продукты через Redux
    dispatch(fetchAnimals()); // Загружаем животных через Redux
  }, [dispatch]); // Добавляем dispatch в зависимости useEffect

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      
      <h1 className="text-3xl font-bold text-primary mb-6 text-center">Добро пожаловать в наш зоо-магазин!</h1>
      {/* 🐾 Животные */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-primary mb-4">Наши животные</h2>
        {animalsLoading && <p>Загрузка животных...</p>}
        {animalsError && <p className="text-red-500">Ошибка загрузки животных: {animalsError}</p>}
        {!animalsLoading && !animalsError && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {animals.slice(0, 4).map(animal => ( // Отображаем только первых 4 животных
              <div key={animal.id} className="bg-white rounded-xl p-5 shadow-lg border-2 border-gray-200 hover:shadow-2xl transition-all">
                 {animal.image && <img src={animal.image} alt={animal.name} className="w-full h-32 object-cover rounded mb-2" />}
                <h3 className="text-lg font-semibold text-gray-800">{animal.name}</h3>
                <p className="text-gray-600">{animal.type}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 👩‍⚕️ Ветеринары */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-primary mb-4">Наши ветеринары</h2>
        {vetsLoading && <p>Загрузка ветеринаров...</p>}
        {vetsError && <p className="text-red-500">Ошибка загрузки ветеринаров: {vetsError}</p>}
        {!vetsLoading && !vetsError && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {vets.slice(0, 4).map(vet => ( // Отображаем только первых 4 ветеринаров
              <div key={vet.id} className="bg-white rounded-xl p-5 shadow-lg border-2 border-gray-200 hover:shadow-2xl transition-all">
                <h3 className="text-lg font-semibold text-gray-800">{vet.name}</h3>
                <p className="text-gray-600">Специализация: {vet.specialty}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 🛒 Продукты */}
      <section>
        <h2 className="text-2xl font-semibold text-primary mb-4">Популярные продукты</h2>
        {productsLoading && <p>Загрузка продуктов...</p>}
        {productsError && <p className="text-red-500">Ошибка загрузки продуктов: {productsError}</p>}
        {!productsLoading && !productsError && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map(product => ( // Отображаем только первые 4 продукта
              <div key={product.id} className="bg-white rounded-xl p-5 shadow-lg border-2 border-gray-200 hover:shadow-2xl transition-all">
                <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                <p className="text-gray-600">Цена: {product.price}тг</p>
                {/* Можно добавить изображение продукта, если оно есть в данных */}
                {/* {product.image && <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded mt-2" />} */}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
