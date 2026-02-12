import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./hero.css";

const images: string[] = [
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
];

const Hero = () => {
  const [current, setCurrent] = useState<number>(0);
const scrollToPortfolio = () => {
  const section = document.getElementById("portfolio");

  if (section) {
    section.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
};

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero">
      {/* Background Image */}
      <div
        className="hero-bg"
        style={{ backgroundImage: `url(${images[current]})` }}
      />

      {/* Overlay */}
      <div className="hero-overlay" />

      {/* Content */}
      <div className="hero-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
          >
<h1>
  Building Digital Experiences
  <br />
  <span>That Define the Future</span>
</h1>


            <p>
              SMS Nexora crafts high-performance websites and scalable digital
              solutions for ambitious brands ready to lead.
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="hero-buttons">
          <a href="#contact">
            <button className="primary">Start Your Project</button>
          </a>

<button className="secondary" onClick={scrollToPortfolio}>
  View Portfolio
</button>

        </div>
      </div>

      {/* Dots */}
      <div className="hero-dots">
        {images.map((_, i) => (
          <span
            key={i}
            className={i === current ? "dot active" : "dot"}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>

      {/* Arrows */}
      <button
        className="hero-arrow left"
        onClick={() =>
          setCurrent((current - 1 + images.length) % images.length)
        }
      >
        ‹
      </button>

      <button
        className="hero-arrow right"
        onClick={() => setCurrent((current + 1) % images.length)}
      >
        ›
      </button>
    </section>
  );
};

export default Hero;
