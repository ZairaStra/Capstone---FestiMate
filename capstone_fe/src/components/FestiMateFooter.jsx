import { Col, Container, Row } from "react-bootstrap";

const MyFooter = () => {
  return (
    <footer className="footer-festimate">
      <Container>
        <Row>
          <Col>
            <p className="mb-0">&copy; 2025 FestiMate</p>
          </Col>
          <Col>
            <p className="mb-0">Contact Us</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default MyFooter;
