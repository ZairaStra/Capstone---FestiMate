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
          className={disabled ? "text-muted fs-3" : " fs-5"}
        >
          {item.label}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default FestiMateListgroup;
