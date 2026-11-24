import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/home">Loja Web</Link>
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link className="nav-link text-light" to="/home">Home (Loja)</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-light" to="/produtos">Produtos (CRUD)</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;