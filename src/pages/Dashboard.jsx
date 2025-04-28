import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [animals, setAnimals] = useState([]);
  const [vets, setVets] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/animals')
      .then(res => res.json())
      .then(data => setAnimals(data.slice(0, 4)));

    fetch('http://localhost:3000/vets')
      .then(res => res.json())
      .then(data => setVets(data.slice(0, 4)));

    fetch('http://localhost:3000/products')
      .then(res => res.json())
      .then(data => setProducts(data.slice(0, 4)));
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-primary mb-6 text-center">Добро пожаловать в наш зоо-магазин!</h1>

      {/* 🐾 Животные */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-primary mb-4">Наши животные</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {animals.map(animal => (
            <div key={animal.id} className="bg-white rounded-xl p-5 shadow-lg border-2 border-gray-200 hover:shadow-2xl transition-all">
              <h3 className="text-lg font-semibold text-gray-800">{animal.name}</h3>
              <p className="text-gray-600">{animal.type}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 👩‍⚕️ Ветеринары */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-primary mb-4">Наши ветеринары</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vets.map(vet => (
            <div key={vet.id} className="bg-white rounded-xl p-5 shadow-lg border-2 border-gray-200 hover:shadow-2xl transition-all">
              <h3 className="text-lg font-semibold text-gray-800">{vet.name}</h3>
              <p className="text-gray-600">Специализация: {vet.specialty}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🛒 Продукты */}
      <section>
        <h2 className="text-2xl font-semibold text-primary mb-4">Популярные продукты</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-xl p-5 shadow-lg border-2 border-gray-200 hover:shadow-2xl transition-all">
              <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
              <p className="text-gray-600">Цена: {product.price}тг</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
