import "./AppointmentHeroSection.css";
import appointmenthero from "../../../assets/images/appointmentheroimage.jpg";

function AppointmentHeroSection() {
    return (
        <section className="appointment-hero">
            <img
                src={appointmenthero}
                alt="Appointment Hero"
                className="appointment-hero-bg"
            />

            <div className="appointment-hero-overlay"></div>

            <div className="appointment-hero-content">
                <h1>CONTACT US</h1>
                <p>Contact us today to make an appointment with us.</p>
            </div>
        </section>
    );
}

export default AppointmentHeroSection;
