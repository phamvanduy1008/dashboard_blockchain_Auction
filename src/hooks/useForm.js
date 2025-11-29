import { useState } from "react";

const useForm = (initialState, validationRules) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationRules[name]) {
      setErrors((prev) => ({ ...prev, [name]: validationRules[name](value) }));
    }
  };

  const handleSubmit = () => {
    const newErrors = {};
    Object.keys(validationRules).forEach((key) => {
      const error = validationRules[key](formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return newErrors;
  };

  return { formData, errors, handleChange, handleSubmit };
};

export default useForm;