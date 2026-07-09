import { useEffect, useRef, useState } from "react";
import "./Mobilis4ManufacturingslideSection.css";
import { slides } from "./manufacturingSlidesData";

function Mobilis4ManufacturingslideSection() {

  const trackRef = useRef(null);
  const [index, setIndex] = useState(slides.length); // start in middle clone set
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const currentTranslate = useRef(0);

  const itemWidth = 575; // 1150 / 2

  // duplicate slides for infinite loop
  const loopSlides = [...slides, ...slides, ...slides];

  // move track
  const updatePosition = (animate = true) => {
    const track = trackRef.current;
    if (!track) return;
    track.style.transition = animate ? "transform .6s ease" : "none";
    track.style.transform = `translateX(${-index * itemWidth}px)`;
  };

  // auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(prev => prev + 1);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // loop correction
  useEffect(() => {
    updatePosition(true);

    if (index >= slides.length * 2) {
      setTimeout(() => {
        setIndex(slides.length);
        updatePosition(false);
      }, 600);
    }

    if (index <= slides.length - 1) {
      setTimeout(() => {
        setIndex(slides.length * 2 - 1);
        updatePosition(false);
      }, 600);
    }
  }, [index]);

  // drag
  const onDown = e => {
    setIsDragging(true);
    startX.current = e.clientX;
  };

  const onMove = e => {
    if (!isDragging) return;
    const diff = e.clientX - startX.current;
    trackRef.current.style.transform =
      `translateX(${(-index * itemWidth) + diff}px)`;
  };

  const onUp = e => {
    if (!isDragging) return;
    setIsDragging(false);
    const diff = e.clientX - startX.current;

    if (diff < -80) setIndex(prev => prev + 1);
    else if (diff > 80) setIndex(prev => prev - 1);
    else updatePosition(true);
  };

  return (
    <section className="manufacturing-slider">

      <div
        className="slider-window"
        onMouseDown={onDown}
        onMouseMove={onMove}
        onMouseUp={onUp}
        onMouseLeave={onUp}
      >
        <div className="slider-track" ref={trackRef}>
          {loopSlides.map((slide, i) => (
            <div className="slide-card" key={i}>
              <img src={slide.img} />
              <h3>{slide.title}</h3>
              <p>{slide.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}

export default Mobilis4ManufacturingslideSection;
