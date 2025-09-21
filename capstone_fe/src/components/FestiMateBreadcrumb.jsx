import { Breadcrumb, Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

const routeNameMap = {
  "/festivals": "Festivals",
  "/artists": "Artists",
  "/me": "My Profile",
  "/login": "Login",
  "/register": "Register",
};

const dynamicRoutes = ["/festivals", "/artists", "/reservations"];

const FestiMateBreadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  if (location.pathname === "/") return null;

  return (
    <Container>
      <Breadcrumb className="mt-5 pt-5">
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/", className: "links" }}>
          Home
        </Breadcrumb.Item>

        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          let label;
          const parentPath = `/${pathnames.slice(0, index).join("/")}`;
          if (isLast && dynamicRoutes.includes(parentPath)) {
            label = "Detail";
          } else {
            label = routeNameMap[to] || value.charAt(0).toUpperCase() + value.slice(1);
          }

          return isLast ? (
            <Breadcrumb.Item active key={to}>
              {label}
            </Breadcrumb.Item>
          ) : (
            <Breadcrumb.Item linkAs={Link} linkProps={{ to, className: "links" }} key={to}>
              {label}
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
    </Container>
  );
};

export default FestiMateBreadcrumb;
