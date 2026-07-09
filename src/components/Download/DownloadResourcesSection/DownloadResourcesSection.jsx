import { useState } from "react";
import "./DownloadResourcesSection.css";
import data from "./DownloadResourcesData";

function Column({ columnData }) {
  const [openId, setOpenId] = useState(columnData.sections[0].id);

  return (
    <div className="downloadColumn">
      <h3 style={{ color: columnData.color }}>{columnData.title}</h3>

      {columnData.sections.map(section => {
        const isOpen = openId === section.id;

        return (
          <div
            key={section.id}
            className={`accordionItem ${isOpen ? "open" : ""}`}
          >
            <button
              className="accordionHeader"
              style={{ color: columnData.color }}
              onClick={() => setOpenId(isOpen ? null : section.id)}
            >
              <span>{section.title}</span>
              <span
                className="accordionIcon"
                style={{
                  borderColor: columnData.color,
                  color: columnData.color
                }}
              >
                {isOpen ? "↑" : "↓"}
              </span>
            </button>

            <div className="accordionContent">
              {section.items.length === 0 ? (
                <p className="emptyText">No resources available</p>
              ) : (
                section.items.map((item, index) => (
                  <div key={index} className="downloadRow">
                    <span>{item}</span>
                    <button className="downloadBtn">Download</button>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DownloadResourcesSection() {
  return (
    <section className="downloadResources">
      <div className="downloadContainer">
        <div className="downloadHeader">
          <h2>DOWNLOADABLE RESOURCES</h2>
          <p>For doctors and patients in Prosthetics and Orthotics</p>
        </div>

        <div className="downloadGrid">
          <Column columnData={data.patient} />
          <Column columnData={data.hcp} />
        </div>
      </div>
    </section>
  );
}

export default DownloadResourcesSection;
