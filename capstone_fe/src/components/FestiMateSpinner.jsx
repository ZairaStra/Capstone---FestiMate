import { Spinner, Container } from "react-bootstrap";

const FestiMateSpinner = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ maxHeight: "60vh" }}>
      <Spinner animation="grow" role="status" variant="none" className="spinner">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </Container>
  );
};

export default FestiMateSpinner;
