import { useState, useRef, useEffect } from "react";
import "./ServiceSelector.css";
import ServiceDropdown from "./ServiceDropdown";

const services = [
  "Orthotics",
  "Prosthetics",
  "Orthoprosthetics",
  "Seating & Positioning",
];

function ServiceSelector() {
  const [active, setActive] = useState(services[0]);
  const [open, setOpen] = useState(false);

  const selectorRef = useRef(null);

  const handleClick = (service) => {
    if (service === active) {
      setOpen(!open);
    } else {
      setActive(service);
      setOpen(service === "Orthotics");
    }
  };

  useEffect(() => {
    function handleOutsideClick(e) {
      if (
        selectorRef.current &&
        !selectorRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () =>
      document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <section className="service-selector" ref={selectorRef}>
      <div className="service-selector-inner">
        {services.map((service) => (
          <button
            key={service}
            type="button"
            className={`service-pill ${active === service ? "active" : ""
              }`}
            onClick={() => handleClick(service)}
          >

            {service}
            <span className="service-arrow">▾</span>
          </button>
        ))}
      </div>

      {open && active === "Orthotics" && <ServiceDropdown />}
    </section>
  );
}

export default ServiceSelector;
