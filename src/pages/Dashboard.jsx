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
    <div className="p-6">
      <h1 className="text-2xl font-bold text-primary mb-4">Добро пожаловать в наш зоо-магазин!</h1>

      {/* 🐾 Животные */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-primary mb-2">Наши животные</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {animals.map(animal => (
            <div key={animal.id} className="bg-white rounded-2xl p-4 shadow-md border">
              <h3 className="text-lg font-semibold">{animal.name}</h3>
              <p>{animal.type}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 👩‍⚕️ Ветеринары */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-primary mb-2">Наши ветеринары</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {vets.map(vet => (
            <div key={vet.id} className="bg-white rounded-2xl p-4 shadow-md border">
              <h3 className="text-lg font-semibold">{vet.name}</h3>
              <p>Специализация: {vet.specialty}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🛒 Продукты */}
      <section>
        <h2 className="text-xl font-semibold text-primary mb-2">Популярные продукты</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-2xl p-4 shadow-md border">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p>Цена: {product.price}тг</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
