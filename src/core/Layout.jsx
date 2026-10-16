// Root.jsx
import { Outlet, ScrollRestoration } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

function Layout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <main className="flex-grow-1">
        <Outlet />
      </main>

      <Footer />

      {/* al cambiar de pagina vuelve arriba (o al #ancla si hay) */}
      <ScrollRestoration />
    </div>
  );
}

export default Layout
