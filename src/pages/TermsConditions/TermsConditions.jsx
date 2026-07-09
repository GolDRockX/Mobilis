import React from "react";
import "./LegalPages.css";

const TermsConditions = () => {
  return (
    <div className="legalPage">
      <div className="legalContainer">
        <h1>Terms & Conditions</h1>
        <p className="lastUpdated">Last Updated: {new Date().getFullYear()}</p>

        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using this website, you agree to comply with and
            be bound by these Terms and Conditions.
          </p>
        </section>

        <section>
          <h2>2. Medical Disclaimer</h2>
          <p>
            Information provided on this website is for general informational
            purposes only and does not constitute medical advice. Always consult
            a qualified healthcare professional regarding your condition.
          </p>
        </section>

        <section>
          <h2>3. Appointments and Consultations</h2>
          <p>
            Appointment requests submitted through the website do not guarantee
            confirmation. We reserve the right to reschedule or decline
            consultations.
          </p>
        </section>

        <section>
          <h2>4. Intellectual Property</h2>
          <p>
            All content on this website, including text, images, logos, and
            designs, is the property of our organization and may not be
            reproduced without permission.
          </p>
        </section>

        <section>
          <h2>5. Limitation of Liability</h2>
          <p>
            We shall not be liable for any direct, indirect, incidental, or
            consequential damages resulting from the use of this website.
          </p>
        </section>

        <section>
          <h2>6. Third-Party Links</h2>
          <p>
            Our website may contain links to external websites. We are not
            responsible for the content or privacy practices of those sites.
          </p>
        </section>

        <section>
          <h2>7. Governing Law</h2>
          <p>
            These Terms and Conditions shall be governed by and interpreted in
            accordance with the laws of the applicable jurisdiction.
          </p>
        </section>

        <section>
          <h2>8. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. Continued
            use of the website constitutes acceptance of the revised terms.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsConditions;