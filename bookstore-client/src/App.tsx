import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { Cart } from './pages/Cart';
import './App.css';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="app-shell bg-light min-vh-100">
          <Header />
          
          {/* Hero Section shown only on Home, but putting it globally is fine. We will put it outside routes if we wanted, but let's keep it here so it's above routes. Actually, better to just put it on the Home page, but we will leave a generic one or none. */}
          {/* We moved Hero to a separate element earlier, let's keep it simple. */}
          
          <Routes>
            <Route path="/" element={
              <>
                <header className="hero-section text-white bg-dark">
                  <div className="container py-5 text-center text-md-start">
                    <p className="eyebrow mb-2 text-info text-uppercase fw-bold letter-spacing-1">Mission 12 Online Bookstore</p>
                    <h1 className="display-4 fw-bold">Browse Prof. Hilton&apos;s favorite books</h1>
                    <p className="lead hero-copy mb-0 mt-3 text-light">
                      Filter by category, search for your favorite titles, and add books to your persistent shopping cart!
                    </p>
                  </div>
                </header>
                <Home />
              </>
            } />
            <Route path="/cart" element={<Cart />} />
          </Routes>
          
          <footer className="bg-dark text-white text-center py-4 mt-auto">
            <div className="container">
              <p className="mb-0">&copy; {new Date().getFullYear()} IS 413 Bookstore. Built with React and ASP.NET Core.</p>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
