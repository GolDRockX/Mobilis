import { useState } from "react";
import { steps } from "./stepsData";
import "./steps.css";
import stepVector from "../../../assets/images/homestepsvector.svg";
import stepVector2 from "../../../assets/images/homestepsvector2.svg";


export default function StepsSection() {
    const [active, setActive] = useState(0);

    return (
        <section className="steps">
            <div className="steps-container">
                <h2 className="steps-title">
                    <span className="green">4 STEPS</span> TO THE FUTURE <br /> OF MOBILITY
                </h2>
                <div className="steps-flex">
                    {/* LEFT */}
                    <div className="steps-left">


                        <div className="steps-list">
                            {steps.map((step, index) => (
                                <div
                                    key={step.id}
                                    className={`step-item ${active === index ? "active" : ""}`}
                                    onMouseEnter={() => setActive(index)}
                                >
                                    <h3>{step.title}</h3>

                                    {active === index && (
                                        <p className="step-desc">{step.description}</p>
                                    )}

                                    <div className="step-line">
                                        <img
                                            src={active === index ? stepVector2 : stepVector}
                                            alt=""
                                            className="step-line-bg"
                                        />
                                        <div className="step-line-fill" />
                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="steps-right">
                        <img
                            src={steps[active].image}
                            className="steps-image"
                            alt=""
                        />

                        <div className="steps-card">
                            Say goodbye to plaster casts and endless adjustments. Our advanced
                            digital technologies make treatment simpler, faster, and more precise.
                            <span>Learn More</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
