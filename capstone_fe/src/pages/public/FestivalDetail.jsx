{
  /*import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Container, Row, Col } from "react-bootstrap";
import FestiMateDetailCard from "../../components/FestiMateDetailCard";
import Placeholder from "../../assets/placeholder.webp";
import FestiMateSpinner from "../../components/FestiMateSpinner";

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
    if (token && festival) {
      navigate("/reservations/me/register", { state: { festivalId: festival.id } });
    } else {
      navigate("/login");
    }
  };

  return (
    <Container style={{ minHeight: "80vh" }}>
      {loading && <FestiMateSpinner />}
      {!loading && !festival && <Alert variant="warning">Festival not found</Alert>}

      {festival && (
        <Row className="justify-content-center">
          <Col key={festival.id} xs={12} md={10} lg={8}>
            <FestiMateDetailCard
              id={festival.id}
              coverImg={festival.coverImg || Placeholder}
              text1={festival.name}
              text2={`${new Date(festival.startDate).toLocaleDateString()} – ${new Date(festival.endDate).toLocaleDateString()}`}
              text3={`${festival.city}, ${festival.country} | Camping: ${festival.campingMap ? "Yes" : "No"}`}
              buttonText="Buy Tickets"
              onButtonClick={handleBuyTickets}
              isFestival={true}
            />
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default FestivalDetail;*/
}
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Container, Row, Col } from "react-bootstrap";
import FestiMateDetailCard from "../../components/FestiMateDetailCard";
import Placeholder from "../../assets/placeholder.webp";
import FestiMateSpinner from "../../components/FestiMateSpinner";

const FestivalDetail = () => {
  const { id } = useParams();
  const [festival, setFestival] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFestival = async () => {
      try {
        setLoading(true);
        const [festivalRes, wishlistRes] = await Promise.all([
          fetch(`http://localhost:3002/festivals/${id}`),
          fetch("http://localhost:3002/public-users/me/wishlist?page=0&size=100", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }),
        ]);

        if (!festivalRes.ok) throw new Error("Failed to fetch festival");
        const festivalData = await festivalRes.json();
        setFestival(festivalData);

        if (wishlistRes.ok) {
          const wishlistData = await wishlistRes.json();
          const ids = new Set(wishlistData.content.map((f) => f.id));
          setIsWishlisted(ids.has(festivalData.id));
        }
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
    if (token && festival) {
      navigate("/reservations/me/register", { state: { festivalId: festival.id } });
    } else {
      navigate("/login");
    }
  };

  return (
    <Container style={{ minHeight: "80vh" }}>
      {loading && <FestiMateSpinner />}
      {!loading && !festival && <Alert variant="warning">Festival not found</Alert>}

      {festival && (
        <Row className="justify-content-center">
          <Col key={festival.id} xs={12} md={10} lg={8}>
            <FestiMateDetailCard
              id={festival.id}
              coverImg={festival.coverImg || Placeholder}
              text1={festival.name}
              text2={`${new Date(festival.startDate).toLocaleDateString()} – ${new Date(festival.endDate).toLocaleDateString()}`}
              text3={`${festival.city}, ${festival.country} | Camping: ${festival.campingMap ? "Yes" : "No"}`}
              buttonText="Buy Tickets"
              onButtonClick={handleBuyTickets}
              initialWishlisted={isWishlisted} // <-- qui la logica aggiunta
              isFestival={true}
            />
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default FestivalDetail;
