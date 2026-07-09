import "./AboutUsGoalSection.css";
import aboutgoal from "../../../assets/images/aboutusgoalimage.jpg";

function AboutUsGoalSection() {
    return (
        <section className="goal-section">
            <div className="goal-container">

                {/* LEFT CONTENT */}
                <div className="goal-content">

                    <div className="goal-badge">
                        <span className="dot"></span>
                        Goals
                    </div>

                    <h1>
                        EMPOWERING <br />
                        LIVES, REMOVING <br />
                        BARRIERS
                    </h1>

                    <p>
                        Our goal is simple — to enable people to live their lives to the fullest.
                        We actively support rehabilitation, improve quality of life, and help
                        our patients return to the activities they love.
                    </p>

                </div>

                {/* RIGHT IMAGE */}
                <div className="goal-image-wrapper">

                    <img src={aboutgoal} alt="Our Goals" />

                    {/* Glass Card */}
                    <div className="goal-glass-card">
                        <div className="culture-badge">
                            Our Culture
                        </div>

                        <p>
                            Rooted in respect, dignity, compassion, and transparency,
                            ensuring every interaction is ethical and caring.
                        </p>
                    </div>

                </div>

            </div>
        </section>
    );
}

export default AboutUsGoalSection;
