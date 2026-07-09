import { useEffect, useRef, useState } from "react";
import OrthoticsHero from "./OrthoticsHero";
import OrthoticsHeroAlt from "./OrthoticsHeroAlt";
import "./OrthoticsSlider.css";

export default function OrthoticsSlider() {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);

  // ---- AUTO SLIDE (7 seconds) ----
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev === 1 ? 0 : 1));
    }, 7000);

    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <section className="orthotics-slider">
      <div
        className="orthotics-slider-track"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        <div className="slide">
          <OrthoticsHero />
        </div>

        <div className="slide">
          <OrthoticsHeroAlt />
        </div>
      </div>
    </section>
  );
}
