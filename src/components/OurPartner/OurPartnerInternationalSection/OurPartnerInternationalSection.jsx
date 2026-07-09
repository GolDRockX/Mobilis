import "./OurPartnerInternationalSection.css";
import partnerinter1 from "../../../assets/images/partnerinternationalimage1.jpg";
import partnerinter2 from "../../../assets/images/partnerinternationalimage2.jpg";
import partnerinter3 from "../../../assets/images/partnerinternationalimage3.jpg";

function PartnerCard({ image, title, description, variant }) {
    return (
        <div className={`partnerCard ${variant}`}>
            <div className="partnerImageWrapper">
                <img src={image} alt={title} />

                <a href="#" className="i-readMoreBtn">
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

function OurPartnerInternationalSection() {
    return (
        <section className="partnerInternational">
            <div className="partnerInternationalContainer">

                <div className="sectionHeader">
                    <h2>
                        <span>INTERNATIONAL</span> PARTNERS
                    </h2>
                    <p>
                        MOBILIS clinicians are certified engineers for most modern
                        technologies from Ottobock for Prosthetic and Orthotic solutions.
                    </p>
                </div>

                <div className="partnerGrid">

                    <PartnerCard
                        image={partnerinter1}
                        title="OTTOBOCK"
                        variant="leftCard"
                        description="All around the world, the Ottobock name stands for state-of-the-art, high quality products and services in the field of medical technology. The goal of helping restore mobility for people with disabilities – and protecting the mobility they have retained – stands behind each and every one of the company’s products. Ottobock’s conviction that quality of life is closely connected to a maximum of individual freedom and independence is a key concept that has been a major influence throughout the company’s nearly 100-year history. It also provides targeted focus for the development of new products.

MOBILIS clinicians are certified engineers specialised in modern technology and know-how from Ottobock for Prosthetic and Orthotic solutions"
                    />

                    <PartnerCard
                        image={partnerinter2}
                        title="OSSUR"
                        variant="rightCard"
                        description="Össur is one of the world leading non-invasive mobility solutions provider on the market today. They are true advocates of “Life Without Limitations’’, with a focus on Prosthetic, Osteoarthritis and Injury Solutions. For many years Össur has served an extensive range of medical professionals, and worked closely with leading research and educational bodies in our field. We maintain a powerful service ethic, listening and responding to the diverse needs of our customers across the continent.."
                    />

                    <PartnerCard
                        image={partnerinter3}
                        title="THIRD PARTNER"
                        variant="leftCard"
                        description="Stamos Silitec AG is one of the leading custom silicon prostheses manufacturers from Switzerland. When it comes to silicon prostheses, individuality comes first. Every person’s needs are unique, and so are the restorations which Stamos Silitec AG offer with their wide product spectrum which includes finger prostheses, partial hand prostheses, arm prostheses, toe prostheses, forefoot prostheses and leg prostheses.
Manufacturing a body part is truly a work of art with matching normal skin tone where you cannot recognize differences between its natural shape, colour, and design. It not only fascinates our customers but also helps to achieve functional advantages and high wearing comfort."
                    />

                </div>

            </div>
        </section>
    );
}

export default OurPartnerInternationalSection;