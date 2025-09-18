import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Spinner, Container, Row, Col, Alert, Button } from "react-bootstrap";
import FestiMateCard from "../../components/FestiMateCard";
import FestiMateDropdown from "../../components/FestiMateDropdown";
import FestiMateSearchbar from "../../components/FestiMateSearchbar";

const Artists = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const [name, setName] = useState(params.get("name") || "");
  const [genre, setGenre] = useState(params.get("genre") || "");

  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchArtists = async (pageToFetch = 0) => {
      try {
        setLoading(true);
        let url = `http://localhost:3002/artists?page=${pageToFetch}&size=12`;
        if (name) url = `http://localhost:3002/artists/starting-name/${encodeURIComponent(name)}?page=${pageToFetch}&size=12`;
        else if (genre) url = `http://localhost:3002/artists/by-genre/${encodeURIComponent(genre)}?page=${pageToFetch}&size=12`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch artists");

        const data = await res.json();
        setArtists((prev) => (pageToFetch === 0 ? data.content || data : [...prev, ...(data.content || [])]));
        setHasMore(pageToFetch < (data.totalPages ? data.totalPages - 1 : 0));
      } catch (err) {
        console.error("Error fetching artists:", err);
      } finally {
        setLoading(false);
      }
    };

    setPage(0);
    setArtists([]);
    setHasMore(true);
    fetchArtists(0);
  }, [name, genre]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    const fetchNextPage = async () => {
      try {
        setLoading(true);
        let url = `http://localhost:3002/artists?page=${nextPage}&size=12`;
        if (name) url = `http://localhost:3002/artists/starting-name/${encodeURIComponent(name)}?page=${nextPage}&size=12`;
        else if (genre) url = `http://localhost:3002/artists/by-genre/${encodeURIComponent(genre)}?page=${nextPage}&size=12`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch artists");
        const data = await res.json();
        setArtists((prev) => [...prev, ...(data.content || data)]);
        setHasMore(nextPage < (data.totalPages ? data.totalPages - 1 : 0));
      } catch (err) {
        console.error("Error fetching artists:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNextPage();
  };

  const handleSearchByName = (q) => {
    setName(q);
    setGenre("");
    navigate(`/artists?name=${encodeURIComponent(q)}`);
  };

  const handleSelectGenre = (selectedGenre) => {
    setGenre(selectedGenre === "ALL" ? "" : selectedGenre);
    setName("");
    if (selectedGenre === "ALL") navigate("/artists");
    else navigate(`/artists?genre=${selectedGenre}`);
  };

  return (
    <Container className="my-5">
      <Row className="align-items-baseline pb-4">
        <h2 className="my-5 pt-5 display-3">All Artists</h2>
        <h2 className="display-6">Search by artist name or genre</h2>
        <Col xs={12} sm={6} md={8}>
          <FestiMateSearchbar placeholder="Type an artist name and press Enter" onSearch={handleSearchByName} />
        </Col>
        <Col xs={12} sm={6} md={4}>
          <FestiMateDropdown onChange={handleSelectGenre} />
        </Col>
      </Row>

      {artists.length === 0 && !loading && <Alert variant="warning">No artists found</Alert>}

      <Row xs={1} sm={2} lg={3} xxl={4} className="g-4">
        {artists.map((a) => (
          <Col key={a.id}>
            <FestiMateCard id={a.id} image={a.coverImg} title={a.name} subtitle={a.genre} linkPath="/artists" />
          </Col>
        ))}
      </Row>

      {hasMore && !loading && (
        <div className="text-center my-4">
          <Button className="btn-festimate" variant="none" onClick={handleLoadMore}>
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
