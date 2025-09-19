import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap";

const Login = ({ setUserData }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:3002/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Login failed");
      }

      const data = await res.json();
      localStorage.setItem("token", data.accessToken);
      console.log("Saved token:", localStorage.getItem("token"));

      const userRes = await fetch("http://localhost:3002/users/me", {
        headers: { Authorization: `Bearer ${data.accessToken}` },
      });
      const userData = await userRes.json();
      setUserData(userData);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-3 py-5">
      <Row className="justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <Col xs={12} md={6}>
          <h2 className="display-4">Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </Form.Group>

            <Button type="submit" className="btn-festimate" disabled={loading}>
              {loading ? <Spinner variant="none" className="spinner" animation="grow" size="sm" /> : "Login"}
            </Button>
          </Form>

          <Form.Text className="text-muted mt-3 d-block">
            Don't have an account?{" "}
            <Link className="links" to="/register">
              Register
            </Link>
          </Form.Text>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
