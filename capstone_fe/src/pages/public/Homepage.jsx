import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import { Col, Container, Row } from "react-bootstrap";
import Placeholder from "../../assets/placeholder.webp";
import Logo from "../../assets/logo_turquoise.svg";
import FestiMateSearchbar from "../../components/FestiMateSearchbar";

const Homepage = () => {
  const [festivals, setFestivals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFestivals = async () => {
      try {
        const response = await fetch("http://localhost:3002/festivals");
        if (!response.ok) throw new Error("Error fetching festival");
        const data = await response.json();

        if (Array.isArray(data.content)) {
          setFestivals(data.content.slice(0, 5));
        } else {
          console.error("Unexpected format:", data);
        }
      } catch (error) {
        console.error("Error fetching festivals:", error);
      }
    };

    fetchFestivals();
  }, []);

  const handleFestivalSearch = (query) => {
    navigate(`/festivals?festivalName=${encodeURIComponent(query)}`);
  };

  const handleArtistSearch = (query) => {
    navigate(`/artists?name=${encodeURIComponent(query)}`);
  };

  return (
    <Container className="my-5 pt-5">
      <Row className="g-2 g-md-3 g-xl-4 mt-3">
        <Col>
          <Carousel slide={false} interval={10000}>
            {festivals.map((festival) => (
              <Carousel.Item key={festival.id}>
                <Link to={`/festivals/${festival.id}`}>
                  <img
                    className="d-block w-100 rounded"
                    src={festival.coverImg || Placeholder}
                    onError={(e) => (e.currentTarget.src = Placeholder)}
                    style={{ maxHeight: "30rem", objectFit: "cover" }}
                    alt={festival.name}
                  />
                </Link>
                <Carousel.Caption className="bg-dark bg-opacity-50 rounded p-2">
                  <h3>
                    <Link to={`/festivals/${festival.id}`} className="links">
                      {festival.name}
                    </Link>
                  </h3>
                  <p>
                    {festival.city}, {festival.country} <br />
                    {new Date(festival.startDate).toLocaleDateString()} – {new Date(festival.endDate).toLocaleDateString()}
                  </p>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
        </Col>
      </Row>

      <Row className="my-3 g-2 g-md-3 g-xl-4 align-items-center">
        <Col md={6}>
          <h2 className="display-4">Find your festival</h2>
          <p>Search for festivals and discover upcoming events!</p>
        </Col>
        <Col md={6}>
          <FestiMateSearchbar placeholder="Search festivals..." onSearch={handleFestivalSearch} />
        </Col>

        <Col md={6}>
          <h2 className="display-4">Find your artist</h2>
          <p>Search for artists and see where they are performing next!</p>
        </Col>
        <Col md={6}>
          <FestiMateSearchbar placeholder="Search artists..." onSearch={handleArtistSearch} />
        </Col>
      </Row>
    </Container>
  );
};

export default Homepage;
