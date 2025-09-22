import { useEffect, useState } from "react";
import { Container, Alert } from "react-bootstrap";
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
        const res = await fetch("http://localhost:3002/public-users/me/wishlist", {
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

  return (
    <Container className="my-5" style={{ minHeight: "80vh" }}>
      <h3 className="mb-4 display-4">My Wishlist</h3>

      {loading && <FestiMateSpinner />}

      {error && <Alert variant="danger">{error}</Alert>}

      {!error && !wishlist.length && <Alert variant="info">Your wishlist is empty.</Alert>}

      {!error &&
        wishlist.length > 0 &&
        wishlist.map((f) => (
          <p key={f.id} className="p-form clickable" onClick={() => navigate(`/festivals/${f.id}`)}>
            {f.name} | {f.city}, {f.country}
          </p>
        ))}
    </Container>
  );
};

export default Wishlist;
