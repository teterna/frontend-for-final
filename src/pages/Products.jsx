import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function Products() {
  const user = useSelector((state) => state.user); 
  const role = user ? user.role : null; 

  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
  });
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const handleDelete = (id) => {
    if (role !== "seller") {
      alert("У вас нет прав на удаление продукта");
      return;
    }
    if (!window.confirm("Удалить продукт?")) return;

    fetch(`http://localhost:3000/products/${id}`, {
      method: "DELETE",
    }).then(() => {
      setProducts(products.filter((product) => product.id !== id));
    });
  };

  const handleAddProduct = () => {
    if (role !== "seller") {
      alert("У вас нет прав на добавление продукта");
      return;
    }

    fetch("http://localhost:3000/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    })
      .then((res) => res.json())
      .then((addedProduct) => {
        setProducts([...products, addedProduct]);
        setNewProduct({ name: "", price: "", image: "" });
      });
  };

  const handleEditProduct = (product) => {
    if (role !== "seller") {
      alert("У вас нет прав на редактирование продукта");
      return;
    }

    setEditProduct(product);
  };

  const handleUpdateProduct = () => {
    if (!editProduct) return;

    fetch(`http://localhost:3000/products/${editProduct.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editProduct),
    })
      .then((res) => res.json())
      .then((updatedProduct) => {
        setProducts(
          products.map((product) =>
            product.id === updatedProduct.id ? updatedProduct : product
          )
        );
        setEditProduct(null);
      });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-primary mb-4">Продукты</h1>

      {/* Форма для добавления нового продукта */}
      {role === "seller" && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Название продукта"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            className="p-2 border border-gray-300 rounded mr-2"
          />
          <input
            type="number"
            placeholder="Цена"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
            className="p-2 border border-gray-300 rounded mr-2"
          />
          <input
            type="text"
            placeholder="Ссылка на изображение"
            value={newProduct.image}
            onChange={(e) =>
              setNewProduct({ ...newProduct, image: e.target.value })
            }
            className="p-2 border border-gray-300 rounded mr-2"
          />
          <button
            onClick={handleAddProduct}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Добавить продукт
          </button>
        </div>
      )}
      {/* Форма редактирования продукта */}
      {editProduct /*  */ && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Редактировать продукт</h2>
          <input
            type="text"
            placeholder="Название продукта"
            value={editProduct.name}
            onChange={(e) =>
              setEditProduct({ ...editProduct, name: e.target.value })
            }
            className="p-2 border border-gray-300 rounded mr-2"
          />
          <input
            type="number"
            placeholder="Цена"
            value={editProduct.price}
            onChange={(e) =>
              setEditProduct({ ...editProduct, price: e.target.value })
            }
            className="p-2 border border-gray-300 rounded mr-2"
          />
          <input
            type="text"
            placeholder="Ссылка на изображение"
            value={editProduct.image}
            onChange={(e) =>
              setEditProduct({ ...editProduct, image: e.target.value })
            }
            className="p-2 border border-gray-300 rounded mr-2"
          />
          <button
            onClick={handleUpdateProduct}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          >
            Обновить продукт
          </button>
        </div>
      )}
      {/* Список продуктов */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-md p-4 border"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-gray-700">Цена: {product.price} тг.</p>

            {role === "seller" && (
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded"
                >
                  Редактировать
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Удалить
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
