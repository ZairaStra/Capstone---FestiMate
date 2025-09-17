import { Col, Container, Row } from "react-bootstrap";

const MyFooter = () => {
  return (
    <footer className="footer-festimate py-3">
      <Container fluid>
        <Row className="align-items-center">
          <Col xs={12} md={6} className="text-center mb-2 mb-md-0 d-flex justify-content-center align-items-center">
            <p className="mb-0">&copy; 2025 FestiMate</p>
          </Col>
          <Col xs={12} md={6} className="text-center mb-2 mb-md-0 d-flex justify-content-center  align-items-center">
            <p className="mb-0 me-2">Follow Us</p>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="icons">
              <i className="bi bi-facebook me-2"></i>
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="icons">
              <i className="bi bi-instagram me-2"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="icons">
              <i className="bi bi-twitter-x me-2"></i>
            </a>
            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="icons">
              <i className="bi bi-youtube"></i>
            </a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default MyFooter;
