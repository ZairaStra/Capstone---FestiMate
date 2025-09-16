import { Navbar, Container, Nav, NavDropdown, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../assets/logo_turquoise.svg";

const FestiMateNav = () => {
  const user = useSelector((state) => state.user);

  return (
    <Navbar expand="lg" sticky="top" className="navbar-festimate shadow-sm py-3">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img alt="brand-icon" src={logo} width="60" height="60" className="d-inline-block align-middle" fill="#ff69b4" />
          <span className="d-none d-md-block">FestiMate</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center gap-3">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/festivals">
              Festivals
            </Nav.Link>
            <Nav.Link as={Link} to="/artists">
              Artists
            </Nav.Link>

            <NavDropdown
              title={
                user.isLoggedIn ? (
                  <Image src={user.avatar} roundedCircle width="30" height="30" style={{ objectFit: "cover", cursor: "pointer" }} />
                ) : (
                  <i className="bi bi-person-circle"></i>
                )
              }
              id="user-nav-dropdown"
              align="end"
            >
              {user.isLoggedIn ? (
                <>
                  <NavDropdown.Item as={Link} to="/wishlist">
                    Wishlist
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/reservations">
                    Reservations
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/settings">
                    Settings
                  </NavDropdown.Item>
                </>
              ) : (
                <>
                  <NavDropdown.Item as={Link} to="/login">
                    Login
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/register">
                    Register
                  </NavDropdown.Item>
                </>
              )}
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default FestiMateNav;
