import { useRef, useState } from "react";
import "./InnerPage2TreatmentSection.css";
import treatmentp1 from "../../../assets/images/innerpage2treatmentimagepart1.jpg";
import treatmentp21 from "../../../assets/images/innerpage2treatmentimagepart2-1.jpg";
import treatmentp22 from "../../../assets/images/innerpage2treatmentimagepart2-2.jpg";
import treatmentp3 from "../../../assets/images/innerpagetreatmentimagepart3.png";
import treatmentp4 from "../../../assets/images/innerpage2treatmentimagepart4.jpg";
import treatmentbefore from "../../../assets/images/innerpage2treatmentimagepart5before.jpg";
import treatmentafter from "../../../assets/images/innerpage2treatmentimagepart5after.jpg";

function InnerPage2TreatmentSection() {

    const containerRef = useRef(null);
    const [position, setPosition] = useState(1);
    const [dragging, setDragging] = useState(false);

    const updatePosition = (clientX) => {
        const rect = containerRef.current.getBoundingClientRect();
        let percent = ((clientX - rect.left) / rect.width) * 100;
        percent = Math.max(0, Math.min(100, percent));
        setPosition(percent);
    };

    const handleMouseDown = () => setDragging(true);
    const handleMouseUp = () => setDragging(false);

    const handleMouseMove = (e) => {
        if (!dragging) return;
        updatePosition(e.clientX);
    };

    const handleTouchMove = (e) => {
        updatePosition(e.touches[0].clientX);
    };

    const slideAll = () => setPosition(100);

    return (
        <section className="treatment-section">

            <div className="head-part">
                <div className="head-part-heading">
                    <h3>1. Positional Head Deformities</h3>
                </div>

                <div className="head-part-image">
                    <img src={treatmentp1} alt="Positional Head Deformities" />
                </div>

                <div className="head-part-content">
                    <p>
                        These can occur when a baby sleeps in the same position during pregnancy or due to problems with the neck muscles (torticollis). Infant’s heads are soft to allow for the incredible brain growth that occurs in the first year of life. But, they’re also susceptible to being “molded” into a flat shape. Fortunately, positional plagiocephaly is usually easy to treat, and appropriate intervention is possible by using plagiocephaly treatment helmets before one year of age.
                    </p>
                    <p>
                        Premature babies are more vulnerable to positional head deformities due to their skulls being softer than those of full-term babies. The medical conditions often result in spending increased periods on their backs without being moved or picked up.
                    </p>
                    <p>
                        Positional head deformities shouldn’t be confused with craniosynostosis, a more severe condition that occurs when skull bones fuse too soon, causing an abnormal skull shape and possible brain damage if the condition is not corrected. Craniosynostosis is usually corrected with surgery.
                    </p>
                </div>

            </div>

            <div className="diagnosis-part">
                <div className="diagnosis-part-heading">
                    <h3>2. Timely Diagnosis and Treatment</h3>
                </div>
                <div className="diagnosis-images">
                    <div className="diagnosis-image-1"><img src={treatmentp21} alt="Treatment Image 1" /></div>
                    <div className="diagnosis-image-2"><img src={treatmentp22} alt="Treatment Image 2" /></div>
                </div>

                <div className="diagnosis-part-content">
                    <p>
                        In the rapidly evolving technological landscape, the strategic integration of AI becomes imperative, fundamentally altering the dynamics of business-customer interactions. From there, the focus shifts to AI-powered personalization, highlighting its profound impact on enriching customer experiences and forging deeper connections. Subsequently, the discussion delves into the realm of AI-driven automation, which not only revolutionizes the efficiency but also enhances the quality of customer engagement processes.
                    </p>
                    <p>
                        AI emerges as a critical catalyst for revolutionizing traditional customer interaction paradigms. Lastly, attention is drawn to the ethical considerations and privacy concerns inherent in AI-driven customer engagement, underscoring the importance of responsible AI implementation. In essence, this chapter underscores AI's multifaceted influence on customer engagement strategies.
                    </p>
                </div>
            </div>

            <div className="cranial-part">
                <div className="cranial-part-heading">
                    <h3>3. Cranial Remodelling Orthosis</h3>
                </div>

                <div className="cranial-part-content">
                    <div className="cranial-part-content-text">
                        <p>
                            A baby’s skull symmetry is improved by a plagiocephaly orthosis, also known as a cranial remodelling band or cranial helmet. If repositioning alone has not been effective, at MOBILIS we use a custom made, 3D Printed remodelling helmet. It offers improved comfort, and fantastic aesthetics to gently guide growth and restore the normal shape of the head. It is also gentle on the skin whilst successfully correcting the deformity.
                        </p>

                        <p>
                            The orthosis is designed to be used in infants during the period of rapid skull growth. The treatment has a high success rate and only takes between 4 to 6 months. The most appropriate time to get started is around the age of 4 months. Research shows that orthotic treatment using an orthosis is the most effective solution for severe head shape deformity(plagiocephaly). We use a proven system which successfully treated over 8,000 infants in 6 countries with amazing results compared to traditional cranial remodelling orthoses. Compared to the new approach, the traditional helmet is heavier, thermally uncomfortable and bulky.
                        </p>
                    </div>

                    <div className="cranial-part-content-image">
                        <img src={treatmentp3} alt="Cranial Remodelling Orthosis" />
                    </div>
                </div>

            </div>

            <div className="steps-part">
                <div className="steps-part-heading">
                    <h3>4. 4 Easy Steps to Correct Head Shape</h3>
                </div>

                <div className="steps-part-content">
                    <div className="steps-part-content-text">
                        <p>
                            Highly precise 3D measurements are taken during your second visit to MOBILIS clinic, which is quick and safe for infants. You are given a choice of colours to choose from. Your clinician then designs the orthosis digitally. The orthosis is 3D printed since no other technology can deliver equal accuracy, lightweight and aesthetics. All follow-up appointments need to adhere for necessary adjustments.
                        </p>
                    </div>

                    <div className="steps-part-content-image">
                        <img src={treatmentp4} alt="4 Easy Steps to Correct Head Shape" />
                    </div>
                </div>

            </div>



            <div className="followup-section">
                <div className="followup-content">
                    <h2>5. FOLLOW UP PROGRAM</h2>

                    <p>
                        Our clinicians will provide explicit instruction for follow up visits.
                        After the final fitting, the child should be seen by our clinician after 1 week
                        to review the comfort levels and after the second week for troubleshooting
                        if any adjustments are required. Furthermore, follow up visits are recommended
                        at regular intervals until the head shape reaches a satisfactory correction.
                    </p>
                </div>

                <div className="compare-wrapper">

                    <div
                        className="compare-container"
                        ref={containerRef}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onTouchMove={handleTouchMove}
                    >

                        {/* After image */}
                        <img src={treatmentafter} className="after-img" />

                        {/* Before image clipped */}
                        <div
                            className="before-mask"
                            style={{ width: `${position}%` }}
                        >
                            <img src={treatmentbefore} />
                        </div>

                        {/* Drag handle */}
                        <div
                            className="slider-handle"
                            style={{ left: `${position}%` }}
                            onMouseDown={handleMouseDown}
                            onTouchStart={() => setDragging(true)}
                            onTouchEnd={() => setDragging(false)}
                        >
                            <span>‹›</span>
                        </div>

                    </div>

                    <button className="slide-btn" onClick={slideAll}>
                        Slide →
                    </button>

                </div>
            </div>

            <div className="assessment-part">
                <div className="assessment-part-heading">
                    <h3>6. Assessment and Follow-up</h3>
                </div>

                <div className="assessment-part-content">
                    <p className="assessment-part-intro">
                        In the rapidly evolving technological landscape, the strategic integration of AI becomes imperative,
                        fundamentally altering the dynamics of business-customer interactions. From there, the focus shifts to
                        AI-powered personalization, highlighting its profound impact on enriching customer experiences and forging
                        deeper connections. Subsequently, the discussion delves into the realm of AI-driven automation, which not only
                        revolutionizes the efficiency but also enhances the quality of customer engagement processes.
                    </p>

                    <div className="assessment-part-stats">
                        <div className="assessment-part-stat-item">
                            <h2>82.3%</h2>
                            <p>
                                Real time interaction across <br />
                                90+ nations
                            </p>
                        </div>

                        <div className="assessment-part-divider"></div>

                        <div className="assessment-part-stat-item">
                            <h2>97.9%</h2>
                            <p>
                                Innovation impact increase in creative <br />
                                impact
                            </p>
                        </div>

                        <div className="assessment-part-divider"></div>

                        <div className="assessment-part-stat-item">
                            <h2>12M+</h2>
                            <p>
                                Satisfied and happy users served <br />
                                worldwide
                            </p>
                        </div>
                    </div>

                    <p className="assessment-part-outro">
                        Lastly, attention is drawn to the ethical considerations and privacy concerns inherent in AI-driven customer
                        engagement, underscoring the importance of responsible AI implementation. In essence, this chapter
                        underscores AI's multifaceted influence on customer engagement strategies.
                    </p>
                </div>
            </div>

        </section>
    );
}

export default InnerPage2TreatmentSection;
