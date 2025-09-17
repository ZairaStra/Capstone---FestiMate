import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import FestiMateCard from "../../components/FestiMateCard";

const Artists = () => {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const res = await fetch("http://localhost:3002/artists");
        const data = await res.json();
        setArtists(data.content);
      } catch (err) {
        console.error("Error fetching artists:", err);
      }
    };
    fetchArtists();
  }, []);

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
