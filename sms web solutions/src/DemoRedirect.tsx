import { useEffect, useState } from "react";

const DemoRedirect = () => {
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.location.href = "https://smswebsolutions.com";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
        background: "#0f172a",
        color: "#fff",
        flexDirection: "column",
        textAlign: "center",
      }}
    >
      <h2>Live Demo Preview</h2>
      <p style={{ marginTop: 12, opacity: 0.85 }}>
        Redirecting back to <strong>SMS Web Solutions</strong> in
      </p>

      <div
        style={{
          marginTop: 20,
          fontSize: 42,
          fontWeight: 700,
          color: "#38bdf8",
        }}
      >
        {timeLeft}s
      </div>
    </div>
  );
};

export default DemoRedirect;
