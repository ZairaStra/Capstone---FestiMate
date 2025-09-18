import { useState, useEffect } from "react";
import { Form } from "react-bootstrap";

const FestiMateSearchbar = ({ placeholder = "Search...", value, onChange, onSearch }) => {
  const [internalValue, setInternalValue] = useState(value || "");

  useEffect(() => {
    if (value !== undefined) setInternalValue(value);
  }, [value]);

  const handleChange = (e) => {
    const val = e.target.value;
    if (onChange) onChange(val);
    if (value === undefined) setInternalValue(val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = (value !== undefined ? value : internalValue).trim();
    if (!query) return;
    if (onSearch) onSearch(query);
  };

  return (
    <Form onSubmit={handleSubmit} className="d-flex mb-3">
      <Form.Control className="py-3" placeholder={placeholder} value={value !== undefined ? value : internalValue} onChange={handleChange} />
    </Form>
  );
};

export default FestiMateSearchbar;
