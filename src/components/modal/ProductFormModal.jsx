import React, { useState, useEffect } from "react";

const ProductFormModal = ({ isOpen, onClose, onSubmit, initialData, categories }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    quantity: "",
    price: "",
    category: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        description: initialData.description || "",
        quantity: initialData.quantity || "",
        price: initialData.price || "",
        category: initialData.categoryId || "", // Sửa lại để khớp với categoryId
      });
    } else {
      setForm({ name: "", description: "", quantity: "", price: "", category: "" }); // Reset khi thêm mới
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, description, quantity, price, category } = form;
    onSubmit({
      name,
      description,
      quantity: Number(quantity),
      price: Number(price),
      categoryId: category, // Đảm bảo gửi categoryId
    });

    onClose(); // Đóng modal sau khi submit
  };

  if (!isOpen) return null; // Không render nếu modal không mở

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white p-6 rounded-lg w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold">
          {initialData ? "Edit Product" : "Create Product"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="w-full px-4 py-2 bg-gray-800 rounded"
            required
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full px-4 py-2 bg-gray-800 rounded"
            required
          />
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            placeholder="Quantity"
            className="w-full px-4 py-2 bg-gray-800 rounded"
            required
          />
          <input
            type="number"
            step="0.01"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full px-4 py-2 bg-gray-800 rounded"
            required
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-800 rounded"
            required
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
              {initialData ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;