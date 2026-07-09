import "./InnerPage2AbnormalSection.css";
import abnormalimg from "../../../assets/images/innerpage2abnormalimage.jpg";

function InnerPage2AbnormalSection() {
    return (
        <section className="inner-page-treatment-section">
            <div className="treatment-container-2">

                {/* LEFT TEXT */}
                <div className="treatment-text-2">

                    <p>
                        Most abnormal skull shapes develop during pregnancy and this may result in flattening of one side of the head (positional head deformities).. It may also be related to a tightened neck muscle on one side (torticollis), abnormal neck spine (fusion) or abnormal eye muscles.
                    </p>

                    <p>
                        If the parents are aware and respond timely, our Paediatric Head Deformities Clinic can help and provide detailed analysis and solutions for infantile head deformities. We are proud to be a clinical provider of cranial remodeling orthosis, manufacturing through digital technologies which offer improved comfort, fantastic aesthetics, gentle care, and fast delivery.
                    </p>
                </div>

                {/* RIGHT IMAGE */}
                <div className="treatment-image-card-2">
                    <img src={abnormalimg} alt="Seating Orthosis Treatment" />
                </div>

            </div>
        </section>
    );
}

export default InnerPage2AbnormalSection;