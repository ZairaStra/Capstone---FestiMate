import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Col, Row } from "react-bootstrap";
import Placeholder from "../assets/placeholder.webp";

const FestiMateDetailCard = ({ coverImg, text1, text2, text3, buttonText, onButtonClick }) => {
  return (
    <Card className="my-5 rounded border-0 card-festimate">
      {coverImg && (
        <Card.Img
          variant="top"
          src={coverImg || Placeholder}
          onError={(e) => (e.currentTarget.src = Placeholder)}
          style={{ maxHeight: "30rem", objectFit: "cover" }}
        />
      )}
      <Card.Body>
        <Row className="align-items-center">
          <Col className="text-start">
            {text1 && <Card.Title className="display-4">{text1}</Card.Title>}
            {text2 && <Card.Text>{text2}</Card.Text>}
            {text3 && <Card.Text>{text3}</Card.Text>}{" "}
          </Col>
          <Col className="text-end">
            {buttonText && onButtonClick && (
              <Button onClick={onButtonClick} variant="none" className="btn-festimate">
                {buttonText}
              </Button>
            )}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default FestiMateDetailCard;
