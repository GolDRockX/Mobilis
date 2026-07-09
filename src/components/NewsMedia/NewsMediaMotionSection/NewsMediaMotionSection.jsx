import "./NewsMediaMotionSection.css";
import { motionSlides } from "./NewsMediaMotionData";
import { useState } from "react";

export default function NewsMediaMotionSection() {
    const [index, setIndex] = useState(0);

    const next = () => setIndex((index + 1) % motionSlides.length);
    const prev = () => setIndex((index - 1 + motionSlides.length) % motionSlides.length);

    const slide = motionSlides[index];

    return (
        <section className="motionSection">
            <div className="motionContainer">

                {/* HEADER */}
                <div className="motionHeader">
                    <div className="motionNav prev" onClick={prev}>PREV</div>

                    <div className="motionTitle">
                        <h2>INNOVATION IN</h2>
                        <h3>MOTION</h3>
                    </div>

                    <div className="motionNav next" onClick={next}>NEXT</div>
                </div>

                {/* VIDEO */}
                <div className="motionVideo">
                    <img src={slide.image} alt="" />

                    <div className="overlay" />

                    <div className="playBtn">
                        <img src={slide.playIcon} alt="" />
                    </div>
                </div>

            </div>
        </section>
    );
}
