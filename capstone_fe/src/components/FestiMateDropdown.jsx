import { Dropdown } from "react-bootstrap";

const FestiMateDropdown = ({ value, onChange }) => {
  const handleSelect = (genre) => {
    onChange(genre === "ALL" ? "" : genre);
  };

  return (
    <Dropdown className="d-inline mx-2 mb-2">
      <Dropdown.Toggle id="dropdown-autoclose-true" variant="none" className="btn-festimate rounded-pill">
        {value || "Genre"}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={() => handleSelect("ALL")}>All</Dropdown.Item>
        <Dropdown.Item onClick={() => handleSelect("POP")}>POP</Dropdown.Item>
        <Dropdown.Item onClick={() => handleSelect("ROCK")}>ROCK</Dropdown.Item>
        <Dropdown.Item onClick={() => handleSelect("RAP")}>RAP</Dropdown.Item>
        <Dropdown.Item onClick={() => handleSelect("HIPHOP")}>HIPHOP</Dropdown.Item>
        <Dropdown.Item onClick={() => handleSelect("TRAP")}>TRAP</Dropdown.Item>
        <Dropdown.Item onClick={() => handleSelect("INDIE")}>INDIE</Dropdown.Item>
        <Dropdown.Item onClick={() => handleSelect("METAL")}>METAL</Dropdown.Item>
        <Dropdown.Item onClick={() => handleSelect("PUNK")}>PUNK</Dropdown.Item>
        <Dropdown.Item onClick={() => handleSelect("ALTERNATIVE")}>ALTERNATIVE</Dropdown.Item>
        <Dropdown.Item onClick={() => handleSelect("TECHNO")}>TECHNO</Dropdown.Item>
        <Dropdown.Item onClick={() => handleSelect("ELECTRONIC")}>ELECTRONIC</Dropdown.Item>
        <Dropdown.Item onClick={() => handleSelect("JAZZ")}>JAZZ</Dropdown.Item>
        <Dropdown.Item onClick={() => handleSelect("FOLK")}>FOLK</Dropdown.Item>
        <Dropdown.Item onClick={() => handleSelect("ETHNIC")}>ETHNIC</Dropdown.Item>
        <Dropdown.Item onClick={() => handleSelect("REGGAE")}>REGGAE</Dropdown.Item>
        <Dropdown.Item onClick={() => handleSelect("SKA")}>SKA</Dropdown.Item>
        <Dropdown.Item onClick={() => handleSelect("LATIN")}>LATIN</Dropdown.Item>
        <Dropdown.Item onClick={() => handleSelect("AFROBEAT")}>AFROBEAT</Dropdown.Item>
        <Dropdown.Item onClick={() => handleSelect("MEDIEVAL")}>MEDIEVAL</Dropdown.Item>
        <Dropdown.Item onClick={() => handleSelect("EXPERIMENTAL")}>EXPERIMENTAL</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default FestiMateDropdown;
