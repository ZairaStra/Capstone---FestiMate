import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Alert, FormControl } from "react-bootstrap";
import FestiMateCard from "../../components/FestiMateCard";
import FestiMateDropdown from "../../components/FestiMateDropdown";
import FestiMateSearchbar from "../../components/FestiMateSearchbar";
import FestiMateSpinner from "../../components/FestiMateSpinner";
import FestiMateButton from "../../components/FestiMateButton";

const Festivals = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);
  const [festivalName, setFestivalName] = useState(query.get("festivalName") || "");
  /*const [artistName, setArtistName] = useState(query.get("artistName") || "");*/
  const [city, setCity] = useState(query.get("city") || "");
  const [country, setCountry] = useState(query.get("country") || "");
  /*const [genre, setGenre] = useState(query.get("genre") || "");*/
  const [startDate, setStartDate] = useState(query.get("startDate") || "");
  const [endDate, setEndDate] = useState(query.get("endDate") || "");

  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const cleanParam = (param) => (!param || param.trim() === "" ? null : param);
  const formatDate = (date) => (date ? new Date(date).toISOString().split("T")[0] : null);

  useEffect(() => {
    const fetchFestivals = async (pageToFetch = 0) => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.append("page", pageToFetch);
        params.append("size", 12);

        const festivalNameClean = cleanParam(festivalName);
        /*const artistNameClean = cleanParam(artistName);*/
        const cityClean = cleanParam(city);
        const countryClean = cleanParam(country);
        /*const genreClean = cleanParam(genre);*/
        const startDateClean = formatDate(startDate);
        const endDateClean = formatDate(endDate);

        if (festivalNameClean) params.append("festivalName", festivalNameClean);
        /*if (artistNameClean) params.append("artistName", artistNameClean);*/
        if (cityClean) params.append("city", cityClean);
        if (countryClean) params.append("country", countryClean);
        /*if (genreClean) params.append("genre", genreClean);*/
        if (startDateClean) params.append("startDate", startDateClean);
        if (endDateClean) params.append("endDate", endDateClean);

        const res = await fetch(`http://localhost:3002/festivals/search?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch festivals");

        const data = await res.json();
        setFestivals((prev) => (pageToFetch === 0 ? data.content : [...prev, ...(data.content || [])]));
        setHasMore(pageToFetch < (data.totalPages ? data.totalPages - 1 : 0));
      } catch (err) {
        console.error("Error fetching festivals:", err);
      } finally {
        setLoading(false);
      }
    };

    setPage(0);
    setFestivals([]);
    setHasMore(true);
    fetchFestivals(0);
  }, [location.search]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    const festivalNameClean = cleanParam(festivalName);
    /*const artistNameClean = cleanParam(artistName);*/
    const cityClean = cleanParam(city);
    const countryClean = cleanParam(country);
    /*const genreClean = cleanParam(genre);*/
    const startDateClean = formatDate(startDate);
    const endDateClean = formatDate(endDate);

    if (festivalNameClean) params.append("festivalName", festivalNameClean);
    /* if (artistNameClean) params.append("artistName", artistNameClean);*/
    if (cityClean) params.append("city", cityClean);
    if (countryClean) params.append("country", countryClean);
    /*if (genreClean) params.append("genre", genreClean);*/
    if (startDateClean) params.append("startDate", startDateClean);
    if (endDateClean) params.append("endDate", endDateClean);

    navigate(`/festivals?${params.toString()}`, { replace: true });
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);

    const fetchFestivals = async (pageToFetch = nextPage) => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.append("page", pageToFetch);
        params.append("size", 12);

        const festivalNameClean = cleanParam(festivalName);
        /*const artistNameClean = cleanParam(artistName);*/
        const cityClean = cleanParam(city);
        const countryClean = cleanParam(country);
        /*const genreClean = cleanParam(genre);*/
        const startDateClean = formatDate(startDate);
        const endDateClean = formatDate(endDate);

        if (festivalNameClean) params.append("festivalName", festivalNameClean);
        /*if (artistNameClean) params.append("artistName", artistNameClean);*/
        if (cityClean) params.append("city", cityClean);
        if (countryClean) params.append("country", countryClean);
        /*if (genreClean) params.append("genre", genreClean);*/
        if (startDateClean) params.append("startDate", startDateClean);
        if (endDateClean) params.append("endDate", endDateClean);

        const res = await fetch(`http://localhost:3002/festivals/search?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch festivals");

        const data = await res.json();
        setFestivals((prev) => [...prev, ...(data.content || [])]);
        setHasMore(pageToFetch < (data.totalPages ? data.totalPages - 1 : 0));
      } catch (err) {
        console.error("Error fetching festivals:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFestivals(nextPage);
  };

  return (
    <Container className="mb-5">
      <Row className="align-items-baseline g-2 g-md-3 g-xl-4 ">
        <Col xs={12} md={6}>
          <h2 className="my-5 pt-5 display-3">All Festivals</h2>
          <h4 className="display-6">Filter by...</h4>
        </Col>
        <Col xs={12} md={6}>
          <Row className="mb-4 align-items-end">
            <Col>
              <Row>
                <Col xs={12}>
                  <FestiMateSearchbar placeholder="Festival Name" value={festivalName} onChange={setFestivalName} />
                </Col>
                {/*
            <Col xs={12} sm={6} md={4}>
              <FestiMateSearchbar placeholder="Artist Name" value={artistName} onChange={setArtistName} />
            </Col>
            */}
              </Row>
              <Row>
                <Col xs={12} sm={6} md={6}>
                  <FestiMateSearchbar placeholder="City" value={city} onChange={setCity} />
                </Col>
                <Col xs={12} sm={6} md={6}>
                  <FestiMateSearchbar placeholder="Country" value={country} onChange={setCountry} />
                </Col>
                {/*
            <Col xs={12} sm={6} md={4}>
              <FestiMateDropdown value={genre} onChange={setGenre} />
            </Col>
            */}
              </Row>
              <Row className="g-2">
                <Col xs={12} sm={6} md={6}>
                  <FormControl type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </Col>
                <Col xs={12} sm={6} md={6}>
                  <FormControl type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </Col>
              </Row>
              <Row>
                <Col xs={12} className="text-end">
                  <FestiMateButton onClick={handleSearch} className="mt-2">
                    Search
                  </FestiMateButton>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>

      {festivals.length === 0 && !loading && <Alert variant="warning">No festivals found</Alert>}

      <Row xs={1} sm={2} lg={3} xxl={4} className="g-4">
        {festivals.map((f) => (
          <Col key={f.id}>
            <FestiMateCard id={f.id} image={f.coverImg} title={f.name} subtitle={`${f.city}, ${f.country}`} linkPath="/festivals" />
          </Col>
        ))}
      </Row>

      {hasMore && !loading && (
        <div className="text-center my-4">
          <FestiMateButton onClick={handleLoadMore}>Load More</FestiMateButton>
        </div>
      )}

      {loading && <FestiMateSpinner />}
    </Container>
  );
};

export default Festivals;
