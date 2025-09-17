import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Spinner, Alert, Container, Row, Col } from "react-bootstrap";
import FestiMateDetailCard from "../../components/FestiMateDetailCard";
import Placeholder from "../../assets/placeholder.webp";

const ArtistDetail = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const res = await fetch(`http://localhost:3002/artists/${id}`);
        if (!res.ok) throw new Error("Failed to fetch artist");
        const data = await res.json();
        setArtist(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [id]);

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

  const handleViewFestivals = () => {
    navigate(`/festivals?artist=${artist.id}`);
  };

  return (
    <Container className="my-5 py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <FestiMateDetailCard
            coverImg={artist.coverImg || Placeholder}
            text1={artist.name}
            text2={`Genre: ${artist.genre || "N/A"}`}
            text3={`Website: ${artist.link || "N/A"}`}
            buttonText="View Festivals"
            onButtonClick={handleViewFestivals}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default ArtistDetail;
