import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Modal from '../components/Modal'; // Import Modal component
import { 
  fetchProducts, 
  addProductAsync, 
  updateProductAsync, 
  deleteProductAsync 
} from '../redux/productSlice';
import { fetchCategories } from '../redux/categorySlice'; // Импорт для категорий
import { addProductToCart } from '../redux/cartSlice'; // Импорт для добавления в корзину

export default function Products() {
  const dispatch = useDispatch();
  const { items: products, loading: productsLoading, error: productsError } = useSelector(state => state.products);
  const { items: categories, loading: categoriesLoading, error: categoriesError } = useSelector(state => state.categories); // Получаем категории
  const { user, role, token } = useSelector(state => state.auth); // Получаем роль, токен и пользователя

  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({ id: null, name: '', description: '', price: '', categoryId: '', image: null }); // Добавляем categoryId и image
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories()); // Загружаем категории при монтировании
  }, [dispatch]);

  const handleAddClick = () => {
    if (role !== 'admin' && role !== 'seller') {
      toast.error('У вас нет прав для добавления товаров.');
      return;
    }
    setEditMode(false);
    setCurrentProduct({ id: null, name: '', description: '', price: '', categoryId: categories[0]?.id || '', image: null }); // Устанавливаем первую категорию по умолчанию
    setShowForm(true);
  };

  const handleEditClick = (product) => {
    if (role !== 'admin' && role !== 'seller') {
      toast.error('У вас нет прав для редактирования товаров.');
      return;
    }
    setEditMode(true);
    // Убедимся, что categoryId существует в продукте, иначе установим пустую строку или дефолтное значение
    setCurrentProduct({ ...product, categoryId: product.categoryId || (categories[0]?.id || '') });
    setShowForm(true);
  };

  const handleDeleteClick = (productId) => {
    if (role !== 'admin' && role !== 'seller') {
      toast.error('У вас нет прав для удаления товаров.');
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      return;
    }
    dispatch(deleteProductAsync(productId))
      .unwrap() // Используем unwrap для обработки промиса thunk
      .then(() => {
        toast.success('Товар успешно удален!');
      })
      .catch((error) => {
        toast.error(`Ошибка удаления: ${error}`);
      });
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const openDeleteModal = (productId) => {
    if (role !== 'admin' && role !== 'seller') {
        toast.error('У вас нет прав для удаления товаров.');
        return;
    }
    setProductToDelete(productId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (role !== 'admin' && role !== 'seller') {
      toast.error('У вас нет прав для сохранения товаров.');
      return;
    }

    // Проверка на заполнение обязательных полей
    if (!currentProduct.name || !currentProduct.description || !currentProduct.price || !currentProduct.categoryId) {
        toast.error('Пожалуйста, заполните все обязательные поля (Название, Описание, Цена, Категория).');
        return;
    }

    // Подготовка данных для отправки (без ID для нового продукта)
    const productDataToSend = {
        name: currentProduct.name,
        description: currentProduct.description,
        price: parseFloat(currentProduct.price), // Убедимся, что цена - число
        categoryId: parseInt(currentProduct.categoryId, 10), // Убедимся, что ID категории - число
        // Логика для изображения будет добавлена позже, если необходимо
    };

    const action = editMode
      ? updateProductAsync({ id: currentProduct.id, productData: productDataToSend })
      : addProductAsync(productDataToSend);

    dispatch(action)
      .unwrap()
      .then(() => {
        toast.success(`Товар успешно ${editMode ? 'обновлен' : 'добавлен'}!`);
        setShowForm(false);
      })
      .catch((error) => {
        toast.error(`Ошибка сохранения: ${error}`);
      });
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setCurrentProduct(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setCurrentProduct(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddToCart = (product) => {
    if (!user) {
      toast.error('Пожалуйста, войдите, чтобы добавить товар в корзину.');
      return;
    }
    // Передаем только необходимые данные
    dispatch(addProductToCart({ id: product.id, name: product.name, price: product.price }));
  };

  // Форма добавления/редактирования
  const renderForm = () => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className="relative mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          {editMode ? 'Редактировать товар' : 'Добавить товар'}
        </h3>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Название"
            value={currentProduct.name}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
          <textarea
            name="description"
            placeholder="Описание"
            value={currentProduct.description}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            name="price"
            placeholder="Цена"
            value={currentProduct.price}
            onChange={handleInputChange}
            required
            step="0.01" // Для копеек
            min="0" // Цена не может быть отрицательной
            className="w-full p-2 border rounded"
          />
          {/* Выпадающий список категорий */}
          <select
            name="categoryId"
            value={currentProduct.categoryId}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
            disabled={categoriesLoading}
          >
            <option value="" disabled>-- Выберите категорию --</option>
            {categoriesLoading && <option disabled>Загрузка категорий...</option>}
            {categoriesError && <option disabled>Ошибка загрузки категорий</option>}
            {!categoriesLoading && !categoriesError && categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          {/* Поле для загрузки изображения (пока без функционала загрузки) */}
          {/* <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleInputChange}
            className="w-full p-2 border rounded file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
          />
          {currentProduct.image && typeof currentProduct.image === 'object' && (
            <img src={URL.createObjectURL(currentProduct.image)} alt="Preview" className="mt-2 h-20 w-auto"/>
          )}
          {currentProduct.image && typeof currentProduct.image === 'string' && (
             <p className="text-sm text-gray-500 mt-1">Текущий файл: {currentProduct.image}</p>
          )} */}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary border transition duration-300 bg-green-500 hover:bg-green-600" 
            >
              {editMode ? 'Сохранить изменения' : 'Добавить товар'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Каталог Товаров</h1>
        {(role === 'admin' || role === 'seller') && (
          <button
            onClick={handleAddClick}
            className="bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            + Добавить товар
          </button>
        )}
      </div>

      {productsLoading && <p className="text-center text-gray-600">Загрузка товаров...</p>}
      {productsError && <p className="text-center text-red-500">Ошибка загрузки: {productsError}</p>}

      {!productsLoading && !productsError && products.length === 0 && (
        <p className="text-center text-gray-500">Товары не найдены.</p>
      )}

      {!productsLoading && !productsError && products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-5 flex flex-col justify-between hover:shadow-2xl transition-all">
              <div>
                {/* Отображение изображения, если есть */} 
                {product.image_url && (
                    <img src={product.image_url} alt={product.name} className="w-full h-40 object-cover rounded mb-3" />
                )}
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h2>
                <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                <p className="text-lg font-bold text-primary mb-3">{product.price} тг</p>
                {/* Отображение категории */} 
                {product.category && <p className="text-sm text-gray-500 mb-3">Категория: {product.category.name}</p>}
              </div>
              <div className="mt-4 flex flex-col space-y-2">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition duration-300 text-sm"
                >
                  В корзину
                </button>
                {(role === 'admin' || role === 'seller') && (
                  <div className="flex justify-between space-x-2">
                    <button
                      onClick={() => handleEditClick(product)}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition duration-300 text-xs"
                    >
                      Редакт.
                    </button>
                    <button
                      onClick={() => openDeleteModal(product.id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition duration-300 text-xs"
                    >
                      Удалить
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && renderForm()}

      {/* Модальное окно подтверждения удаления */} 
      <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Подтверждение удаления</h3>
        <p className="text-sm text-gray-500 mb-4">Вы уверены, что хотите удалить этот товар?</p>
        <div className="flex justify-end space-x-2">
          <button onClick={closeDeleteModal} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Отмена</button>
          <button onClick={() => handleDeleteClick(productToDelete)} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Удалить</button>
        </div>
      </Modal>
    </div>
  );
}
