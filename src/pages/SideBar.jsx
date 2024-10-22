import { Col } from "react-bootstrap";
import { NavLink, Link } from "react-router-dom";

const SideBar = () => {
  return (
    <Col md={2} className="sidebar bg-dark vh-100 d-flex flex-column align-items-center">
      <Link to="/" className="text-decoration-none text-white mt-4">
        <h2 className="text-center">Home</h2>
      </Link>

      <ul className="adminsidebar list-unstyled w-100 mt-5">
        
        <li className="mb-3">
          <NavLink
            to="/dashboard"
            className="navlink-container d-flex align-items-center text-white py-2 px-4 rounded hover-effect"
            activeClassName="active-link"
          >
            <i className="bi bi-box me-2"></i>
            <p className="mb-0">Products</p>
          </NavLink>
        </li>
        <li className="mb-3">
          <NavLink
            to="/adminusers"
            className="navlink-container d-flex align-items-center text-white py-2 px-4 rounded hover-effect"
            activeClassName="active-link"
          >
            <i className="bi bi-people me-2"></i>
            <p className="mb-0">Users</p>
          </NavLink>
        </li>
        <li className="mb-3">
          <NavLink
            to="/adminorders"
            className="navlink-container d-flex align-items-center text-white py-2 px-4 rounded hover-effect"
            activeClassName="active-link"
          >
            <i className="bi bi-receipt me-2"></i>
            <p className="mb-0">Orders</p>
          </NavLink>
        </li>
        <li className="mb-3">
          <NavLink
            to="/categorymanagement"
            className="navlink-container d-flex align-items-center text-white py-2 px-4 rounded hover-effect"
            activeClassName="active-link"
          >
            <i className="bi bi-list-ul me-2"></i>
            <p className="mb-0">Categories</p>
          </NavLink>
        </li>
        <li className="mb-3">
          <NavLink
            to="/statistics"
            className="navlink-container d-flex align-items-center text-white py-2 px-4 rounded hover-effect"
            activeClassName="active-link"
          >
            <i className="bi bi-graph-up me-2"></i>
            <p className="mb-0">Statistics</p>
          </NavLink>
        </li>
      </ul>
    </Col>
  );
};

export default SideBar;
