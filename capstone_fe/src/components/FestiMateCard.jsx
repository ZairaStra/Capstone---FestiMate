import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Placeholder from "../assets/placeholder.webp";

const FestiMateCard = ({ id, image, title, subtitle, linkPath, initialWishlisted = false, onWishlistToggle }) => {
  const isWishlisted = initialWishlisted;

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onWishlistToggle) onWishlistToggle(id);
  };

  return (
    <Card className="card-festimate border-0 mb-3 shadow rounded position-relative">
      <Link to={`${linkPath}/${id}`}>
        <Card.Img
          variant="top"
          src={image || Placeholder}
          onError={(e) => (e.currentTarget.src = Placeholder)}
          style={{ objectFit: "cover", maxWidth: "100%", height: "20rem" }}
          className="rounded-top"
        />
        {onWishlistToggle && (
          <i
            className={`bi ${isWishlisted ? "bi-heart-fill" : "bi-heart"}`}
            onClick={handleWishlistClick}
            style={{
              position: "absolute",
              top: "0.5rem",
              right: "0.5rem",
              fontSize: "1.8rem",
              color: isWishlisted ? "#ff69b4" : "#fff",
              textShadow: isWishlisted ? "none" : "0 0 2px  #2f4f4f",
              cursor: "pointer",
              zIndex: 10,
            }}
          />
        )}
      </Link>

      <Card.Body>
        <Row>
          <Col className="text-start text-truncate">
            <Link to={`${linkPath}/${id}`} className="card-links">
              <Card.Title>{title}</Card.Title>
            </Link>
          </Col>
          <Col className="text-end text-truncate">
            <Card.Text>{subtitle}</Card.Text>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default FestiMateCard;
