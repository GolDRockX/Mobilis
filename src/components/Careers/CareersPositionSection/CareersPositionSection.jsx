import React, { useState } from "react";
import "./CareersPositionSection.css";
import { categories, positions } from "./CareersPositionData";
import locationIcon from "../../../assets/images/careerspositionlocation.png";
import timeIcon from "../../../assets/images/careerspositiontime.png";


const CareeersPositionSection = () => {
  const [activeCategory, setActiveCategory] = useState("VIEW ALL");

  const filteredPositions =
    activeCategory === "VIEW ALL"
      ? positions
      : positions.filter((job) => job.category === activeCategory);

  return (
    <section className="careersPosition">
      <div className="careersPosition__container">

        {/* Header */}
        <div className="careersPosition__header">
          <div className="careersPosition__badge">
            <span className="dot"></span> Open Position
          </div>

          <h2 className="careersPosition__title">
            LAUNCH YOUR CAREER SEARCH <span>TODAY!</span>
          </h2>

          <p className="careersPosition__subtitle">
            Explore Open Positions Across Industries.
          </p>
        </div>

        {/* Tabs */}
        <div className="careersPosition__tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`tab ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Jobs */}
        <div className="careersPosition__list">
          {filteredPositions.map((job) => (
            <div className="jobRow" key={job.id}>
              <div className="jobRow__left">
                <div className="jobRow__title">
                  {job.title}
                  <span className="jobTag">{job.tag}</span>
                </div>

                <p className="jobRow__desc">{job.description}</p>
              </div>

              <div className="jobRow__right">
                <button className="applyBtn">
                  APPLY NOW <span>›</span>
                </button>

                <div className="jobMeta">
                  <div className="metaItem">
                    <img src={locationIcon} alt="location" />
                    <span>{job.location}</span>
                  </div>

                  <div className="metaItem">
                    <img src={timeIcon} alt="type" />
                    <span>{job.type}</span>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CareeersPositionSection;
