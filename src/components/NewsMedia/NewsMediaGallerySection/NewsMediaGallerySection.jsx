import { useState } from "react";
import "./NewsMediaGallerySection.css";
import { galleryItems } from "./NewsMediaGalleryData";

export default function NewsMediaGallerySection() {

    const [index, setIndex] = useState(0);

    const next = () => setIndex((prev) => (prev + 1) % galleryItems.length);
    const prev = () =>
        setIndex((prev) => (prev === 0 ? galleryItems.length - 1 : prev - 1));

    return (
        <section className="newsGallery">
            <div className="newsGalleryContainer">

                {/* HEADER */}
                <div className="galleryHeader">
                    <div className="galleryTitle">
                        <span className="light">PROJECT</span>
                        <span className="green">GALLERY</span>
                    </div>

                    <p className="galleryDesc">
                        At MOBILIS – Modern Bionic Limb Solutions, every innovation reflects our
                        commitment to advancing mobility and independence. From customized orthotics
                        and prosthetics to specialized seating solutions, our work combines craftsmanship
                        with cutting-edge technology to deliver life-changing results across the UAE and GCC healthcare markets.
                    </p>
                </div>

                {/* CONTROLS */}
                <div className="galleryControls">
                    <button onClick={prev} className="navBtn">PREV</button>
                    <button onClick={next} className="navBtn">NEXT</button>
                </div>

                {/* TRACK */}
                <div className="galleryViewport">
                    <div
                        className="galleryTrack"
                        style={{
                            transform: `translateX(-${index * 25}%)`
                        }}
                    >
                        {galleryItems.map((item, i) => (
                            <div
                                className={`galleryCard ${i % 2 === 0 ? "tall" : "short"}`}
                                key={i}
                            >
                                <div className="imgWrap">
                                    <img src={item.image} alt="" />
                                </div>
                                <span>{item.label}</span>
                            </div>

                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
