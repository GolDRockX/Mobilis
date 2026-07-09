import "./InnerPage1HeroSection.css";
import heroimg from "../../../assets/images/innerpage1heroimage.png";

function InnerPage1HeroSection() {
  return (
    <section className="inner-page-hero-section">

      <div className="inner-hero-card">

        {/* LEFT CONTENT */}
        <div className="inner-hero-content">

          <span className="hero-pill">
            <span className="dot"></span>
            SEATING AND POSITIONING
          </span>

          <h1>
            Passive Symmetric <br />
            Seating Orthosis
          </h1>

          <p>
            Designed to promote symmetry and
            comfort in seated positioning
          </p>

        </div>

        {/* RIGHT IMAGE */}
        <div className="inner-hero-image">
          <img src={heroimg} alt="Seating Orthosis" />
        </div>

      </div>

    </section>
  );
}

export default InnerPage1HeroSection;
