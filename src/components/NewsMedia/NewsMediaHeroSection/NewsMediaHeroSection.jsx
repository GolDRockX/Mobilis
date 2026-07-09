import "./NewsMediaHeroSection.css";
import newsheroimg1 from "../../../assets/images/newsheroimage1.png";
import newsheroimg2 from "../../../assets/images/newsheroimage2.jpg";
import newsheroimg3 from "../../../assets/images/newsheroimage3.png";

function NewsMediaHeroSection() {
    return (
        <section className="newsMediaHero">
            <div className="newsMediaContainer">

                {/* TOP TAGS */}
                <div className="newsMediaTags">
                    <span className="active">NEWS</span>
                    <span className="divider"></span>
                    <span className="active">MEDIA</span>
                </div>

                {/* HEADER */}
                <div className="newsMediaHeader">
                    <h1>
                        A JOURNEY <br />
                        THROUGH INNOVATIONS
                    </h1>

                    <p>
                        Showcasing solutions that
                        redefine mobility and care.
                    </p>
                </div>

                {/* IMAGES */}
                <div className="newsMediaImages">
                    <div className="imageCard left">
                        <img src={newsheroimg1} alt="Innovation 1" />
                    </div>

                    <div className="imageCard center">
                        <img src={newsheroimg2} alt="Innovation 2" />
                    </div>

                    <div className="imageCard right">
                        <img src={newsheroimg3} alt="Innovation 3" />
                    </div>
                </div>

            </div>
        </section>
    );
}

export default NewsMediaHeroSection;
