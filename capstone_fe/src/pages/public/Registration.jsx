import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";

const Registration = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const [form, setForm] = useState({
    username: "",
    name: "",
    surname: "",
    email: "",
    password: "",
    profileImg: "",
    city: "",
    country: "",
    role: "ARTIST_MANAGER",
  });
  const [error, setError] = useState(null);
  const [isAdminCreation, setIsAdminCreation] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.role === "SYSTEM_ADMIN") {
          setIsAdminCreation(true);
        }
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const endpoint = isAdminCreation ? "/register" : "/register";
      const headers = { "Content-Type": "application/json" };
      if (isAdminCreation) {
        headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
      }
      const res = await fetch(`http://localhost:3002${endpoint}`, {
        method: "POST",
        headers,
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Registration failed");
      }

      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container className="my-5 py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8}>
          <h2 className="display-4 my-5">Register</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control name="username" value={form.username} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control name="name" value={form.name} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Surname</Form.Label>
              <Form.Control name="surname" value={form.surname} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={form.email} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" value={form.password} onChange={handleChange} required />
            </Form.Group>

            {!isAdminCreation && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Profile Image URL</Form.Label>
                  <Form.Control name="profileImg" value={form.profileImg} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control name="city" value={form.city} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Country</Form.Label>
                  <Form.Control name="country" value={form.country} onChange={handleChange} />
                </Form.Group>
              </>
            )}

            {isAdminCreation && (
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Select name="role" value={form.role} onChange={handleChange}>
                  <option value="SYSTEM_ADMIN">System Admin</option>
                  <option value="ARTIST_MANAGER">Artist Manager</option>
                  <option value="FESTIVAL_MANAGER">Festival Manager</option>
                  <option value="RESERVATION_MANAGER">Reservation Manager</option>
                  <option value="USER_MANAGER">User Manager</option>
                </Form.Select>
              </Form.Group>
            )}

            <Button type="submit" className="btn-festimate">
              Register
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Registration;
