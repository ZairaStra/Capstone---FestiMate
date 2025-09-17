import { useState, useEffect } from "react";
import { Spinner, Container, Row, Col } from "react-bootstrap";
import FestiMateCard from "../../components/FestiMateCard";

const Artists = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const res = await fetch("http://localhost:3002/artists");
        if (!res.ok) throw new Error("Failed to fetch artists");
        const data = await res.json();
        setArtists(data.content);
      } catch (err) {
        console.error("Error fetching artists:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArtists();
  }, []);

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="grow" role="status" variant="none" className="spinner">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="mb-4">All Artists</h2>
      <Row xs={1} sm={2} lg={3} xxl={4} className="g-4">
        {artists.map((a) => (
          <Col key={a.id}>
            <FestiMateCard id={a.id} image={a.coverImg} title={a.name} subtitle={a.genre} linkPath="/artists" />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Artists;
