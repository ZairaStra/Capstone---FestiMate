import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Spinner, Container, Row, Col, Alert, Button } from "react-bootstrap";
import FestiMateCard from "../../components/FestiMateCard";

const Festivals = () => {
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const festivalName = params.get("festivalName") || "";

  useEffect(() => {
    const fetchFestivals = async () => {
      try {
        let url = `http://localhost:3002/festivals?page=${page}&size=12`;
        if (festivalName) {
          url = `http://localhost:3002/festivals/search?festivalName=${encodeURIComponent(festivalName)}&page=${page}&size=12`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch festivals");

        const data = await res.json();
        setFestivals((prev) => [...prev, ...(data.content || data)]);
        setHasMore(page < (data.totalPages ? data.totalPages - 1 : 0));
      } catch (err) {
        console.error("Error fetching festivals:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFestivals();
  }, [festivalName, page]);

  useEffect(() => {
    setFestivals([]);
    setPage(0);
    setHasMore(true);
    setLoading(true);
  }, [festivalName]);

  if (!festivals.length && !loading) return <Alert variant="warning">No festivals found</Alert>;

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

      {hasMore && !loading && (
        <div className="text-center my-4">
          <Button className="btn-festimate" variant="none" onClick={() => setPage((prev) => prev + 1)}>
            Load More
          </Button>
        </div>
      )}

      {loading && (
        <div className="text-center my-4">
          <Spinner animation="grow" role="status" variant="none" className="spinner">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
    </Container>
  );
};

export default Festivals;
