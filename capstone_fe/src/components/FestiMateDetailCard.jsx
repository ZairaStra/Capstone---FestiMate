import Card from "react-bootstrap/Card";

import { Col, Row } from "react-bootstrap";
import Placeholder from "../assets/placeholder.webp";
import FestiMateButton from "./FestiMateButton";

const FestiMateDetailCard = ({ coverImg, text1, text2, text3, buttonText, onButtonClick }) => {
  return (
    <Card className="my-5 rounded border-0 card-festimate">
      <Card.Body>
        <Row className="align-items-center">
          <Col className="text-start">
            {text1 && <Card.Title className="display-4">{text1}</Card.Title>}
            {text2 && <Card.Text>{text2}</Card.Text>}
            {text3 && <Card.Text>{text3}</Card.Text>}
          </Col>
          <Col className="text-end">{buttonText && onButtonClick && <FestiMateButton onClick={onButtonClick}>{buttonText}</FestiMateButton>}</Col>
        </Row>
      </Card.Body>
      {coverImg && (
        <Card.Img
          src={coverImg || Placeholder}
          onError={(e) => (e.currentTarget.src = Placeholder)}
          style={{ maxHeight: "30rem", objectFit: "cover", borderTopRightRadius: "0", borderTopLeftRadius: "0" }}
        />
      )}
    </Card>
  );
};

export default FestiMateDetailCard;
