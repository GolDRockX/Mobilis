import "./AboutUsRewardSection.css";
import aboutreward from "../../../assets/images/aboutusrewardimage.jpg";

function AboutUsRewardSection() {
    return (
        <section className="reward-section">
            <div 
                className="reward-container"
                style={{ backgroundImage: `url(${aboutreward})` }}
            >
                <div className="reward-overlay">
                    <div className="reward-content">

                        <div className="reward-badge">
                            <span className="dot"></span>
                            Reward
                        </div>

                        <h1>
                            EVERY SMILE, OUR <br />
                            TRUE REWARD
                        </h1>

                        <p>
                            The smile on the faces of our customers is the most rewarding experience for us. 
                            We take pride in seeing the difference we add to their lives. We believe that 
                            best products in the world can’t replace the natural appearance and function 
                            of the human body. Therefore, we see it as our responsibility to provide best 
                            quality devices and patient care in a timely and cost-effective manner by highly 
                            competent and enthusiastic professional
                        </p>

                    </div>
                </div>
            </div>
        </section>
    );
}

export default AboutUsRewardSection;
