import "./InnerPage1TreatmentSection.css";
import treatmentimg1 from "../../../assets/images/innerpage1treatmentimage1.jpg";
import treatmentimg2 from "../../../assets/images/innerpage1treatmentimage2.jpg";

function InnerPage1TreatmentSection() {
    return (
        <section className="inner-page-treatment-section">

            <div className="treatment-container-1">

                {/* LEFT TEXT */}
                <div className="treatment-text-1">
                    <p>
                        A special seating system becomes necessary when children are unable to sit upright
                        independently, prohibiting development in other areas. Proper wheelchair positioning
                        (custom made wheelchair) is about providing appropriate and comfortable support for
                        those who cannot do this for themselves.
                    </p>

                    <p>
                        Comfortable positioning is relaxing, comfortable, supportive, and sustainable.
                        The seating system provided should be easy to live with and have minimal impact
                        on carers. The target outcomes for a seating system are to enhanced function,
                        comfort, sleep, and protection of body shape as well as more simple care routines.
                        Symmetric seating system is designed to position the child as symmetrically and
                        upright as possible to prevent possible complications like slanted postures, hip
                        problems, and contractures.
                    </p>

                    <p>
                        Children and young people who can sit actively with spine or trunk deformity which
                        can be correctable actively are suggested with for Symmetric moulded seating orthosis.
                    </p>

                    <p className="highlight-1">
                        MOBILIS <span>seating specialists</span> individually assess the requirement and
                        design a perfect fitting seating orthosis to address the medical issues.
                    </p>
                </div>

                {/* RIGHT IMAGE */}
                <div className="treatment-image-card-1">
                    <img src={treatmentimg1} alt="Seating Orthosis Treatment" />
                </div>

            </div>

            <div className="treatment-container-2">

                {/* LEFT TEXT */}
                <div className="treatment-text-2">
                    <h3>
                        TREATMENT GOAL
                    </h3>

                    <p>
                        Active correction of scoliotic or kyphotic deformities independently.
                    </p>

                    <p>
                        Prevent progression idiopathic, congenital or neuromuscular scoliosis or kyphosis.
                    </p>

                    <p>
                        Promoting activity of the pelvic leg musculature or strengthening shoulder girdle musculature
                    </p>
                </div>

                {/* RIGHT IMAGE */}
                <div className="treatment-image-card-2">
                    <img src={treatmentimg2} alt="Seating Orthosis Treatment" />
                </div>

            </div>

        </section>
    );
}

export default InnerPage1TreatmentSection;
