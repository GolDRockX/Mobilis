import "./ProcessHeroSection.css";
import Processhero from "../../../assets/images/processheroimage1.jpg";

function ProcessHeroSection() {
    return (
        <section className="process-hero-section">
            <div
                className="process-hero-container"
                style={{ backgroundImage: `url(${Processhero})` }}
            >
                <div className="process-hero-overlay"></div>

                    <div className="process-hero-content">
                        <h1>OUR <br /> PROCESS</h1>

                        <p>
                            An integrated process sets our service apart. From the first time
                            we meet a patient at MOBILIS, we ensure that every stage of our
                            patient’s journey remains safe and smooth. We understand that our
                            customers not only need the products, but also follow up care. We
                            know that no two individuals are the same nor are their requirements.
                            Therefore, we give personalized attention crafting a treatment plan
                            that fits the needs of each customer. Transparency is part of our
                            culture and we communicate every development in the process to
                            inspire confidence.
                        </p>
                    </div>

                
            </div>
        </section>
    );
}

export default ProcessHeroSection;
