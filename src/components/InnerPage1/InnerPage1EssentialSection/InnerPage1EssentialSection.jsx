import "./InnerPage1EssentialSection.css";
import essentialimg from "../../../assets/images/innerpage1essentialimage.jpg";

function InnerPage1EssentialSection() {
    return (
        <section className="inner-page-essential-section">
            <div className="essential-heading">
                <h2>Why proper seating is essential.</h2>
            </div>
            <div className="essential-image">
                <img src={essentialimg} alt="Essential for Your Business" />
            </div>
            <div className="essential-content">
                <p>Custom moulded Symmetric seating is essential for such differently-abled users because even minor asymmetry or a non-emergent diagnosis at one time may progress into a significant postural issue, and could eventually present with vital organ structure compromise.

                </p>
                <p>Having designed an individual positioning solution will promote several health benefits to improve his/her condition and prevent the worsening of user’s existing deformities.</p>

            </div>
        </section>

    );
}

export default InnerPage1EssentialSection;