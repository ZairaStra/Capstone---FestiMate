import { useEffect, useState } from "react";
import { Container, Alert, Row, Col } from "react-bootstrap";
import FestiMateSpinner from "../../components/FestiMateSpinner";

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await fetch("http://localhost:3002/reservations/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!res.ok) throw new Error("Failed to fetch reservations");
        const data = await res.json();
        setReservations(data.content || []);
      } catch (err) {
        setError(err.message || "Error fetching reservations");
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  return (
    <Container className="my-5" style={{ minHeight: "80vh" }}>
      <h3 className="mb-5 display-4">My Reservations</h3>

      {loading && <FestiMateSpinner />}

      {error && <Alert variant="danger">{error}</Alert>}

      {!error && !reservations.length && <Alert variant="info">You have no reservations yet.</Alert>}

      {!error && reservations.length > 0 && (
        <Row className="justify-content-center align-items-center">
          <Col xs={12} sm={8}>
            {reservations.map((r) => (
              <p key={r.id} className="p-form p-2">
                <strong className="me-2 display-6">{r.festival.name}</strong> | {r.startDate} – {r.endDate} | Tickets: {r.numTickets} | Camping:{" "}
                {r.campingUnits?.map((u) => u.spotCode).join(", ") || "None"}
              </p>
            ))}
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Reservations;
