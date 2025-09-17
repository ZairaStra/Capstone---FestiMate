import { Navbar, Container, Nav, NavDropdown, Image } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../assets/logo_mauve.svg";
import { useEffect, useState } from "react";

const FestiMateNav = () => {
  const user = useSelector((state) => state.user);

  const [showNav, setShowNav] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScroll && currentScroll > 50) {
        setShowNav(false);
      } else {
        setShowNav(true);
      }
      setLastScroll(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  return (
    <Navbar expand="lg" className={`navbar-festimate shadow-sm py-3 ${showNav ? "navbar-visible" : "navbar-hidden"}`}>
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img alt="festimate-logo" src={logo} width="60" height="60" className="d-inline-block align-middle" />
          <span className="d-none d-md-block links ms-2 display-6">FestiMate</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center gap-3">
            <Nav.Link as={NavLink} to="/" end className="links">
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/festivals" className="links">
              Festivals
            </Nav.Link>
            <Nav.Link as={NavLink} to="/artists" className="links">
              Artists
            </Nav.Link>

            <NavDropdown
              title={
                user.isLoggedIn ? (
                  <Image src={user.avatar} roundedCircle width="30" height="30" className="icons" style={{ objectFit: "cover" }} />
                ) : (
                  <i className="bi bi-person-circle icons"></i>
                )
              }
              id="user-nav-dropdown"
              align="end"
            >
              {user.isLoggedIn ? (
                <>
                  <NavDropdown.Item as={Link} to="/wishlist" className="links">
                    Wishlist
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/reservations" className="links">
                    Reservations
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/settings" className="links">
                    Settings
                  </NavDropdown.Item>
                </>
              ) : (
                <>
                  <NavDropdown.Item as={Link} to="/login" className="links">
                    Login
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/register" className="links">
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
