import { useEffect, useState } from "react";
import { Container, Alert, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import FestiMateSpinner from "../../components/FestiMateSpinner";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await fetch("http://localhost:3002/public-users/me/wishlist?page=0&size=50", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (!res.ok) throw new Error("Failed to fetch wishlist");

        const data = await res.json();
        setWishlist(data.content || []);
      } catch (err) {
        setError(err.message || "Error fetching wishlist");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const toggleWishlist = async (festivalId) => {
    try {
      const isWishlisted = wishlist.some((f) => f.id === festivalId);
      const method = isWishlisted ? "DELETE" : "POST";
      const url = `http://localhost:3002/public-users/me/wishlist${isWishlisted ? `/${festivalId}` : ""}`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: !isWishlisted ? JSON.stringify({ id: festivalId }) : null,
      });

      if (!res.ok) throw new Error("Failed to update wishlist");

      setWishlist((prev) =>
        isWishlisted ? prev.filter((f) => f.id !== festivalId) : [...prev, wishlist.find((f) => f.id === festivalId) || { id: festivalId, name: "" }]
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container className="my-5" style={{ minHeight: "80vh" }}>
      <h3 className="mb-5 display-4">My Wishlist</h3>

      {loading && <FestiMateSpinner />}

      {error && <Alert variant="danger">{error}</Alert>}

      {!error && !wishlist.length && <Alert variant="info">Your wishlist is empty.</Alert>}

      {!error && wishlist.length > 0 && (
        <Row className="justify-content-center align-items-center">
          <Col xs={12} sm={8}>
            {wishlist.map((f) => (
              <p
                key={f.id}
                className="p-form p-2 d-flex justify-content-between laign-items-center"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/festivals/${f.id}`)}
              >
                <span>
                  <strong className="me-2 display-6">{f.name}</strong> | {f.city}, {f.country}
                </span>
                <i
                  className={`bi bi-heart-fill `}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(f.id);
                  }}
                  style={{
                    color: "#ff69b4",
                    fontSize: "1.8rem",
                    cursor: "pointer",
                  }}
                />
              </p>
            ))}
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Wishlist;
