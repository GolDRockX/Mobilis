import { useState } from "react";
import "./BlogFeaturesSection.css";
import { BlogFeaturesData } from "./BlogFeaturesData";
import blogstoriesicon from "../../../assets/images/blogstoriesicon.png";


function BlogFeaturesSection() {
  const [active, setActive] = useState(0);
  const item = BlogFeaturesData[active];

  return (
    <section className="features-section">
      <div className="features-section-blogBadge">
        <img src={blogstoriesicon} alt="" />
        <span>Features</span>
      </div>

      <div className="features-section-content">

        {/* IMAGE */}
        <div className="features-section-image">
          <img key={item.image} src={item.image} alt={item.title} />
        </div>

        {/* TEXT */}
        <div className="features-section-text">
          <span className="features-section-date">{item.date}</span>

          <h3>{item.title}</h3>

          <p className="features-section-desc">{item.desc}</p>

          <span className="features-section-author">| By {item.author}</span>

          <div className="features-section-nav">
            {BlogFeaturesData.map((i, index) => (
              <button
                key={i.id}
                className={index === active ? "active" : ""}
                onClick={() => setActive(index)}
              >
                {i.id}
              </button>
            ))}
            <span className="features-section-viewall">view all →</span>
          </div>

        </div>

      </div>

    </section>
  );
}

export default BlogFeaturesSection;
