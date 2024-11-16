// App.jsx
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./App.css";

function App() {
  const [isVisible, setIsVisible] = useState(false);
  const [viewCount, setViewCount] = useState(() => {
    const savedViews = localStorage.getItem("wwwoaViews");
    return savedViews ? parseInt(savedViews) : 23000000;
  });

  const counterRef = useRef(null);
  const prevCountRef = useRef(viewCount);
  const bubbleRef = useRef(null);
  const messageRef = useRef(null);
  const circleRef = useRef(null);
  const progressRef = useRef(null);

  const FINAL_COUNT = 50000000;

  // Animation du cercle
  useEffect(() => {
    if (!circleRef.current) return;

    gsap.to(circleRef.current, {
      rotation: 360,
      duration: 20,
      repeat: -1,
      ease: "none",
    });

    // Animation subtile de la taille
    gsap.to(circleRef.current, {
      scale: 1.1,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });

    // Animation de la position
    gsap.to(circleRef.current, {
      x: "+=30",
      y: "+=30",
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  // Animation de la progress bar
  useEffect(() => {
    const progress = viewCount / FINAL_COUNT; // Maintenant c'est de 0 à 50M

    gsap.to(progressRef.current, {
      width: `${progress * 100}%`,
      duration: 1,
      ease: "power2.out",
    });
  }, [viewCount]);

  // Animation de la bulle
  const animateBubble = (show) => {
    gsap.to(bubbleRef.current, {
      scale: show ? 1 : 0,
      opacity: show ? 1 : 0,
      display: show ? "block" : "none",
      duration: 0.3,
      ease: show ? "back.out(1.7)" : "power2.in",
    });
  };

  // Mise à jour du compteur
  useEffect(() => {
    const VIEWS_PER_MINUTE = 100; // Environ 1000 vues par minute
    const UPDATES_PER_MINUTE = 10; // Nombre de mises à jour par minute
    const AVERAGE_INCREMENT = Math.floor(VIEWS_PER_MINUTE / UPDATES_PER_MINUTE);

    const updateCounter = () => {
      if (viewCount < FINAL_COUNT) {
        const increment = Math.floor(
          AVERAGE_INCREMENT * (0.4 + Math.random() * 0.4) // Variation entre 80% et 120%
        );
        setViewCount((prev) => {
          const newCount = Math.min(prev + increment, FINAL_COUNT);
          localStorage.setItem("wwwoaViews", newCount.toString());
          return newCount;
        });
      }
      setTimeout(updateCounter, 1000); // Mise à jour toutes les secondes
    };

    setTimeout(() => setIsVisible(true), 500); // Rendre visible après 0.5s
    const timer = setTimeout(updateCounter, 1000); // Lancement de la première mise à jour
    return () => clearTimeout(timer); // Nettoyage du timer
  }, [viewCount]);

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className={`container ${isVisible ? "visible" : ""}`}>
      <div ref={circleRef} className="background-circle" />
      <div className="grain-overlay" />

      <h1 className="logo">wwwoa</h1>

      <div className="counter-container">
        <div className="counter-label">total views generated</div>
        <div className="counter-value">
          <span ref={counterRef}>{formatNumber(viewCount)}</span>
        </div>
      </div>

      <div className="cta-section">
        <div
          className="cta-text"
          onMouseEnter={() => animateBubble(true)}
          onMouseLeave={() => animateBubble(false)}
        >
          wanna get involved ?
        </div>
        <div ref={bubbleRef} className="message-bubble">
          <span ref={messageRef}>send us a message at antoine@wwwoa.xyz</span>
        </div>
      </div>
    </div>
  );
}
export default App;
