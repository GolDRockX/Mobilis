import "./InnerPage1ChassisSection.css";
import chassisimg1 from "../../../assets/images/innerpage1chassissectionimage1.jpg";
import chassisimg2 from "../../../assets/images/innerpage1chassissectionimage2.jpg";

function InnerPage1ChassisSection() {
    return (
        <section className="inner-page-chassis-section">
            <div className="chassis-heading">
                <h3>Choose the Right Chassis</h3>
            </div>
            <div className="chassis-content">
                <p>Deciding the right chassis should always be made consulting a doctor and/or therapist who know the child quite well with your seating specialist. The user’s mobility requirement plays a significant role in determining the proper frame. MOBILIS work with international manufacturers to choose from comprehensive options.</p>
            </div>

            <div className="chassis-images">
                <div className="chassis-image-1"><img src={chassisimg1} alt="Chassis Image 1" /></div>
                <div className="chassis-image-2"><img src={chassisimg2} alt="Chassis Image 2" /></div>
            </div>
        </section>
    );
}

export default InnerPage1ChassisSection;