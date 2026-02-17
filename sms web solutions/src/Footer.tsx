import "./footer.css";

const Footer = () => {

  const email = "smsnexoradigitalsolutions@gmail.com";
  const phone = "918074407557"; // remove + and - for WhatsApp link

  return (
    <footer className="footer">

      <div className="footer-container">

        {/* About */}
        <div className="footer-column">
          <h3>SMS Nexora</h3>
          <p>
            SMS Nexora is a modern web development studio building fast,
            scalable, and professional websites for startups, institutes,
            and businesses across India.
          </p>
        </div>

        {/* Services */}
        <div className="footer-column">
          <h4>Services</h4>
          <ul>
            <li>Website Development</li>
            <li>React Development</li>
            <li>Responsive Design</li>
            <li>Website Deployment</li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-column">
          <h4>Contact</h4>
          <ul>

            {/* Clickable Email */}
            <li>
              <a href={`mailto:${email}`} className="footer-link">
                {email}
              </a>
            </li>

            {/* Clickable WhatsApp */}
            <li>
              <a
                href={`https://wa.me/${phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                WhatsApp: +91 80744 07557
              </a>
            </li>

            <li>India</li>

          </ul>
        </div>

      </div>


      {/* Bottom */}
      <div className="footer-bottom">
        © {new Date().getFullYear()} SMS Nexora Digital Solutions. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;
