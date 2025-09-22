import { Navbar, Container, Nav, NavDropdown, Image } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo_mauve.svg";
import { useEffect, useState } from "react";
import defaultAvatar from "../assets/account.png";

const FestiMateNav = ({ user }) => {
  const navigate = useNavigate();
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const renderUserIcon = () => {
    if (isLoggedIn && user?.profileImg) {
      return (
        <Image
          src={user.profileImg}
          roundedCircle
          width="30"
          height="30"
          className="icons"
          style={{ objectFit: "cover" }}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = defaultAvatar;
          }}
        />
      );
    } else if (isLoggedIn && !user?.profileImg) {
      return <i className="bi bi-person-circle icons" style={{ color: "#6a5acd", fontSize: "1.5rem" }}></i>;
    } else {
      return <i className="bi bi-person-circle icons"></i>;
    }
  };

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

            <NavDropdown title={renderUserIcon()} id="user-nav-dropdown" align="end">
              {isLoggedIn ? (
                <>
                  <NavDropdown.Item as={Link} to="public-users/me/wishlist" className="nav-dropdown-links">
                    Wishlist
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/reservations/me" className="nav-dropdown-links">
                    Reservations
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/me" className="nav-dropdown-links">
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout} className="nav-dropdown-links">
                    Logout
                  </NavDropdown.Item>
                </>
              ) : (
                <>
                  <NavDropdown.Item as={Link} to="/login" className="nav-dropdown-links">
                    Login
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/register" className="nav-dropdown-links">
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
