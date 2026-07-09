import { useState } from "react";
import { insights } from "./insights";
import "./insights.css";

export default function InsightsSection() {
  const [active, setActive] = useState(0);
  const item = insights[active];

  return (
    <section className="insights">

      <div className="insights-header">
        <h2>
          <span className="green">INSIGHTS</span> & 
          <span className="blue"> INNOVATION</span>
          <br /> AT MOBILIS
        </h2>

        <p>
          Stay informed on the latest advances in orthotics, prosthetics, and
          mobility solutions. From cutting-edge 3D printing breakthroughs to
          patient success stories, our Innovation Centre brings you ideas that
          drive better care and more independent lives.
        </p>
      </div>

      <div className="insights-content">

        {/* IMAGE */}
        <div className="insights-image">
          <img key={item.image} src={item.image} alt={item.title} />
        </div>

        {/* TEXT */}
        <div className="insights-text">
          <span className="date">{item.date}</span>

          <h3>{item.title}</h3>

          <p className="desc">{item.desc}</p>

          <span className="author">| By {item.author}</span>

          <div className="insight-nav">
            {insights.map((i, index) => (
              <button
                key={i.id}
                className={index === active ? "active" : ""}
                onClick={() => setActive(index)}
              >
                {i.id}
              </button>
            ))}
            <span className="viewall">view all →</span>
          </div>

        </div>

      </div>

    </section>
  );
}
