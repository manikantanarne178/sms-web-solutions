import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./Navbar";
import Hero from "./Hero";
import Services from "./Services";
import Industries from "./Industries";
import Demos from "./Demos";
import Contact from "./Contact";
import Footer from "./Footer";
import DemoRedirect from "./DemoRedirect";
import Intro from "./Intro";
import ChatWidget from "./ChatWidget";

function App() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const seenIntro = sessionStorage.getItem("introPlayed");
    if (seenIntro) {
      setShowIntro(false);
    }
  }, []);

  const handleIntroFinish = () => {
    sessionStorage.setItem("introPlayed", "true");
    setShowIntro(false);
  };

  if (showIntro) {
    return <Intro onFinish={handleIntroFinish} />;
  }

  return (
    <>
      <Routes>
        {/* MAIN WEBSITE */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Hero />
              <Services />
              <Industries />
              <Demos />
              <Contact />
              <Footer />
            </>
          }
        />

        {/* DEMO REDIRECT PAGE */}
        <Route path="/demo-redirect" element={<DemoRedirect />} />
      </Routes>

      {/* ✅ GLOBAL CHAT WIDGET */}
      <ChatWidget />
    </>
  );
}

export default App;
