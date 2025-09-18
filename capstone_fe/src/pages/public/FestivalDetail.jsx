import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Spinner, Alert, Container, Row, Col } from "react-bootstrap";
import FestiMateDetailCard from "../../components/FestiMateDetailCard";
import Placeholder from "../../assets/placeholder.webp";

const FestivalDetail = () => {
  const { id } = useParams();
  const [festival, setFestival] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFestival = async () => {
      try {
        const res = await fetch(`http://localhost:3002/festivals/${id}`);
        if (!res.ok) throw new Error("Failed to fetch festival");
        const data = await res.json();
        setFestival(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFestival();
  }, [id]);

  const handleBuyTickets = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/reservations/me/register", { state: { festivalId: festival.id } });
    } else {
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="grow" role="status" variant="none" className="spinner">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (!festival) return <Alert variant="warning">Festival not found</Alert>;

  return (
    <Container className="my-5 py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <FestiMateDetailCard
            coverImg={festival.coverImg || Placeholder}
            text1={festival.name}
            text2={`${new Date(festival.startDate).toLocaleDateString()} – ${new Date(festival.endDate).toLocaleDateString()}`}
            text3={`${festival.city}, ${festival.country}`}
            buttonText="Buy Tickets"
            onButtonClick={handleBuyTickets}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default FestivalDetail;
