// Root.jsx
import { Outlet, NavLink } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

function Layout() {
  return (
    <div className="app">
      <Header />

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default Layout