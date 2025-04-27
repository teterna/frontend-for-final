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
    <div className="p-6">
      <h1 className="text-2xl font-bold text-primary mb-4">Наши животные</h1>
      
      <div className="mb-6">
        <select
          value={selectedVet}
          onChange={(e) => setSelectedVet(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">Все животные</option>
          {vets.map(vet => (
            <option key={vet.id} value={vet.id}>{vet.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAnimals.map(animal => {
          const assignedVet = vets.find(vet => vet.id === animal.vetId);
          return (
            <div key={animal.id} className="bg-white rounded-2xl shadow-md p-4 border">
              <img
                src={animal.image}
                alt={animal.name}
                className="w-full h-64 object-cover rounded-md mb-4"
              />
              <h2 className="text-lg font-semibold">{animal.name}</h2>
              <p className="text-gray-700">Тип: {animal.type}</p>
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
                    className="mt-2 p-2 border border-gray-300 rounded w-full"
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
