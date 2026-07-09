import "./AboutUsHeroSection.css";
import abouthero from "../../../assets/images/aboutusheroimage.jpg";

function AboutUsHeroSection() {
    return (
        <section className="about-hero">

            {/* Background */}
            <img src={abouthero} className="about-hero-bg" />

            {/* Content */}
            <div className="about-hero-content container">

                {/* LEFT */}
                <div className="about-hero-left">
                    <span className="about-pill">• About Us</span>

                    <h1>
                        Experience the <br />
                        Future of Mobility <br />
                        with MOBILIS
                    </h1>
                </div>

                {/* RIGHT */}
                <div className="about-hero-right">

                    <div className="a-scroll-indicator">
                        <div className="a-mouse" />
                        <span>Scroll Down</span>
                    </div>

                    <p>
                        Discover the art and science of assistive technology —
                        transforming lives with advanced orthotics, prosthetics,
                        and seating solutions across the UAE and GCC.
                    </p>

                    <a href="#" className="discover-btn">
                        Discover More <span>➜</span>
                    </a>



                </div>

            </div>
        </section>
    );
}

export default AboutUsHeroSection;
