import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function Animals() {
  const [animals, setAnimals] = useState([]);
  const [vets, setVets] = useState([]);
  const [selectedVet, setSelectedVet] = useState('');
  const user = useSelector((state) => state.user);
  const role = user?.role;

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3000/animals').then(res => res.json()),
      fetch('http://localhost:3000/vets').then(res => res.json())
    ]).then(([animalsData, vetsData]) => {
      setAnimals(animalsData);
      setVets(vetsData);
    });
  }, []);

  const handleAssignVet = async (animalId, vetId) => {
    if (role !== 'vet' && role !== 'admin') {
      alert('У вас нет прав на назначение ветеринара');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/animals/${animalId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vetId })
      });
      const updatedAnimal = await response.json();
      setAnimals(animals.map(animal =>
        animal.id === animalId ? updatedAnimal : animal
      ));
    } catch (error) {
      console.error('Error assigning vet:', error);
      alert('Ошибка при назначении ветеринара');
    }
  };

  const filteredAnimals = selectedVet
    ? animals.filter(animal => animal.vetId === selectedVet)
    : animals;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-primary mb-6 text-center">Наши животные</h1>
      
      <div className="mb-6 text-center">
        <select
          value={selectedVet}
          onChange={(e) => setSelectedVet(e.target.value)}
          className="p-3 border-2 border-gray-300 rounded-lg text-gray-700 shadow-md focus:outline-none focus:ring-2 focus:ring-primary transition-all"
        >
          <option value="">Все животные</option>
          {vets.map(vet => (
            <option key={vet.id} value={vet.id}>{vet.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAnimals.map(animal => {
          const assignedVet = vets.find(vet => vet.id === animal.vetId);
          return (
            <div key={animal.id} className="bg-white rounded-lg shadow-xl p-5 border-2 border-gray-200 hover:shadow-2xl transition-all">
              <img
                src={animal.image}
                alt={animal.name}
                className="w-full h-56 object-cover rounded-md mb-4"
              />
              <h2 className="text-xl font-semibold text-gray-800">{animal.name}</h2>
              <p className="text-gray-600">Тип: {animal.type}</p>
              <div className="mt-3">
                {assignedVet ? (
                  <p className="text-sm text-gray-600">Ветеринар: {assignedVet.name}</p>
                ) : (
                  <p className="text-sm text-gray-600">Ветеринар не назначен</p>
                )}
                {(role === 'vet' || role === 'admin') && (
                  <select
                    value={animal.vetId || ''}
                    onChange={(e) => handleAssignVet(animal.id, e.target.value)}
                    className="mt-3 p-3 border-2 border-gray-300 rounded-lg w-full text-gray-700 shadow-md focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  >
                    <option value="">Выберите ветеринара</option>
                    {vets.map(vet => (
                      <option key={vet.id} value={vet.id}>{vet.name}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
