import "./navbar.css";
import logo from "../src/assets/smslogo.png";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [menuOpen]);

  // Close contact dropdown if menu closes
  useEffect(() => {
    if (!menuOpen) {
      setContactOpen(false);
    }
  }, [menuOpen]);

  return (
    <>
      <nav className="navbar">
        
        {/* Logo */}
        <div className="logo-wrap">
          <img src={logo} alt="SMS Web Solutions" />
          <span>SMS Web Solutions</span>
        </div>

        {/* Hamburger */}
        <div 
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </div>

        {/* Links */}
        <div className={`nav-links ${menuOpen ? "active" : ""}`}>

          <a href="#services" onClick={() => setMenuOpen(false)}>
            Services
          </a>

          <a href="#industries" onClick={() => setMenuOpen(false)}>
            Industries
          </a>

          <a href="#demos" onClick={() => setMenuOpen(false)}>
            Demos
          </a>

          <div className="contact-wrapper">
            <button
              className="nav-btn"
              onClick={() => setContactOpen(!contactOpen)}
            >
              Contact
            </button>

            {contactOpen && (
              <div className="contact-dropdown">
                <a
                  href="https://wa.me/918074407557"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  💬 WhatsApp
                </a>
                <a href="mailto:smswebsolutions@gmail.com">
                  ✉️ Email
                </a>
              </div>
            )}
          </div>

        </div>
      </nav>

      {/* Backdrop */}
      {menuOpen && (
        <div
          className="nav-backdrop"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
