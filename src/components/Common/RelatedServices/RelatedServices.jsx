import { Link } from "react-router-dom";
import "./RelatedServices.css";
import relatedServices from "./relatedServicesData";

function RelatedServices() {
  return (
    <section className="related-services">

      <div className="related-container">

        <div className="related-header">
          <h2>Related Services</h2>
          <div className="related-line"></div>
        </div>

        <div className="related-grid">
          {relatedServices.map((item, index) => (
            <Link
              to={item.link}
              key={index}
              className={`related-card ${item.color}`}
            >
              <img src={item.image} alt={item.title} />

              <span>{item.title}</span>
            </Link>
          ))}
        </div>

      </div>

    </section>
  );
}

export default RelatedServices;
