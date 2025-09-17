import { useState, useEffect } from "react";
import Carousel from "react-bootstrap/Carousel";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Placeholder from "../../assets/placeholder.jpg";
import FestiMateSearchBar from "../../components/FestiMateSearchbar";

const Homepage = () => {
  const [festivals, setFestivals] = useState([]);

  useEffect(() => {
    const fetchFestivals = async () => {
      try {
        const response = await fetch("http://localhost:3002/festivals");
        if (!response.ok) throw new Error("Error fetching festival");
        const data = await response.json();
        console.log("Festival fetch response:", data);

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

  return (
    <Container className="mt-5">
      <Row className="g-2 g-md-3 g-xl-4 mt-5 justify-content-end">
        <Col xs={12} md={8} className="text-end">
          <h1 className="d-inline-block display-1 mt-5">Festimate</h1>
          <h3 className="d-inline-block display-6 ms-3 mb-5"> - your festival buddy</h3>
        </Col>
      </Row>
      <Row className="g-2 g-md-3 g-xl-4">
        <Col>
          <Carousel slide={false} interval={10000}>
            {festivals.map((festival) => (
              <Carousel.Item key={festival.id}>
                <Link to={`/festivals/${festival.id}`}></Link>
                <img
                  className="d-block w-100 rounded"
                  src={festival.coverImg || Placeholder}
                  onError={(e) => (e.currentTarget.src = Placeholder)}
                  style={{ maxHeight: "500px", objectFit: "cover" }}
                  alt={festival.name}
                />
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

      <Row className="my-5 g-2 g-md-3 g-xl-4 align-items-center">
        <Col md={6}>
          <h2 className="display-4">Find your festival</h2>
          <p>Search for festivals and discover upcoming events!</p>
        </Col>
        <Col md={6}>
          <FestiMateSearchBar placeholder="Search festivals..." searchPath="/festivals" />
        </Col>

        <Col md={6}>
          <h2 className="display-4">Find your artist</h2>
          <p>Search for artists and see where they are performing next!</p>
        </Col>
        <Col md={6}>
          <FestiMateSearchBar placeholder="Search artists..." searchPath="/artists" />
        </Col>
      </Row>
    </Container>
  );
};

export default Homepage;
