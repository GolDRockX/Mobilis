import "./AboutUsEnvironmentSection.css";
import aboutenvironment from "../../../assets/images/aboutusenvironmentimage.jpg";

function AboutUsEnvironmentSection() {
    return (
        <section className="environment-section">
            <div className="environment-container">

                {/* Left Content */}
                <div className="environment-content">

                    <div className="environment-badge">
                        <span className="dot"></span>
                        Environment
                    </div>

                    <h1>
                        OUR WORK <br />
                        ENVIRONMENT
                    </h1>

                    <p>
                        Our people work in harmony to deliver a comfortable and joyful
                        experience. Our workspace exudes compassion, inspiration, and
                        professionalism so that our customers, patients, their family,
                        and our staff are well looked after. Our staff understands the
                        importance of recognizing and respecting the unique aspects of
                        each individual and to respond in an interactive and
                        collaborative manner.
                    </p>

                </div>

                {/* Right Image */}
                <div className="environment-image">
                    <img src={aboutenvironment} alt="Work Environment" />
                </div>

            </div>
        </section>
    );
}

export default AboutUsEnvironmentSection;
