import "./DownloadHeroSection.css";
import downloadhero from "../../../assets/images/Downloadheroimage1.jpg";

function DownloadHeroSection() {
    return (
        <section className="downloadHero">
            <div className="downloadHeroContainer">

                {/* LEFT CONTENT */}
                <div className="downloadHeroContent">

                    <span className="downloadBadge">
                        <span className="dot"></span>
                        Downloads
                    </span>

                    <h1>
                        RESOURCES & <br />
                        DOWNLOADS
                    </h1>

                    <p>
                        Explore a curated collection of brochures, product guides,
                        and technical resources from MOBILIS — Modern Bionic Limb
                        Solutions. Whether you’re a healthcare professional, partner,
                        or patient, these resources provide insights into our
                        customized orthotics, prosthetics, and seating solutions.
                        Download the materials you need to better understand our
                        innovations and how they are transforming mobility across
                        the UAE and GCC.
                    </p>
                </div>

                {/* RIGHT IMAGE */}
                <div className="downloadHeroImage">
                    <img src={downloadhero} alt="Resources and Downloads" />
                </div>

            </div>
        </section>
    );
}

export default DownloadHeroSection;
