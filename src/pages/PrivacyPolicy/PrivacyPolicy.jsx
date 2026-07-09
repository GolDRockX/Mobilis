import React from "react";
import "./LegalPages.css";

const PrivacyPolicy = () => {
  return (
    <div className="legalPage">
      <div className="legalContainer">
        <h1>Privacy Policy</h1>
        <p className="lastUpdated">Last Updated: {new Date().getFullYear()}</p>

        <section>
          <h2>1. Introduction</h2>
          <p>
            This Privacy Policy describes how we collect, use, and protect your
            personal information when you visit our website and use our
            orthotic and prosthetic services.
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <p>We may collect the following types of information:</p>
          <ul>
            <li>Personal identification information (name, email, phone number)</li>
            <li>Medical or health-related information submitted voluntarily</li>
            <li>Appointment and consultation details</li>
            <li>Website usage data (IP address, browser type, pages visited)</li>
          </ul>
        </section>

        <section>
          <h2>3. How We Use Your Information</h2>
          <ul>
            <li>To provide orthotic and prosthetic services</li>
            <li>To respond to inquiries and appointment requests</li>
            <li>To improve our website and services</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2>4. Medical Confidentiality</h2>
          <p>
            Any medical information you provide is treated as confidential and
            handled in accordance with applicable healthcare privacy laws and
            professional ethical standards.
          </p>
        </section>

        <section>
          <h2>5. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to
            protect your personal information against unauthorized access,
            alteration, disclosure, or destruction.
          </p>
        </section>

        <section>
          <h2>6. Third-Party Services</h2>
          <p>
            We may use trusted third-party service providers (such as hosting
            providers or analytics services) to operate our website. These
            providers are obligated to protect your data.
          </p>
        </section>

        <section>
          <h2>7. Cookies</h2>
          <p>
            Our website may use cookies to enhance user experience and analyze
            traffic. You may disable cookies through your browser settings.
          </p>
        </section>

        <section>
          <h2>8. Your Rights</h2>
          <p>
            You have the right to request access to, correction of, or deletion
            of your personal data. To exercise these rights, please contact us.
          </p>
        </section>

        <section>
          <h2>9. Changes to This Policy</h2>
          <p>
            We reserve the right to update this Privacy Policy at any time.
            Updates will be posted on this page.
          </p>
        </section>

        <section>
          <h2>10. Contact Us</h2>
          <p>
            If you have any questions regarding this Privacy Policy, please
            contact us through our official communication channels.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;