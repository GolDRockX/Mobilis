import "./OurPartnerNationalSection.css";
import partnernation1 from "../../../assets/images/partnernationalimage1.jpg";
import partnernation2 from "../../../assets/images/partnernationalimage2.jpg";

function PartnerCard({ image, title, description, variant }) {
    return (
        <div className={`partnerCard ${variant}`}>
            <div className="partnerImageWrapper">
                <img src={image} alt={title} />

                <a className="n-readMoreBtn">
                    Read More <span>↗</span>
                </a>
            </div>

            <div className="partnerText">
                <h4>{title}</h4>
                <p>{description}</p>
            </div>
        </div>
    );
}

function OurPartnerNationalSection() {
    return (
        <section className="partnerNational">
            <div className="partnerNationalContainer">

                <div className="sectionHeader">
                    <h2>
                        <span>NATIONAL</span> PARTNER
                    </h2>
                    <p>
                        MOBILIS UAE associate with EMIRATES SPORTSMED human performance assessment centre in Dubai.
                    </p>
                </div>

                <div className="partnerGrid">

                    <PartnerCard
                        image={partnernation1}
                        title="EMIRATES SPORTSMED"
                        variant="leftCard"
                        description="MOBILIS UAE is associated with the EMIRATES SPORTSMED, a human performance assessment centre in Dubai. We will be able to assess our patients by using cutting edge technologies for fine-tuning the prosthesis, pre and post orthotic fitting to measure the progress and planning an effective rehabilitation and performing insole pressure analysis. EMIRATES SPORTSMED is a world class facility in Dubai with advanced technologies such as NanoM gait lab, posture analysis and comprehensive human performance assessments."
                    />

                    <PartnerCard
                        image={partnernation2}
                        title="AL JALILA FOUNDATION"
                        variant="rightCard"
                        description="Al Jalila Foundation, is a global philanthropic organisation dedicated to transforming lives through medical research, education and treatment was founded by His Highness Sheikh Mohammed Bin Rashid Al Maktoum, Vice-President and Prime Minister of the United Arab Emirates (UAE) and Ruler of Dubai to position Dubai and the UAE at the forefront of medical innovation.
A’awen, ‘support’ in Arabic, is Al Jalila Foundation’s treatment support program that provides lifesaving medical assistance to UAE-based patients in need. The program alleviates some of the financial burden of patients suffering from life threatening illnesses who are unable to afford quality healthcare.

MOBILIS is proud to be the Prosthetic-Orthotic-Seating partner of Al Jalila Foundation to cater patients’ needs to improve the quality of life"
                    />

                </div>

            </div>
        </section>
    );
}

export default OurPartnerNationalSection;