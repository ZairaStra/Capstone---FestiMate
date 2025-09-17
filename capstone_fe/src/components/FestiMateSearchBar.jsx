import { useState } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const FestiMateSearchBar = ({ placeholder = "Search...", searchPath }) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`${searchPath}?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <Form onSubmit={handleSearch} className="d-flex mb-3">
      <InputGroup>
        <Form.Control placeholder={placeholder} value={query} onChange={(e) => setQuery(e.target.value)} />
        <Button type="submit" variant="primary" className="btn-festimate">
          Search
        </Button>
      </InputGroup>
    </Form>
  );
};

export default FestiMateSearchBar;
