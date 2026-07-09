import "./CareersHeroSection.css";
import careershero1 from "../../../assets/images/careersheroimage1.jpg";
import careershero2 from "../../../assets/images/careersheroimage2.jpg";
import careershero3 from "../../../assets/images/careersheroimage3.jpg";

function CareersHeroSection() {
    return (
        <section className="careers-hero">
            <div className="careers-hero-inner">

                {/* Left Content */}
                <div className="careers-hero-text">
                    <h1>
                        THE FUTURE OF WORK <br />
                        STARTS <span>NOW.</span>
                    </h1>

                    <h2>SKILL UP & SHIFT GEARS.</h2>
                </div>

                {/* Right Content */}
                <div className="careers-hero-right">
                    <div className="careers-hero-images">
                        <img src={careershero1} alt="Career 1" />
                        <img src={careershero2} alt="Career 2" />
                        <img src={careershero3} alt="Career 3" />
                    </div>

                    <p>
                        Stop just searching, start thriving. We’ll equip you
                        with the skills and confidence to land your dream role.
                    </p>

                    <a href="#" className="apply-btn">
                        APPLY NOW
                        <span>→</span>
                    </a>
                </div>

            </div>
        </section>
    );
}

export default CareersHeroSection;
