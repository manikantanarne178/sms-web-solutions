import "./demos.css";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
const demoData: DemoItem[] = [
  {
    title: "Business Website",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    demoUrl: "https://demo.templatemonster.com/demo/58898.html",
    openType: "newtab",
  },
  {
    title: "Institute Website",
    image:
      "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80",
    demoUrl: "https://eduma.thimpress.com/",
    openType: "newtab",
  },
  {
    title: "Restaurant Website",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    demoUrl: "https://bootstrapmade.com/demo/Restaurantly/",
    openType: "newtab",
  },
];



type DemoItem = {
  title: string;
  image: string;
  demoUrl: string;
  openType: "iframe" | "newtab";
};


const Demos = () => {
  const [activeDemo, setActiveDemo] = useState<any>(null);

  return (
    <section className="section demos-section" id="demos">
      <h2 className="section-title">Live Website Demos</h2>
      <p className="demo-sub">
        Premium websites crafted to convert visitors into customers
      </p>

<div className="grid">
  {demoData.map((demo, index) => (
    <motion.div
      key={index}
      className="card demo-card"
      whileHover={{ y: -14 }}
      transition={{ type: "spring", stiffness: 180 }}
    >
      {/* ===== BADGES ===== */}
      {/* <span className="demo-badge">LIVE</span>
      {index === 0 && (
        <span className="recommend-badge">Recommended</span>
      )} */}

      {/* ===== DEVICE MOCKUP ===== */}
<div className="device-frame">
  <span className="demo-badge">LIVE</span>
  {index === 0 && (
    <span className="recommend-badge">Recommended</span>
  )}

  <div className="laptop-frame">
    <img src={demo.image} alt={demo.title} />
  </div>

  <div className="phone-frame">
    <img src={demo.image} alt="Mobile preview" />
  </div>
</div>


      {/* ===== TITLE ===== */}
      <h3>{demo.title}</h3>

      {/* ===== CTA ===== */}
<button
  className="demo-btn"
  onClick={() => {
    const demoWindow = window.open(demo.demoUrl, "_blank");

    setTimeout(() => {
      if (demoWindow && !demoWindow.closed) {
        demoWindow.close(); // optional
      }
      window.location.href = "/";
    }, 30000); // 60 seconds
  }}
>
  View Live Demo
</button>





    </motion.div>
  ))}
</div>


      {/* ===== DEMO MODAL ===== */}
      <AnimatePresence>
{activeDemo && (
  <motion.div className="demo-modal-backdrop">
    <motion.div className="demo-modal">
      <h3>{activeDemo.title}</h3>

      <iframe
        src={activeDemo.demoUrl}
        title="Live Demo"
        frameBorder="0"
        onError={() => window.open(activeDemo.demoUrl, "_blank")}
      />

      <div className="modal-actions">
        <a href="#contact" className="demo-cta">
          Get This Website 🚀
        </a>

        <button
          className="close-btn"
          onClick={() => setActiveDemo(null)}
        >
          Close
        </button>
      </div>
    </motion.div>
  </motion.div>
)}

      </AnimatePresence>
    </section>
  );
};

export default Demos;
