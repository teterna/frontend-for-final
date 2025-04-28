import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function Products() {
  const user = useSelector((state) => state.user);
  const role = user ? user.role : null;

  const [products, setProducts] = useState([]);
  const [formState, setFormState] = useState({
    name: "",
    price: "",
    image: "",
  });
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Ошибка при загрузке продуктов:", err));
  }, []);

  const handleDelete = (id) => {
    if (role !== "seller") {
      alert("У вас нет прав на удаление продукта");
      return;
    }
    if (!window.confirm("Удалить продукт?")) return;

    fetch(`http://localhost:3000/products/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setProducts(products.filter((product) => product.id !== id));
      })
      .catch((err) => console.error("Ошибка при удалении продукта:", err));
  };

  const handleAddProduct = () => {
    if (role !== "seller") {
      alert("У вас нет прав на добавление продукта");
      return;
    }
    if (!formState.name || !formState.price || !formState.image) {
      alert("Пожалуйста, заполните все поля");
      return;
    }

    fetch("http://localhost:3000/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formState),
    })
      .then((res) => res.json())
      .then((addedProduct) => {
        setProducts([...products, addedProduct]);
        setFormState({ name: "", price: "", image: "" });
      })
      .catch((err) => console.error("Ошибка при добавлении продукта:", err));
  };

  const handleEditProduct = (product) => {
    if (role !== "seller") {
      alert("У вас нет прав на редактирование продукта");
      return;
    }

    setEditProduct(product);
    setFormState({
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  const handleUpdateProduct = () => {
    if (!editProduct) return;
    if (!formState.name || !formState.price || !formState.image) {
      alert("Пожалуйста, заполните все поля");
      return;
    }

    fetch(`http://localhost:3000/products/${editProduct.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formState),
    })
      .then((res) => res.json())
      .then((updatedProduct) => {
        setProducts(
          products.map((product) =>
            product.id === updatedProduct.id ? updatedProduct : product
          )
        );
        setEditProduct(null);
        setFormState({ name: "", price: "", image: "" });
      })
      .catch((err) => console.error("Ошибка при обновлении продукта:", err));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-900 mb-6">Продукты</h1>

      {/* Form for adding a new product */}
      {role === "seller" && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-medium text-gray-800 mb-4">Добавить новый продукт</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Название продукта"
              value={formState.name}
              onChange={(e) =>
                setFormState({ ...formState, name: e.target.value })
              }
              className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="number"
              placeholder="Цена"
              value={formState.price}
              onChange={(e) =>
                setFormState({ ...formState, price: e.target.value })
              }
              className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="text"
              placeholder="Ссылка на изображение"
              value={formState.image}
              onChange={(e) =>
                setFormState({ ...formState, image: e.target.value })
              }
              className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleAddProduct}
              className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition duration-300"
            >
              Добавить продукт
            </button>
          </div>
        </div>
      )}

      {/* Form for editing a product */}
      {editProduct && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-medium text-gray-800 mb-4">Редактировать продукт</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Название продукта"
              value={formState.name}
              onChange={(e) =>
                setFormState({ ...formState, name: e.target.value })
              }
              className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="number"
              placeholder="Цена"
              value={formState.price}
              onChange={(e) =>
                setFormState({ ...formState, price: e.target.value })
              }
              className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="text"
              placeholder="Ссылка на изображение"
              value={formState.image}
              onChange={(e) =>
                setFormState({ ...formState, image: e.target.value })
              }
              className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleUpdateProduct}
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Обновить продукт
            </button>
          </div>
        </div>
      )}

      {/* Product list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
              <p className="text-lg text-gray-600">Цена: {product.price} тг.</p>

              {role === "seller" && (
                <div className="mt-4 flex justify-between space-x-4">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition duration-300"
                  >
                    Редактировать
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
                  >
                    Удалить
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
