import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Placeholder from "../assets/placeholder.jpg";

const FestiMateCard = ({ id, image, title, subtitle, linkPath }) => {
  return (
    <Card className="card-festimate mb-3 shadow-sm rounded border-0">
      <Link to={`${linkPath}/${id}`}>
        <Card.Img
          variant="top"
          src={image || Placeholder}
          onError={(e) => (e.currentTarget.src = Placeholder)}
          style={{ objectFit: "cover", maxWidth: "100%", height: "20rem" }}
          className="rounded-top"
        />
      </Link>

      <Card.Body>
        <Row>
          <Col className="text-start text-truncate">
            <Link to={`${linkPath}/${id}`} className="links">
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
