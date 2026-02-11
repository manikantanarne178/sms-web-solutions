import "./contact.css";

const Contact = () => {
  return (
    <section className="contact" id="contact">
      <div className="contact-box">
        <h2>Ready to Build Your Website?</h2>
        <p>
          Let’s create a professional, fast, and modern website that helps your
          business grow.
        </p>

        <div className="contact-actions">
          <a
            href="https://wa.me/918074407557?text=Hi%20SMS%20Web%20Solutions%2C%20I%20am%20interested%20in%20a%20website"

            target="_blank"
            rel="noopener noreferrer"
            className="btn whatsapp"
          >
            💬 WhatsApp Us
          </a>

          <a
            href="mailto:smswebsolutions@gmail.com"
            className="btn email"
          >
            ✉️ Email Us
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
