import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnimals, deleteAnimalAsync } from '../redux/animalSlice';
import { addPetToCart } from '../redux/cartSlice'; // Импорт для добавления в корзину
import { toast } from 'react-toastify'; // Для уведомлений

export default function Animals() {
  const dispatch = useDispatch();
  const { items: animals, loading, error } = useSelector(state => state.animals);
  const { user, role } = useSelector(state => state.auth); // Получаем пользователя и роль

  useEffect(() => {
    dispatch(fetchAnimals());
  }, [dispatch]);

  const handleDelete = (id) => {
    // Проверка прав доступа (например, только админ или владелец)
    if (role !== 'admin' && role !== 'owner') {
        toast.error('У вас нет прав для удаления питомцев.');
        return;
    }
    if (window.confirm('Удалить питомца?')) {
      dispatch(deleteAnimalAsync(id))
        .unwrap()
        .then(() => toast.success('Питомец успешно удален!'))
        .catch((err) => toast.error(`Ошибка удаления: ${err}`));
    }
  };

  const handleAddToCart = (pet) => {
    if (!user) {
      toast.error('Пожалуйста, войдите, чтобы добавить питомца в корзину.');
      return;
    }
    // Передаем необходимые данные питомца
    dispatch(addPetToCart({ id: pet.id, name: pet.name, species: pet.species, price: pet.price }));
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-primary mb-6">Наши Питомцы</h1>

      {loading && <p className="text-center text-gray-600">Загрузка питомцев...</p>}
      {error && <p className="text-center text-red-500">Ошибка загрузки: {error}</p>}

      {!loading && !error && animals.length === 0 && <p className="text-center text-gray-500">Питомцы не найдены.</p>}

      {!loading && !error && animals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {animals.map(pet => (
            <div key={pet.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-5 flex flex-col justify-between hover:shadow-2xl transition-all">
              <div>
                {pet.image_url && (
                  <img
                    src={pet.image_url}
                    alt={pet.name}
                    className="w-full h-48 object-cover rounded mb-3"
                  />
                )}
                <h2 className="text-xl font-semibold text-gray-800 mb-1">{pet.name}</h2>
                <p className="text-sm text-gray-600">Вид: {pet.species}</p>
                {pet.breed && <p className="text-sm text-gray-600">Порода: {pet.breed}</p>}
                {pet.age !== null && <p className="text-sm text-gray-600">Возраст: {pet.age} лет</p>}
                <p className="text-lg font-bold text-primary mt-2 mb-3">{pet.price} тг</p>
                {pet.description && <p className="text-sm text-gray-700 mb-3">{pet.description}</p>}
              </div>

              <div className="mt-auto flex flex-col space-y-2">
                 <button
                    onClick={() => handleAddToCart(pet)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition duration-300 text-sm"
                  >
                    В корзину
                  </button>
                {(role === 'admin' || role === 'owner') && (
                  <button
                    onClick={() => handleDelete(pet.id)}
                    className="w-full bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition duration-300 text-xs"
                  >
                    Удалить
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
