import "./AboutUsTeamSection.css";
import aboutteam1 from "../../../assets/images/aboutusteamimage1.jpg";
import aboutteam2 from "../../../assets/images/aboutusteamimage2.jpg";
import aboutteam3 from "../../../assets/images/aboutusteamimage3.jpg";

function AboutUsTeamSection() {
    return (
        <section className="team-section">

            <div className="team-header">
                <span className="team-badge">
                    <span className="dot"></span>
                    Our Team
                </span>

                <h2>
                    OVER <span>25 YEARS</span> OF PROVEN <br />
                    EXPERTISE
                </h2>
            </div>

            <div className="team-grid">

                {/* LEFT BLOCK */}
                <div className="team-left">
                    <img src={aboutteam1} alt="Team Expertise" />

                    <p>
                        Our team of highly skilled professionals bring international
                        recognition and experience from Europe to the Middle East.
                        With decades of innovation in assistive technology,
                        manufacturing, and clinical services, MOBILIS is built
                        on trusted excellence.
                    </p>

                    <a href="#" className="team-btn">
                        Learn More
                        <span className="about-team-arrow">➜</span>
                    </a>
                </div>

                {/* MIDDLE IMAGE */}
                <div className="team-image">
                    <img src={aboutteam2} alt="Team Member" />
                </div>

                {/* RIGHT IMAGE */}
                <div className="team-image">
                    <img src={aboutteam3} alt="Technology" />
                </div>

            </div>

        </section>
    );
}

export default AboutUsTeamSection;
