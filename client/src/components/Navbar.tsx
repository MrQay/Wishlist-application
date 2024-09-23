import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faWandMagicSparkles,
  faHome,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import Cookies from "js-cookie";

interface NavIconLinkProps {
  to?: string;
  icon: IconDefinition;
  label: string;
  onClick?: () => void;
}

// Component for rendering navigation icon links
const NavIconLink: React.FC<NavIconLinkProps> = ({
  to,
  icon,
  label,
  onClick,
}) => {
  if (to) {
    return (
      <Nav.Link as={Link} to={to} className="nav-icon-link">
        <div className="nav-icon-text">
          <FontAwesomeIcon icon={icon} size="lg" />
          <span>{label}</span>
        </div>
      </Nav.Link>
    );
  } else if (onClick) {
    return (
      <Nav.Link as="button" onClick={onClick} className="nav-icon-link">
        <div className="nav-icon-text">
          <FontAwesomeIcon icon={icon} size="lg" />
          <span>{label}</span>
        </div>
      </Nav.Link>
    );
  }
  return null;
};

const CustomNavbar: React.FC = () => {

  const handleLogout = () => {
    Cookies.remove("authToken"); // Clear JWT token
    window.location.href = "/";
  };

  return (
    <Navbar expand="md" variant="dark" className="custom-navbar bg-dark">
      <div className="container">
        <Navbar.Brand as={Link} to="/" className="navbar-brand">
          Gift Genie <span>.</span>
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="navbar-toggler"
        />
        <Navbar.Collapse id="basic-navbar-nav" className="navbar-collapse">
          <Nav className="ms-auto custom-navbar-cta">
            {/* Navigation icon links with clear labeling */}
            <NavIconLink to="/" icon={faHome} label="Home" />
            <NavIconLink
              to="/wishlist"
              icon={faWandMagicSparkles}
              label="My Lists"
            />
            {Cookies.get("authToken") ? (
              <NavIconLink
                icon={faSignOutAlt}
                label="Logout"
                onClick={handleLogout}
              />
            ) : (
              <NavIconLink to="/auth" icon={faUserCircle} label="User" />
            )}
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default CustomNavbar;
