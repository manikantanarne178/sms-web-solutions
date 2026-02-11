import "./industries.css";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

import {
  ShopOutlined,
  ReadOutlined,
  CoffeeOutlined,
  RocketOutlined,
} from "@ant-design/icons";



const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1], // ✅ cubic-bezier (easeOut)
    },
  }),
};


const Industries = () => {
  return (
    <section className="industries-section" id="industries">
      <motion.div
        className="industries-header"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <h2>Who We Build For</h2>
        <p>
          We design and build high-impact digital experiences for ambitious
          businesses.
        </p>
      </motion.div>

      <div className="industries-grid">
        {[
          {
            icon: <ShopOutlined />,
            title: "Small Businesses",
            desc: "Websites that build trust and generate quality local leads.",
          },
          {
            icon: <ReadOutlined />,
            title: "Coaching & Institutes",
            desc: "High-conversion platforms for courses and admissions.",
          },
          {
            icon: <CoffeeOutlined />,
            title: "Restaurants & Cafes",
            desc: "Visual-first websites that drive footfall and orders.",
          },
          {
            icon: <RocketOutlined />,
            title: "Startups & Personal Brands",
            desc: "Scalable digital identities built for rapid growth.",
          },
        ].map((item, i) => (
            
          <motion.div
            className="industry-card"
            key={i}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            whileHover={{ scale: 1.04, y: -8 }}
            viewport={{ once: true }}
          >
          <div className={`icon-wrap icon-${i}`}>
  {item.icon}
</div>

            <h3>{item.title}</h3>
            <span>{item.desc}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Industries;
