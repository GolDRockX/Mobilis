import "./MotionSection.css";
import bg from "../../assets/images/homemotionimage.jpg"; // your prosthetic walking image

export default function MotionSection() {
  return (
    <section className="motion">
      {/* Background image */}
      <img src={bg} alt="" className="motion-bg" />

      {/* Gradient overlay */}
      <div className="motion-overlay" />

      {/* Content */}
      <div className="motion-content">
        <div className="motion-left">
          <h2>
            BORN FROM MOVEMENT.
            <br />
            BUILT TO PERFORM.
          </h2>
        </div>

        <div className="motion-right">
          <p>
            We're not just a medical device company — we're a partner in your
            journey. Designed with patients, for patients, our mission is to
            craft solutions that move with you and empower your independence.
          </p>

          <p>
            From first steps to lifelong motion, we're by your side every stride
            of the way.
          </p>
        </div>
      </div>
    </section>
  );
}
