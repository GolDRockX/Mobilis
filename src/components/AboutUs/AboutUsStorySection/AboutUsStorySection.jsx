import "./AboutUsStorySection.css";
import aboutimg1 from "../../../assets/images/aboutusstoryimage1.jpg";
import aboutimg2 from "../../../assets/images/aboutusstoryimage2.jpg";

function AboutUsStorySection() {
    return (
        <section className="about-story container">

            {/* TOP CONTENT */}
            <div className="about-story-top">

                {/* LEFT INFO */}
                <div className="about-story-left">
                    <span className="story-pill">• Our Story</span>

                    <div className="story-stat">
                        <h2>25+</h2>
                        <p>years of expertise in assistive technology</p>
                    </div>
                </div>

                {/* RIGHT TEXT */}
                <div className="about-story-right">
                    <p>
                        MOBILIS is a leader in customized orthotics, prosthetics,
                        and seating solutions. By blending engineering, computation,
                        digital design, and industrial technology, we’re redefining
                        traditional workflows and delivering innovative, cost-effective
                        devices that transform mobility and quality of life.
                    </p>

                    <a href="#" className="learn-btn">
                        Learn More <span>➜</span>
                    </a>
                </div>

            </div>

            {/* IMAGES */}
            <div className="about-story-images">
                <div className="story-img-large">
                    <img src={aboutimg1} />
                </div>

                <div className="story-img-small">
                    <img src={aboutimg2} />
                </div>
            </div>

            <div className="about-story-border">

            </div>

        </section>
    );
}

export default AboutUsStorySection;
