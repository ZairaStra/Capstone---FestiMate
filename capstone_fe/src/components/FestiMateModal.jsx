import { Button, ListGroup, Modal, Spinner, Alert } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FestiMateModal = ({ artistId }) => {
  const [show, setShow] = useState(false);
  const [lineups, setLineups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleOpen = async () => {
    setShow(true);
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`http://localhost:3002/lineups/artists/${artistId}?page=0&size=100`);
      if (!res.ok) throw new Error("Error fetching lineups");

      const data = await res.json();

      setLineups(data.content || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => setShow(false);

  return (
    <>
      <Button variant="none" onClick={handleOpen}>
        View Festivals
      </Button>

      <Modal show={show} onHide={handleClose} size="md">
        <Modal.Header closeButton>
          <Modal.Title>Festivals</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading && <Spinner animation="grow" className="spinner" />}
          {error && <Alert variant="danger">{error}</Alert>}
          {!loading && !error && lineups.length === 0 && <Alert variant="warning">No festivals found for this artist.</Alert>}
          {!loading && !error && lineups.length > 0 && (
            <ListGroup>
              {lineups.map((l) => (
                <ListGroup.Item
                  key={l.id}
                  action
                  onClick={() => {
                    navigate(`/festivals/${l.festival.id}`);
                    handleClose();
                  }}
                >
                  <strong>{l.festival.name}</strong> ({l.festival.city}, {l.festival.country}) <br />
                  {l.date} | {l.startTime} - {l.endTime}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="none" className="btn-festimate" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FestiMateModal;
