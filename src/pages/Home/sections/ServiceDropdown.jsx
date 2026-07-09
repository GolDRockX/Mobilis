import { useState, useRef, useLayoutEffect } from "react";
import { orthoticsData } from "../data/servicesData";
import "./ServiceDropdown.css";

function ServiceDropdown() {
  const [activeItem, setActiveItem] = useState(orthoticsData[3]);
  const [offsetTop, setOffsetTop] = useState(0);

  const itemRefs = useRef([]);
  const dropdownRef = useRef(null);
  const submenuRef = useRef(null);

  const updatePosition = (item, index) => {
    setActiveItem(item);

    requestAnimationFrame(() => {
      const itemEl = itemRefs.current[index];
      const dropdownEl = dropdownRef.current;
      const submenuEl = submenuRef.current;

      if (!itemEl || !dropdownEl || !submenuEl) return;

      const itemTop = itemEl.offsetTop;
      const dropdownHeight = dropdownEl.clientHeight;
      const submenuHeight = submenuEl.clientHeight;

      // max allowed Y so submenu stays inside dropdown
      const maxOffset = dropdownHeight - submenuHeight;

      const clampedOffset = Math.min(itemTop, Math.max(0, maxOffset));

      setOffsetTop(clampedOffset);
    });
  };

  return (
    <div className="service-dropdown" ref={dropdownRef}>
      <div className="dropdown-inner">

        {/* Left */}
        <ul className="dropdown-left">
          {orthoticsData.map((item, index) => (
            <li
              key={item.title}
              ref={(el) => (itemRefs.current[index] = el)}
              className={activeItem.title === item.title ? "active" : ""}
              onMouseEnter={() => updatePosition(item, index)}
            >
              {item.title}
            </li>
          ))}
        </ul>

        {/* Middle */}
        <div
          ref={submenuRef}
          className="dropdown-middle"
          style={{ transform: `translateY(${offsetTop}px)` }}
        >
          {activeItem.subItems.map((sub) => (
            <a key={sub.path} href={sub.path} className="submenu-link">
              {sub.label}
            </a>
          ))}
        </div>

        {/* Right */}
        <div className="dropdown-right">
          <img src={activeItem.image} alt={activeItem.title} />
        </div>

      </div>
    </div>
  );
}

export default ServiceDropdown;
