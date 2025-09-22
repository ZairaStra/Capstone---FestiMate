{
  /*import { useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import Placeholder from "../assets/placeholder.webp";
import FestiMateButton from "./FestiMateButton";

const FestiMateDetailCard = ({ id, coverImg, text1, text2, text3, buttonText, onButtonClick, initialWishlisted = false }) => {
  const [isWishlisted, setIsWishlisted] = useState(initialWishlisted);

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const method = isWishlisted ? "DELETE" : "POST";
      const url = `http://localhost:3002/public-users/me/wishlist${isWishlisted ? `/${id}` : ""}`;
      console.log(id);
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
    <Card className="my-5 rounded border-0 card-festimate position-relative">
      {coverImg && (
        <Card.Img
          variant="top"
          src={coverImg || Placeholder}
          onError={(e) => (e.currentTarget.src = Placeholder)}
          style={{
            maxHeight: "30rem",
            objectFit: "cover",
          }}
        />
      )}

      <div
        onClick={toggleWishlist}
        style={{
          position: "absolute",
          top: "15px",
          right: "15px",
          cursor: "pointer",
          fontSize: "2rem",
          color: isWishlisted ? "#ff69b4" : "#fff",
          textShadow: isWishlisted ? "none" : "0 0 4px #2f4f4f",
          zIndex: 10,
        }}
      >
        <i className={`bi ${isWishlisted ? "bi-heart-fill" : "bi-heart"}`} />
      </div>

      <Card.Body>
        <Row className="align-items-center">
          <Col className="text-start">
            {text1 && <Card.Title className="display-4">{text1}</Card.Title>}
            {text2 && <Card.Text>{text2}</Card.Text>}
            {text3 && <Card.Text>{text3}</Card.Text>}
          </Col>
          <Col className="text-end">
            {buttonText && onButtonClick && (
              <FestiMateButton className="btn btn-primary" onClick={onButtonClick}>
                {buttonText}
              </FestiMateButton>
            )}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default FestiMateDetailCard;*/
}

import { useState, useEffect } from "react";
import { Card, Col, Row } from "react-bootstrap";
import Placeholder from "../assets/placeholder.webp";
import FestiMateButton from "./FestiMateButton";

const FestiMateDetailCard = ({ id, coverImg, text1, text2, text3, buttonText, onButtonClick }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Controlla se il festival è già nella wishlist all'inizializzazione
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
    <Card className="my-5 rounded border-0 card-festimate position-relative">
      {coverImg && (
        <Card.Img
          variant="top"
          src={coverImg || Placeholder}
          onError={(e) => (e.currentTarget.src = Placeholder)}
          style={{ maxHeight: "30rem", objectFit: "cover" }}
        />
      )}

      <div
        onClick={toggleWishlist}
        style={{
          position: "absolute",
          top: "15px",
          right: "15px",
          cursor: "pointer",
          fontSize: "2rem",
          color: isWishlisted ? "#ff69b4" : "#fff",
          textShadow: isWishlisted ? "none" : "0 0 4px #2f4f4f",
          zIndex: 10,
        }}
      >
        <i className={`bi ${isWishlisted ? "bi-heart-fill" : "bi-heart"}`} />
      </div>

      <Card.Body>
        <Row className="align-items-center">
          <Col className="text-start">
            {text1 && <Card.Title className="display-4">{text1}</Card.Title>}
            {text2 && <Card.Text>{text2}</Card.Text>}
            {text3 && <Card.Text>{text3}</Card.Text>}
          </Col>
          <Col className="text-end">
            {buttonText && onButtonClick && (
              <FestiMateButton className="btn btn-primary" onClick={onButtonClick}>
                {buttonText}
              </FestiMateButton>
            )}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default FestiMateDetailCard;
