import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';

export default function Vets() {
  const user = useSelector((state) => state.user);
  const role = user?.role;

  const [vets, setVets] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [newAnimal, setNewAnimal] = useState({ name: '', type: '', vetId: '', image: '' });
  const [editAnimal, setEditAnimal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const vetResponse = await fetch('http://localhost:3000/vets');
      const animalResponse = await fetch('http://localhost:3000/animals');
      if (!vetResponse.ok || !animalResponse.ok) throw new Error('Failed to fetch data');
      const vetData = await vetResponse.json();
      const animalData = await animalResponse.json();
      setVets(vetData);
      setAnimals(animalData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAnimal = useCallback(
    (id) => {
      if (role !== 'vet') {
        alert('У вас нет прав на удаление животного');
        return;
      }
      if (!window.confirm('Удалить животное?')) return;

      fetch(`http://localhost:3000/animals/${id}`, {
        method: 'DELETE',
      }).then(() => {
        setAnimals((animals) => animals.filter((animal) => animal.id !== id));
      });
    },
    [role]
  );

  const handleAddAnimal = useCallback(() => {
    if (role !== 'vet') {
      alert('У вас нет прав на добавление животного');
      return;
    }

    if (!newAnimal.name || !newAnimal.type || !newAnimal.vetId) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    fetch('http://localhost:3000/animals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAnimal),
    })
      .then((res) => res.json())
      .then((addedAnimal) => {
        setAnimals([...animals, addedAnimal]);
        setNewAnimal({ name: '', type: '', vetId: '', image: '' });
      });
  }, [role, newAnimal, animals]);

  const handleEditAnimal = (animal) => {
    if (role !== 'vet') {
      alert('У вас нет прав на редактирование животного');
      return;
    }

    setEditAnimal({ ...animal });
  };

  const handleUpdateAnimal = () => {
    if (!editAnimal) return;

    fetch(`http://localhost:3000/animals/${editAnimal.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editAnimal),
    })
      .then((res) => res.json())
      .then((updatedAnimal) => {
        setAnimals(
          animals.map((animal) => (animal.id === updatedAnimal.id ? updatedAnimal : animal))
        );
        setEditAnimal(null);
      });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-primary mb-6">Наши ветеринары</h1>

      {/* Loading state */}
      {isLoading ? (
        <div className="text-center text-xl text-gray-600">Загрузка...</div>
      ) : error ? (
        <div className="text-center text-xl text-red-500">{error}</div>
      ) : (
        <>
          {/* Список ветеринаров и их животных */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {vets.map((vet) => (
              <div key={vet.id} className="bg-white rounded-2xl shadow-lg p-6 border">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">{vet.name}</h2>
                <p className="text-gray-700 mb-4">Специализация: {vet.specialty}</p>

                <h3 className="text-lg font-semibold mb-3">Пациенты:</h3>
                <div className="space-y-4">
                  {animals
                    .filter((animal) => animal.vetId === vet.id)
                    .map((animal) => (
                      <div key={animal.id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        {animal.image && (
                          <img
                            src={animal.image}
                            alt={animal.name}
                            className="w-16 h-16 object-cover rounded-lg mb-3"
                          />
                        )}
                        <p className="font-medium text-lg">{animal.name}</p>
                        <p className="text-gray-600">Вид: {animal.type}</p>
                        {role === 'vet' && (
                          <div className="mt-3 flex space-x-3">
                            <button
                              onClick={() => handleEditAnimal(animal)}
                              className="bg-yellow-500 text-white px-4 py-2 rounded text-sm hover:bg-yellow-600"
                            >
                              Редактировать
                            </button>
                            <button
                              onClick={() => handleDeleteAnimal(animal.id)}
                              className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600"
                            >
                              Удалить
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>

          {/* Форма для добавления нового животного */}
          {role === 'vet' && (
            <div className="mt-12 bg-white p-6 rounded-2xl shadow-lg border">
              <h2 className="text-2xl font-semibold mb-4">Добавить нового пациента</h2>
              <div className="flex flex-wrap gap-4">
                <input
                  type="text"
                  placeholder="Имя животного"
                  value={newAnimal.name}
                  onChange={(e) => setNewAnimal({ ...newAnimal, name: e.target.value })}
                  className="p-3 border border-gray-300 rounded-lg flex-1"
                />
                <input
                  type="text"
                  placeholder="Вид"
                  value={newAnimal.type}
                  onChange={(e) => setNewAnimal({ ...newAnimal, type: e.target.value })}
                  className="p-3 border border-gray-300 rounded-lg flex-1"
                />
                <input
                  type="text"
                  placeholder="URL изображения"
                  value={newAnimal.image}
                  onChange={(e) => setNewAnimal({ ...newAnimal, image: e.target.value })}
                  className="p-3 border border-gray-300 rounded-lg flex-1"
                />
                <select
                  value={newAnimal.vetId}
                  onChange={(e) => setNewAnimal({ ...newAnimal, vetId: e.target.value })}
                  className="p-3 border border-gray-300 rounded-lg flex-1"
                >
                  <option value="">Выберите ветеринара</option>
                  {vets.map((vet) => (
                    <option key={vet.id} value={vet.id}>
                      {vet.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAddAnimal}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
                >
                  Добавить животное
                </button>
              </div>
            </div>
          )}

          {/* Форма редактирования животного */}
          {editAnimal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">Редактировать животное</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Имя животного"
                    value={editAnimal.name}
                    onChange={(e) => setEditAnimal({ ...editAnimal, name: e.target.value })}
                    className="p-3 border border-gray-300 rounded-lg w-full"
                  />
                  <input
                    type="text"
                    placeholder="Вид"
                    value={editAnimal.type}
                    onChange={(e) => setEditAnimal({ ...editAnimal, type: e.target.value })}
                    className="p-3 border border-gray-300 rounded-lg w-full"
                  />
                  <input
                    type="text"
                    placeholder="URL изображения"
                    value={editAnimal.image || ''}
                    onChange={(e) => setEditAnimal({ ...editAnimal, image: e.target.value })}
                    className="p-3 border border-gray-300 rounded-lg w-full"
                  />
                  <select
                    value={editAnimal.vetId}
                    onChange={(e) => setEditAnimal({ ...editAnimal, vetId: e.target.value })}
                    className="p-3 border border-gray-300 rounded-lg w-full"
                  >
                    {vets.map((vet) => (
                      <option key={vet.id} value={vet.id}>
                        {vet.name}
                      </option>
                    ))}
                  </select>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleUpdateAnimal}
                      className="bg-blue-500 text-white px-6 py-3 rounded-lg flex-1 hover:bg-blue-600"
                    >
                      Сохранить
                    </button>
                    <button
                      onClick={() => setEditAnimal(null)}
                      className="bg-gray-500 text-white px-6 py-3 rounded-lg flex-1 hover:bg-gray-600"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
