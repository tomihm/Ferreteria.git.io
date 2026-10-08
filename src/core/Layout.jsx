// Root.jsx
import { Outlet, NavLink } from 'react-router-dom';

function Layout() {
  return (
    <div className="app">
      <header>
        <nav>
          <NavLink to="/">Inicio</NavLink>
          <NavLink to="/contacto">Contacto</NavLink>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer>© 2026</footer>
    </div>
  );
}

export default Layout