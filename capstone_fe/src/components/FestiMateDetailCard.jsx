import { Card, Col, Row } from "react-bootstrap";
import Placeholder from "../assets/placeholder.webp";
import FestiMateButton from "./FestiMateButton";

const FestiMateDetailCard = ({ id, coverImg, text1, text2, text3, buttonText, onButtonClick, initialWishlisted = false, onWishlistToggle }) => {
  const isWishlisted = initialWishlisted;

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onWishlistToggle) onWishlistToggle(id);
  };

  return (
    <Card className="my-5 rounded card-festimate position-relative">
      {coverImg && (
        <Card.Img
          variant="top"
          src={coverImg || Placeholder}
          onError={(e) => (e.currentTarget.src = Placeholder)}
          style={{ maxHeight: "30rem", objectFit: "cover" }}
        />
      )}

      {onWishlistToggle && (
        <div
          onClick={handleWishlistClick}
          style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            cursor: "pointer",
            fontSize: "2rem",
            color: isWishlisted ? "#ff69b4" : "#fff",
            textShadow: isWishlisted ? "none" : "0 0 4px #2f4f4f",
            zIndex: 10,
          }}
        >
          <i className={`bi ${isWishlisted ? "bi-heart-fill" : "bi-heart"}`} />
        </div>
      )}

      <Card.Body>
        <Row className="align-items-center">
          <Col className="text-start">
            {text1 && <Card.Title className="display-4">{text1}</Card.Title>}
            {text2 && <Card.Text>{text2}</Card.Text>}
            {text3 && <Card.Text>{text3}</Card.Text>}
          </Col>
          <Col className="text-end">
            {buttonText && onButtonClick && (
              <FestiMateButton className="btn btn-primary" onClick={onButtonClick}>
                {buttonText}
              </FestiMateButton>
            )}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default FestiMateDetailCard;
