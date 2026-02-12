import "./navbar.css";
import logo from "./assets/smslogo.png";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  // Close contact dropdown when menu closes
  useEffect(() => {
    if (!menuOpen) setContactOpen(false);
  }, [menuOpen]);

  // Scroll shrink effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>

        {/* Logo Section */}
        <div className="logo-wrap">
          <div className="logo-circle">
            <img src={logo} alt="SMS Nexora Digital Solutions" />
          </div>
          <span>SMS Nexora</span>
        </div>

        {/* Desktop & Mobile Links */}
        <div className={`nav-links ${menuOpen ? "active" : ""}`}>

          <a href="#services" onClick={() => setMenuOpen(false)}>
            Services
          </a>

          <a href="#industries" onClick={() => setMenuOpen(false)}>
            Industries
          </a>

          <a href="#portfolio" onClick={() => setMenuOpen(false)}>
            Portfolio
          </a>

          {/* Contact Dropdown */}
          <div className="contact-wrapper">
<button
  className="contact-btn"
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
                  <span className="contact-icon whatsapp">W</span>
                  WhatsApp
                </a>

                <a
                  href="mailto:smsnexora@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="contact-icon email">@</span>
                  Email
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Hamburger */}
        <div
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
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
