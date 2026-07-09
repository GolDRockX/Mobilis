import { useState } from "react";
import { experiences } from "./experiences";
import ExperienceCard from "./ExperienceCard";
import "./experience.css";

export default function ExperienceSection() {
  const [index, setIndex] = useState(0);

  const cardsPerView = 2;
  const totalSlides = Math.ceil(experiences.length / cardsPerView);

  return (
    <section className="experience">
      <div className="exp-header">
        <h2>
          YOUR <span>NEXT</span> EXPERIENCE <br /> STARTS HERE
        </h2>

        <p>
          This isn’t just a website — it’s the beginning of something immersive.
          Obsidian invites you into a space where every interaction is crafted.
        </p>
      </div>

      <div className="exp-viewport">
        <div
          className="exp-track"
          style={{
            transform: `translateX(-${index * 100}%)`,
          }}
        >
          {Array.from({ length: totalSlides }).map((_, slideIndex) => (
            <div className="exp-slide" key={slideIndex}>
              {experiences
                .slice(
                  slideIndex * cardsPerView,
                  slideIndex * cardsPerView + cardsPerView
                )
                .map((item) => (
                  <ExperienceCard key={item.id} item={item} />
                ))}
            </div>
          ))}
        </div>
      </div>

      <div className="exp-dots">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <button
            key={i}
            className={`dot ${i === index ? "active" : ""}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </section>
  );
}
