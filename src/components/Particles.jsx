import React, { useState, useEffect } from "react";
import "../Particles.css";

const Particles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generatedParticles = Array.from({ length: 40 }, (_, i) => {
      const size = `${Math.floor(Math.random() * 40) + 10}px`; // 10px to 50px
      const angle = Math.random() * 360; // Random 360-degree direction
      const distance = Math.random() * 20; // Random travel distance
      const x = `${Math.cos(angle) * distance}vw`; // X movement
      const y = `${Math.sin(angle) * distance}vh`; // Y movement
      const color = `hsl(${Math.random() * 360}, 80%, 80%)`;
      const duration = `${(1 + Math.random()) * 1}s`; // Slow animation
      const delay = `-${Math.random()}s`; // Random delay

      return (
        <div
          key={i}
          className="particle"
          style={{
            width: size,
            height: size,
            left: "50%",
            top: "50%",
            backgroundColor: color,
            animationDuration: duration,
            animationDelay: delay,
            zIndex: '998',
            "--x": x,
            "--y": y,
          }}
        ></div>
      );
    });

    setParticles(generatedParticles);
  }, []); // Runs only once when the component mounts

  return <>{particles}</>;
};

export default Particles;
