import { useState } from "react";
import "./AboutUsValuesSection.css";

const VALUES = [
  {
    title: "Excellence",
    text: "We pursue the highest standards in every solution we design, ensuring accuracy, durability, and patient comfort at every stage."
  },
  {
    title: "Innovation",
    text: "We embrace emerging technologies like 3D scanning and digital fabrication to continuously improve patient outcomes."
  },
  {
    title: "Passion",
    text: "Our team is driven by purpose — improving mobility and enhancing quality of life for every individual we serve."
  },
  {
    title: "Respect",
    text: "We treat every patient, caregiver, and colleague with dignity, empathy, and professionalism."
  },
  {
    title: "Growth",
    text: "We constantly evolve through research, learning, and collaboration to deliver better mobility solutions."
  },
  {
    title: "Team Spirit",
    text: "Our multidisciplinary team works together to create personalized, effective assistive technology solutions."
  },
  {
    title: "Continuous Learning",
    text: "Education and training remain at the core of our practice to stay ahead in clinical innovation."
  },
  {
    title: "Making a Difference",
    text: "Everything we do aims to empower independence and transform everyday living for our patients."
  }
];

function AboutUsValuesSection() {
  const [active, setActive] = useState(0);

  return (
    <section className="values-section">

      <span className="values-pill">Values</span>
      <h2>OUR CORE VALUES</h2>

      <p className="values-desc">
        {VALUES[active].text}
      </p>

      <div className="values-buttons">
        {VALUES.map((value, index) => (
          <button
            key={index}
            className={`value-btn ${active === index ? "active" : ""}`}
            onClick={() => setActive(index)}
          >
            {value.title}
          </button>
        ))}
      </div>

    </section>
  );
}

export default AboutUsValuesSection;
