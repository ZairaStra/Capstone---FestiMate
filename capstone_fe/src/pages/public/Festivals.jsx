import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import FestiMateCard from "../../components/FestiMateCard";

const Festivals = () => {
  const [festivals, setFestivals] = useState([]);

  useEffect(() => {
    const fetchFestivals = async () => {
      try {
        const res = await fetch("http://localhost:3002/festivals");
        const data = await res.json();
        setFestivals(data.content);
      } catch (err) {
        console.error("Error fetching festivals:", err);
      }
    };
    fetchFestivals();
  }, []);

  return (
    <Container className="my-5">
      <h2 className="mb-4">All Festivals</h2>
      <Row xs={1} sm={2} lg={3} xxl={4} className="g-4">
        {festivals.map((f) => (
          <Col key={f.id}>
            <FestiMateCard id={f.id} image={f.coverImg} title={f.name} subtitle={`${f.city}, ${f.country}`} linkPath="/festivals" />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Festivals;
