import { useState } from "react";
import "./ProcessAccordianSection.css";
import data from "./ProcessAccordianData";

function ProcessAccordianSection() {
  const [activeId, setActiveId] = useState(1);

  const toggleAccordion = (id) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <section className="process-accordion">
      <div className="process-accordion-container">
        {data.map((item) => (
          <div
            key={item.id}
            className={`accordion-item ${
              activeId === item.id ? "active" : ""
            }`}
          >
            <div
              className="accordion-header"
              onClick={() => toggleAccordion(item.id)}
            >
              <div className="accordion-left">
                <span className="accordion-number">{item.number}</span>
                <h3>{item.title}</h3>
              </div>

              <div className="accordion-icon">
                {activeId === item.id ? "↗" : "↘"}
              </div>
            </div>

            <div
              className={`accordion-content ${
                activeId === item.id ? "open" : ""
              }`}
            >
              <p>{item.content}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProcessAccordianSection;
