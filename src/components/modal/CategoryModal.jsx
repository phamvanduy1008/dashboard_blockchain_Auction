import React, { useState, useEffect } from "react";
import { X } from "lucide-react"; 

const CategoryModal = ({
  isOpen,
  onClose,
  onSave,
  initialData = { name: "", description: "" },
  mode = "add", // "add" hoặc "edit"
}) => {
  const [formData, setFormData] = useState(initialData);

  // Cập nhật formData khi initialData thay đổi (dành cho edit)
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); // Gửi dữ liệu form lên parent
    setFormData({ name: "", description: "" }); // Reset form
    onClose(); // Đóng modal
  };

  // Chỉ render khi isOpen là true
  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white text-gray-900 rounded-xl p-6 w-full max-w-md relative shadow-2xl">
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition-colors duration-200"
            onClick={onClose}
          >
            <X size={20} />
          </button>
          <h2 className="text-xl font-bold mb-6 text-gray-800 text-center">
            {mode === "add" ? "Thêm danh mục mới" : "Chỉnh sửa danh mục"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên danh mục
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                rows={4}
                required
              ></textarea>
            </div>
            <div className="text-right">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-md transition-colors duration-200"
              >
                {mode === "add" ? "Lưu" : "Cập nhật"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default CategoryModal;