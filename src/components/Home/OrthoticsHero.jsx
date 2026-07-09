import "./OrthoticsHero.css";
import orthoticsWord from "../../assets/images/orthoticshometext.png";
import productImg from "../../assets/images/orthoticshomeimage.png";
import vectorLine from "../../assets/images/orthoticshomevector.png";

export default function OrthoticsHero() {
  return (
    <section className="orthotics-hero">

      {/* BACKGROUND WORD */}
      <img
        src={orthoticsWord}
        alt=""
        className="orthotics-bg-word"
      />

      {/* CENTER PRODUCT */}
      <div className="orthotics-center">
        <img src={productImg} alt="Orthotic device" className="orthotics-product" />
        <img src={vectorLine} alt="" className="orthotics-vector" />
      </div>

      {/* LEFT CONTENT */}
      <div className="orthotics-left">
        <div className="orthotics-tags">
          <span>INNOVATION</span>
          <span>PRECISION</span>
          <span>MOTION</span>
        </div>

        <div className="orthotics-stats">
          <div>
            <h3>99.8%</h3>
            <p>Device Fit Accuracy</p>
          </div>

          <div className="stats-row">
            <div>
              <h3>30+ Years</h3>
              <p>Industry Experience</p>
            </div>

            <div>
              <h3>100%</h3>
              <p>Custom to the Patient</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT CONTENT */}
      <div className="orthotics-right">
        <p>
          Our orthotic solutions combine 3D scanning, cloud computing,
          robotic fabrication, and precision 3D printing to deliver
          custom-made devices for optimal fit, function, and comfort.
          Experience the next generation of assistive technology.
        </p>

        <a href="#" className="see-products">See all products</a>

        <div className="orthotics-slogan">
          <strong>Seamless Support.</strong>
          <strong>Pure Innovation.</strong>
        </div>
      </div>

    </section>
  );
}
