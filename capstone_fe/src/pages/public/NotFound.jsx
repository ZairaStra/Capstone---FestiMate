import { Container, Row, Col } from "react-bootstrap";

const NotFound = () => {
  return (
    <Container className="mb-5" style={{ minHeight: "80vh" }}>
      <Row>
        <Col>
          <h2 className="display-1 my-5">404</h2>
          <p className="fs-3 p-form p-4">Oops! The page you are looking for does not exist.</p>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;
