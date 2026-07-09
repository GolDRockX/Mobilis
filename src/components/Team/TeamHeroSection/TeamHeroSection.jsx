import "./TeamHeroSection.css";
import teamhero from "../../../assets/images/teamheroimage.jpg";

function TeamHeroSection() {
    return (
        <section className="teamHero">
            <div className="teamHeroContainer">
                <img src={teamhero} alt="Our Team" />

                <div className="teamHeroContent">
                    <h1>OUR TEAM</h1>
                </div>
            </div>
        </section>
    );
}

export default TeamHeroSection;