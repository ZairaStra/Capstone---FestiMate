import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Spinner, Container, Row, Col, Alert, Button } from "react-bootstrap";
import FestiMateCard from "../../components/FestiMateCard";

const Artists = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const params = new URLSearchParams(location.search);
  const name = params.get("name") || "";

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        let url = `http://localhost:3002/artists?page=${page}&size=12`;
        if (name) {
          url = `http://localhost:3002/artists/starting-name/${encodeURIComponent(name)}?page=${page}&size=12`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch artists");

        const data = await res.json();
        setArtists((prev) => [...prev, ...(data.content || data)]);
        setHasMore(page < (data.totalPages ? data.totalPages - 1 : 0));
      } catch (err) {
        console.error("Error fetching artists:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArtists();
  }, [name, page]);

  useEffect(() => {
    setArtists([]);
    setPage(0);
    setHasMore(true);
    setLoading(true);
  }, [name]);

  if (!artists.length && !loading) return <Alert variant="warning">No artists found</Alert>;

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

export default Artists;
