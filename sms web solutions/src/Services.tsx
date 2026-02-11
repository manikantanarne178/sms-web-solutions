import "./services.css";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const ServiceCard = ({
  icon,
  title,
  texts,
  color,
  highlight,
}: any) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, 2500); // slow & classy

    return () => clearInterval(interval);
  }, [texts.length]);

  return (
    <motion.div
      className={`service-card ${highlight ? "highlight" : ""}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      {/* ICON */}
      <div className={`icon-wrap ${color}`}>
        <img src={icon} />
      </div>

      <h3>{title}</h3>

      {/* TEXT CYCLE (SAME PLACE) */}
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.45 }}
        >
          {texts[index]}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
};

const Services = () => {
  return (
    <section className="services-section" id="services">
      <motion.h2
        className="services-title"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        What <span>We Deliver</span>
      </motion.h2>

      <div className="services-grid">
        <ServiceCard
          icon="https://cdn-icons-png.flaticon.com/512/1006/1006771.png"
          title="Custom Website Design"
          color="blue"
          texts={[
            "Designs crafted with precision and clarity.",
            "Interfaces tailored to reflect your brand identity.",
            "User experiences built to earn trust instantly.",
            "Designs that quietly convert visitors into clients.",
          ]}
        />

        <ServiceCard
          icon="https://cdn-icons-png.flaticon.com/512/3063/3063825.png"
          title="Mobile-First Development"
          color="purple"
          highlight
          texts={[
            "Responsive layouts across all screen sizes.",
            "Built mobile-first, scaled seamlessly to desktop.",
            "Optimized for speed, interaction and usability.",
            "Performance-driven builds that feel native everywhere.",
          ]}
        />

        <ServiceCard
          icon="https://cdn-icons-png.flaticon.com/512/1048/1048943.png"
          title="Google-Ready Setup"
          color="green"
          texts={[
            "SEO-friendly foundation from day one.",
            "Clean structure for better crawlability.",
            "Optimized for rankings and page speed.",
            "Engineered for long-term growth and visibility.",
          ]}
        />
      </div>
    </section>
  );
};

export default Services;
