import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      © {new Date().getFullYear()} SMS Web Solutions. All rights reserved.
    </footer>
  );
};

export default Footer;
