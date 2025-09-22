{
  /*import { useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Placeholder from "../assets/placeholder.webp";

const FestiMateCard = ({ id, image, title, subtitle, linkPath, initialWishlisted = false }) => {
  const [isWishlisted, setIsWishlisted] = useState(initialWishlisted);

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const method = isWishlisted ? "DELETE" : "POST";
      const url = `http://localhost:3002/public-users/me/wishlist${isWishlisted ? `/${id}` : ""}`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: !isWishlisted ? JSON.stringify({ id }) : null,
      });

      if (!res.ok) throw new Error("Failed to update wishlist");
      setIsWishlisted(!isWishlisted);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card className="card-festimate mb-3 shadow-sm rounded border-0 position-relative">
      <Link to={`${linkPath}/${id}`}>
        <Card.Img
          variant="top"
          src={image || Placeholder}
          onError={(e) => (e.currentTarget.src = Placeholder)}
          style={{ objectFit: "cover", maxWidth: "100%", height: "20rem" }}
          className="rounded-top"
        />
        <i
          className={`bi ${isWishlisted ? "bi-heart-fill" : "bi-heart"}`}
          onClick={toggleWishlist}
          style={{
            position: "absolute",
            top: "0.5rem",
            right: "0.5rem",
            fontSize: "1.8rem",
            color: isWishlisted ? "#ff69b4" : "#fff",
            textShadow: isWishlisted ? "none" : "0 0 2px  #2f4f4f",
            cursor: "pointer",
            zIndex: 10,
          }}
        />
      </Link>

      <Card.Body>
        <Row>
          <Col className="text-start text-truncate">
            <Link to={`${linkPath}/${id}`} className="links">
              <Card.Title>{title}</Card.Title>
            </Link>
          </Col>
          <Col className="text-end text-truncate">
            <Card.Text>{subtitle}</Card.Text>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default FestiMateCard;*/
}

import { useState, useEffect } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Placeholder from "../assets/placeholder.webp";

const FestiMateCard = ({ id, image, title, subtitle, linkPath }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await fetch("http://localhost:3002/public-users/me/wishlist?page=0&size=100", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!res.ok) throw new Error("Failed to fetch wishlist");
        const data = await res.json();
        if (data.content.some((f) => f.id === id)) {
          setIsWishlisted(true);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchWishlist();
  }, [id]);

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const method = isWishlisted ? "DELETE" : "POST";
      const url = `http://localhost:3002/public-users/me/wishlist${isWishlisted ? `/${id}` : ""}`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: !isWishlisted ? JSON.stringify({ id }) : null,
      });

      if (!res.ok) throw new Error("Failed to update wishlist");
      setIsWishlisted(!isWishlisted);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card className="card-festimate mb-3 shadow-sm rounded border-0 position-relative">
      <Link to={`${linkPath}/${id}`}>
        <Card.Img
          variant="top"
          src={image || Placeholder}
          onError={(e) => (e.currentTarget.src = Placeholder)}
          style={{ objectFit: "cover", maxWidth: "100%", height: "20rem" }}
          className="rounded-top"
        />
        <i
          className={`bi ${isWishlisted ? "bi-heart-fill" : "bi-heart"}`}
          onClick={toggleWishlist}
          style={{
            position: "absolute",
            top: "0.5rem",
            right: "0.5rem",
            fontSize: "1.8rem",
            color: isWishlisted ? "#ff69b4" : "#fff",
            textShadow: isWishlisted ? "none" : "0 0 2px  #2f4f4f",
            cursor: "pointer",
            zIndex: 10,
          }}
        />
      </Link>

      <Card.Body>
        <Row>
          <Col className="text-start text-truncate">
            <Link to={`${linkPath}/${id}`} className="links">
              <Card.Title>{title}</Card.Title>
            </Link>
          </Col>
          <Col className="text-end text-truncate">
            <Card.Text>{subtitle}</Card.Text>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default FestiMateCard;
