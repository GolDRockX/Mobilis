import "./Mobilis4HeroSection.css";
import mobilishero from "../../../assets/images/mobilis4heroimage.jpg";

function Mobilis4HeroSection() {
    return (
        <section className="mobilis-hero">
            <img
                src={mobilishero}
                alt="Mobilis 4.0 Hero"
                className="mobilis-hero-bg"
            />

            <div className="mobilis-hero-overlay"></div>

            <div className="mobilis-hero-content">
                <h1>
                    MOBILIS <span>4.0</span>
                </h1>
            </div>

            <div className="scroll-indicator">
                <span></span>
                <p>Scroll Down</p>
            </div>
        </section>
    );
}

export default Mobilis4HeroSection;
