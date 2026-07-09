import { useState } from "react";
import "./ComfortSection.css";
import { comfortItems } from "./comfortData";
import hero from "../../../assets/images/homecomfort-person.png";
import comfortText from "../../../assets/images/homecomfort-text.png";


function ComfortSection() {
  const [active, setActive] = useState(null);

  return (
    <section className="comfort">

      {/* background word */}
      <img src={comfortText} alt="" className="comfort-bg-text" />

      {/* center person */}
      <img src={hero} className="comfort-hero" />

      {/* floating items */}
      {comfortItems.map(item => (
        <div
          key={item.id}
          className={`comfort-item ${item.position} ${active === item.id ? "active" : ""}`}
          onMouseEnter={() => setActive(item.id)}
          onMouseLeave={() => setActive(null)}
        >
          <img
            src={active === item.id ? item.big : item.small}
            className="comfort-img"
          />

          <span className="comfort-label">{item.label}</span>
        </div>
      ))}

    </section>
  );
}

export default ComfortSection;
