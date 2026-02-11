import { useEffect, useState } from "react";
import logo from "./assets/smslandinglogo.png";
import "./intro.css";

type IntroProps = {
  onFinish: () => void;
};

const Intro = ({ onFinish }: IntroProps) => {
  const [progress, setProgress] = useState(0); // 0 → 1
  const [exit, setExit] = useState(false);

  useEffect(() => {
    const start = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const value = Math.min(elapsed / 5000, 1); // 5s assemble
      setProgress(value);

      if (value === 1) {
        clearInterval(interval);
        playFemaleVoice(); // 🔊 ONLY AFTER FULL FORM
      }
    }, 40);

    const exitTimer = setTimeout(() => {
      setExit(true);
      setTimeout(onFinish, 1200);
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(exitTimer);
      window.speechSynthesis.cancel();
    };
  }, [onFinish]);

  const playFemaleVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    const female =
      voices.find(v =>
        v.name.toLowerCase().includes("female") ||
        v.name.toLowerCase().includes("zira") ||
        v.name.toLowerCase().includes("samantha")
      ) || voices[0];

    const msg = new SpeechSynthesisUtterance(
      "Welcome to SMS Web Solutions. We build modern, powerful, and intelligent web experiences."
    );
    msg.rate = 0.9;
    msg.pitch = 1.3;
    msg.voice = female;

    window.speechSynthesis.speak(msg);
  };

  const skipIntro = () => {
    window.speechSynthesis.cancel();
    setExit(true);
    setTimeout(onFinish, 800);
  };

  return (
    <div className={`intro ${exit ? "exit" : ""}`}>
      {/* Particles */}
      <div className="fragments">
        {[...Array(12)].map((_, i) => (
          <span key={i} className={`fragment f${i + 1}`} />
        ))}
      </div>

      {/* LOGO ALWAYS PRESENT – but forms slowly */}
      <img
        src={logo}
        className="logo"
        alt="SMS Web Solutions"
        style={{
          opacity: progress,
          filter: `blur(${12 - progress * 12}px)`,
          transform: `scale(${0.6 + progress * 0.4})`
        }}
      />

      <h1
        style={{
          opacity: progress > 0.85 ? (progress - 0.85) * 6 : 0
        }}
      >
        SMS Web Solutions
      </h1>

      <button className="skip-btn" onClick={skipIntro}>
        Skip Intro
      </button>
    </div>
  );
};

export default Intro;
