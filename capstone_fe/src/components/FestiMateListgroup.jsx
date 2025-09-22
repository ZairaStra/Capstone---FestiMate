import ListGroup from "react-bootstrap/ListGroup";

const FestiMateListgroup = ({ items = [], disabled = false, onItemClick }) => {
  return (
    <ListGroup as="ul" className="festimate-list">
      {items.map((item, index) => (
        <ListGroup.Item
          as="li"
          key={index}
          action={!disabled && !!onItemClick}
          onClick={() => !disabled && onItemClick && onItemClick(item)}
          className={disabled ? "text-muted" : ""}
        >
          {item.label}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default FestiMateListgroup;
