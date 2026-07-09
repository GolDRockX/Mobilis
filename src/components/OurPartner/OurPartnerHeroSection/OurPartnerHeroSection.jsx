import "./OurPartnerHeroSection.css";
import partnerhero from "../../../assets/images/partnerheroimage.jpg";

function OurPartnerHeroSection() {
    return (
        <section className="partnerHero">
            <div className="partnerHeroContainer">
                <img src={partnerhero} alt="Strategic Partners" />

                <div className="partnerHeroOverlay"></div>

                <div className="partnerHeroContent">
                    <h1>
                        STRATEGIC <br />
                        PARTNERS
                    </h1>

                    <p>
                        Building stronger healthcare <br />
                        ecosystems together.
                    </p>
                </div>
            </div>
        </section>
    );
}

export default OurPartnerHeroSection;