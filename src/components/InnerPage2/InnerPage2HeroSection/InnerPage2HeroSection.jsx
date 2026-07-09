import "./InnerPage2HeroSection.css";
import heroimg from "../../../assets/images/innerpage1heroimage.png";

function InnerPage1HeroSection() {
    return (
        <section className="inner-page-hero-section">

            <div className="inner-2-hero-card">

                {/* LEFT CONTENT */}
                <div className="inner-2-hero-content">

                    <span className="hero-pill">
                        <span className="dot"></span>
                        Orthotics
                    </span>

                    <h1>
                        Paediatric Head <br />
                        Deformities Clinic
                    </h1>

                    <p>
                        We treat abnormal head shapes in infants with innovative orthotic solutions
                    </p>

                </div>

                {/* RIGHT IMAGE */}
                <div className="inner-2-hero-image">
                    <img src={heroimg} alt="Seating Orthosis" />
                </div>

            </div>

        </section>
    );
}

export default InnerPage1HeroSection;
