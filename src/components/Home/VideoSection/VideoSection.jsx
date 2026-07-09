import { useState } from "react";
import "./videosection.css";
import hero from "../../../assets/images/homevideosectionimage.jpg";


function VideoSection() {
    return (
        <section className="video-section">
            <div>
                <img src={hero} alt="" className="video-hero" />
            </div>
        </section>
    );

}

export default VideoSection;