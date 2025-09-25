import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import FestiMateInteractiveCampingMap from "../../components/FestiMateInteractiveCampingMap";
import FestiMateSpinner from "../../components/FestiMateSpinner";
import FestiMateButton from "../../components/FestiMateButton";

//TODO: selezione spot non funzionante

const Reservation = ({ user }) => {
  const location = useLocation();
  const festivalId = location.state?.festivalId;
  const navigate = useNavigate();

  const [festival, setFestival] = useState(null);
  const [loadingFestival, setLoadingFestival] = useState(true);
  const [svgString, setSvgString] = useState(null);
  const [campingUnits, setCampingUnits] = useState([]);
  const [selectedUnits, setSelectedUnits] = useState([]);
  const [tickets, setTickets] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!festivalId) {
      setError("Festival ID missing");
      setLoadingFestival(false);
      return;
    }
    const fetchFestival = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:3002/festivals/${festivalId}`);
        if (!res.ok) throw new Error("Error loading festival");
        const data = await res.json();
        setFestival(data);

        if (data.campingMap) {
          const unitsRes = await fetch(`http://localhost:3002/festivals/${festivalId}/camping-units`);
          if (unitsRes.ok) {
            const unitsData = await unitsRes.json();
            console.log("Camping units loaded:", unitsData);
            setCampingUnits(unitsData);
          }

          const svgRes = await fetch(data.campingMap);
          const svgText = await svgRes.text();
          setSvgString(svgText);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setLoadingFestival(false);
      }
    };
    fetchFestival();
  }, [festivalId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!user || user.role) {
      setError("Only public users can make reservations.");
      return;
    }

    if (!tickets || tickets < 1) {
      setError("You have to buy at least a ticket");
      return;
    }
    if (!startDate || !endDate) {
      setError("Select valid dates");
      return;
    }

    const ticketNum = Number(tickets);
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const totalPrice =
      ticketNum * festival.dailyPrice +
      selectedUnits.reduce((sum, unitId) => {
        const unit = campingUnits.find((u) => u.id === unitId);
        return sum + (unit?.accomodationType?.pricePerNight || 0) * days;
      }, 0);

    try {
      const payload = {
        festivalId: parseInt(festivalId),
        startDate,
        endDate,
        numTickets: tickets,
        totalPrice,
        campingUnitIds: selectedUnits,
      };

      const res = await fetch("http://localhost:3002/reservations/me/register", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Reservation failed");
      }
      setSuccess("Reservation created!");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <FestiMateSpinner />;
  if (loadingFestival || !festival) {
    return <FestiMateSpinner />;
  }

  return (
    <Container className="mb-5" style={{ minHeight: "80vh" }}>
      {error && !festival}
      {success && (
        <Alert variant="success" onClose={() => navigate(`/reservations/me`)} dismissible>
          {success}
        </Alert>
      )}
      {error && (
        <Alert variant="danger" onClose={() => navigate(`/`)} dismissible>
          {error}
        </Alert>
      )}

      <Row className="mb-4 align-items-center">
        <Col xs={12} sm={7}>
          <h3 className="display-4 pb-4">
            Book your tickets for <strong>{festival.name}</strong>
          </h3>
        </Col>
        <Col>
          <p className="p-form p-3">
            Dates: {festival.startDate} – {festival.endDate} <br />
            Daily Price: ${festival.dailyPrice} <br />
            Capacity Left: {festival.maxNumbPartecipants}
          </p>
        </Col>
      </Row>
      <Row className="g-4">
        <Col>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3 g-3">
              <Col>
                <Row className="flex-column g-4">
                  <Col>
                    <Form.Group>
                      <Form.Label>Ticket's number</Form.Label>
                      <Form.Select value={tickets} onChange={(e) => setTickets(Number(e.target.value))}>
                        {[...Array(10)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Start date</Form.Label>
                      <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>End date</Form.Label>
                      <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </Form.Group>
                  </Col>
                </Row>
                <FestiMateButton type="submit" className="my-3">
                  Confirm reservation
                </FestiMateButton>
              </Col>
              {svgString && !loading && (
                <Col xs={12} lg={8}>
                  <h4 className="text-center">Select camping units</h4>
                  <Row className="align-items-center justify-context-center p-form m-3">
                    <Col xs={2} md={3} className="text-center">
                      <h5 className="mt-4">Camping Legend</h5>
                      <ul className="legend-list">
                        <li>
                          <span className="legend-shape triangle" /> Tent
                        </li>
                        <li>
                          <span className="legend-shape circle" /> Bubble Tent
                        </li>
                        <li>
                          <span className="legend-shape rectangle" /> Bungalow
                        </li>

                        <li>
                          <span className="legend-color selected" /> Sel
                        </li>
                        <li>
                          <span className="legend-color available" /> Ava
                        </li>
                        <li>
                          <span className="legend-color occupied" /> Occ
                        </li>
                      </ul>
                    </Col>
                    <Col>
                      {svgString && (
                        <FestiMateInteractiveCampingMap
                          svgString={svgString}
                          campingUnits={campingUnits}
                          selectedUnits={selectedUnits}
                          setSelectedUnits={setSelectedUnits}
                        />
                      )}
                    </Col>
                  </Row>
                </Col>
              )}
            </Row>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Reservation;
