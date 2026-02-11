import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./hero.css";

const images = [
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
];

const Hero = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section
      className="hero"
      style={{ backgroundImage: `url(${images[current]})` }}
    >
      {/* VIDEO BACKGROUND */}
      <video className="hero-video" autoPlay muted loop playsInline>
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* OVERLAY */}
      <div className="hero-overlay" />

      {/* CONTENT */}
      <div className="hero-content">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          We Build Professional Websites That Grow Your Business
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1 }}
        >
          SMS Web Solutions designs fast, mobile-friendly websites for businesses,
          institutes, and startups — and makes them live on Google.
        </motion.p>

        <motion.div
          className="hero-buttons"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3 }}
        >
<a href="#contact">
  <button className="primary">Get Your Website</button>
</a>

<a href="#demos">
  <button className="secondary">View Live Demos</button>
</a>

        </motion.div>

        {/* DOTS */}
        <div className="hero-dots">
          {images.map((_, i) => (
            <span
              key={i}
              className={i === current ? "dot active" : "dot"}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>
      </div>

      {/* ARROWS */}
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
