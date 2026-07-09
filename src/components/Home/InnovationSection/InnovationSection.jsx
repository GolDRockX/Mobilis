import "./InnovationSection.css";
import FeatureCard from "./FeatureCard";
import handImg from "../../../assets/images/homeinovationimage.jpg"; // your image

const features = [
  {
    title: "3D Digital Scanning",
    text: "Accurate, patient-specific measurements for a perfect anatomical fit",
  },
  {
    title: "Custom Device Engineering",
    text: "Tailored designs using robotic and cloud-based workflows for unmatched precision",
  },
  {
    title: "Advanced Fit & Comfort Strategy",
    text: "Ergonomic analysis and adaptive features for superior wearer experience",
  },
  {
    title: "Smart Materials & Fabrication",
    text: "High-tech 3D printing and composite materials built for durability and performance",
  },
];

function InnovationSection() {
  return (
    <section className="innovation">
      <div className="innovation-inner">

        {/* LEFT */}
        <div className="innovation-left">
          <h2 className="innovation-title">
            A <span className="green">NEW</span> DIMENSION OF
            <br />
            <span className="blue">MOBILITY</span> AWAITS
          </h2>

          <div className="innovation-cards">
            {features.map((f, i) => (
              <FeatureCard key={i} {...f} />
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="innovation-right">
          <p className="innovation-text">
            Step into a future where assistive technology transcends limitations.
            Our solutions combine advanced scanning, intelligent design, and precision
            manufacturing to deliver mobility like never before.
          </p>

          <div className="innovation-image">
            <img src={handImg} alt="3D printed orthotic hand" />
          </div>
        </div>

      </div>
    </section>
  );
}

export default InnovationSection;
