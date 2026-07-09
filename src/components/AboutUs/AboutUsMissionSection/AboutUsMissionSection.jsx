import "./AboutUsMissionSection.css";

function AboutUsMissionSection() {
    return (
        <section className="mission-section">
            <div className="mission-container">

                {/* Top Row */}
                <div className="mission-header">
                    <div className="mission-badge">
                        <span className="dot"></span>
                        Mission & Vision
                    </div>

                    <h1>
                        SHAPING THE FUTURE OF <br />
                        ASSISTIVE TECHNOLOGY
                    </h1>

                    <a href="#" className="process-btn">
                        Learn Our Process
                        <span className="about-mission-arrow">➜</span>
                    </a>
                </div>

                {/* Cards */}
                <div className="mission-cards">

                    {/* Vision Card */}
                    <div className="card vision-card">
                        <div className="card-number">01.</div>

                        <h2>Vision</h2>
                        <p>
                            To become the leading company in customized,
                            advanced, and digitized assistive devices across
                            the Middle East.
                        </p>
                    </div>

                    {/* Mission Card */}
                    <div className="card mission-card">
                        <div className="card-number">02.</div>

                        <h2>Mission</h2>
                        <p>
                            To innovate continuously, delivering high-quality
                            devices that maximize quality of life and exceed
                            expectations in quality, delivery, and cost.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
}

export default AboutUsMissionSection;
