import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spinner, Alert, Container, Row, Col, Button, ListGroup } from "react-bootstrap";
import FestiMateDetailCard from "../../components/FestiMateDetailCard";
import FestiMateModal from "../../components/FestiMateModal";
import Placeholder from "../../assets/placeholder.webp";

const ArtistDetail = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);

  const [show, setShow] = useState(false);
  const [lineups, setLineups] = useState([]);
  const [loadingLineups, setLoadingLineups] = useState(false);
  const [errorLineups, setErrorLineups] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const res = await fetch(`http://localhost:3002/artists/${id}`);
        if (!res.ok) throw new Error("Failed to fetch artist");
        const data = await res.json();
        setArtist(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [id]);

  const handleOpenModal = async () => {
    setShow(true);
    setLoadingLineups(true);
    setErrorLineups(null);

    try {
      const res = await fetch(`http://localhost:3002/lineups/artists/${id}?page=0&size=100`);
      if (!res.ok) throw new Error("Error fetching lineups");
      const data = await res.json();
      setLineups(data.content || []);
    } catch (err) {
      console.error(err);
      setErrorLineups(err.message);
    } finally {
      setLoadingLineups(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center my-5 py-5">
        <Spinner animation="grow" role="status" variant="none" className="spinner">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (!artist) return <Alert variant="warning">Artist not found</Alert>;

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <FestiMateDetailCard
            coverImg={artist.coverImg || Placeholder}
            text1={artist.name}
            text2={`Genre: ${artist.genre || "N/A"}`}
            text3={`Website: ${artist.link || "N/A"}`}
            buttonText="View Festivals"
            onButtonClick={handleOpenModal}
          />
        </Col>
      </Row>

      <FestiMateModal show={show} onClose={() => setShow(false)} title="Festivals">
        {loadingLineups && <Spinner animation="grow" className="spinner" />}
        {errorLineups && <Alert variant="danger">{errorLineups}</Alert>}
        {!loadingLineups && !errorLineups && lineups.length === 0 && <Alert variant="warning">No festivals found for this artist.</Alert>}
        {!loadingLineups && !errorLineups && lineups.length > 0 && (
          <ListGroup>
            {lineups.map((l) => (
              <ListGroup.Item
                key={l.id}
                action
                onClick={() => {
                  navigate(`/festivals/${l.festival.id}`);
                  setShow(false);
                }}
              >
                <strong>{l.festival.name}</strong> ({l.festival.city}, {l.festival.country}) <br />
                {l.date} | {l.startTime} - {l.endTime}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </FestiMateModal>
    </Container>
  );
};

export default ArtistDetail;
