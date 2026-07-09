import { useState, useEffect, useRef } from "react";
import "./TeamOurTeamSection.css";
import { teamMembers } from "./TeamOurTeamData";

export default function TeamOurTeamSection() {

    const [activeIndex, setActiveIndex] = useState(0);
    const [selected, setSelected] = useState(null);
    const modalRef = useRef(null);

    const total = teamMembers.length;
    const featured = teamMembers[activeIndex];


    /* =============================
       FEATURED NAVIGATION
    ============================== */

    const nextMember = () =>
        setActiveIndex((prev) => (prev + 1) % total);

    const prevMember = () =>
        setActiveIndex((prev) => (prev - 1 + total) % total);

    /* =============================
       MODAL CONTROL
    ============================== */

    const openProfile = (member) => {
        setSelected(member);
    };

    const closeProfile = () => {
        setSelected(null);
    };

    /* =============================
       BODY SCROLL LOCK
    ============================== */

    useEffect(() => {
        if (selected) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    }, [selected]);

    /* =============================
       ESC CLOSE
    ============================== */

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === "Escape") closeProfile();
        };

        if (selected) {
            document.addEventListener("keydown", handleKey);
        }

        return () => {
            document.removeEventListener("keydown", handleKey);
        };
    }, [selected]);

    /* =============================
       CLICK OUTSIDE CLOSE
    ============================== */

    const handleOutsideClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            closeProfile();
        }
    };

    /* =============================
       FOCUS TRAP
    ============================== */

    useEffect(() => {
        if (!selected) return;

        const focusable = modalRef.current.querySelectorAll(
            "button, [href], input, textarea, select, [tabindex]:not([tabindex='-1'])"
        );

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        const trap = (e) => {
            if (e.key !== "Tab") return;

            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        document.addEventListener("keydown", trap);
        first?.focus();

        return () => document.removeEventListener("keydown", trap);
    }, [selected]);

    return (
        <section className="teamSection">
            <div className="teamContainer">

                {/* FEATURED */}
                <div className="teamFeatured">

                    <div className="featuredCard">

                        <div className="featuredImage">
                            <img src={featured.image} alt={featured.name} />

                            <button
                                onClick={() => openProfile(featured)}
                                className="viewBtn"
                            >
                                View Details
                                <span>↗</span>
                            </button>
                        </div>

                        <div className="featuredInfo">

                            <div className="featuredText">
                                <h3>{featured.name}</h3>

                                <div className="metaRow">
                                    <span className="metaLabel">SPECIALITY:</span>
                                    <span className="metaValue">
                                        {featured.bio?.speciality}
                                    </span>
                                </div>

                                <div className="metaRow">
                                    <span className="metaLabel">DEGREES:</span>
                                    <span className="metaValue">
                                        {featured.bio?.degrees}
                                    </span>
                                </div>
                            </div>

                            <a href="#" className="linkedinBtn">
                                <img src={featured.linkedin} alt="LinkedIn" />
                            </a>

                        </div>

                    </div>

                    <div className="featuredContent">
                        <h2>
                            ORTHOTIC AND PROSTHETIC
                            <span> SPECIALIST</span>
                        </h2>

                        <div className="navControls">
                            <button className="circleBtn" onClick={prevMember}>←</button>
                            <button className="circleBtn active" onClick={nextMember}>→</button>
                            <span className="counter">
                                - {activeIndex + 1}/{total}
                            </span>
                        </div>
                    </div>

                </div>

                {/* GRID */}
                <h3 className="teamTitle">TEAM MOBILIS</h3>

                <div className="teamGrid">
                    {teamMembers.map((member) => (
                        <div
                            key={member.id}
                            className="teamCard"
                            onClick={() => openProfile(member)}
                        >

                            <div className="cardImage">
                                <img src={member.image} alt={member.name} />
                            </div>

                            <div className="cardInfo">
                                <div className="cardText">
                                    <h4>{member.name}</h4>
                                    <p>{member.position}</p>
                                </div>

                                <a
                                    href="#"
                                    className="cardLinkedin"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <img src={member.linkedin} alt="LinkedIn" />
                                </a>
                            </div>

                        </div>
                    ))}
                </div>
            </div>

            {/* MODAL */}
            {selected && (
                <div
                    className="teamModal"
                    onMouseDown={handleOutsideClick}
                >
                    <div
                        className="modalContent"
                        ref={modalRef}
                        onMouseDown={(e) => e.stopPropagation()}
                    >

                        {/* LEFT SIDE */}
                        <div className="modalLeft">

                            <img src={selected.image} alt={selected.name} />

                            <div className="modalGradient" />

                            <div className="modalIdentity">
                                <div className="modalIdentityText">
                                    <h3>{selected.name}</h3>

                                    <div className="modalMeta">
                                        <span>SPECIALITY:</span>
                                        <p>{selected.bio?.speciality}</p>
                                    </div>

                                    <div className="modalMeta">
                                        <span>DEGREES:</span>
                                        <p>{selected.bio?.degrees}</p>
                                    </div>
                                </div>

                                <a href="#" className="modalLinkedin">
                                    <img src={selected.linkedin} alt="LinkedIn" />
                                </a>
                            </div>

                        </div>

                        {/* RIGHT SIDE */}
                        <div className="modalRight">

                            <div className="modalHeader">
                                <button onClick={closeProfile} className="closeBtn">
                                    CLOSE
                                    <span>✕</span>
                                </button>
                            </div>

                            <div className="modalDetails">

                                <div className="detailBlock">
                                    <h5>SPECIALITY:</h5>
                                    <p>{selected.bio?.speciality}</p>
                                </div>

                                <div className="detailBlock">
                                    <h5>DEGREES:</h5>
                                    <p>{selected.bio?.degrees}</p>
                                </div>

                                <div className="detailBlock">
                                    <h5>LANGUAGES:</h5>
                                    <p>{selected.bio?.languages}</p>
                                </div>

                                <div className="detailBlock">
                                    <h5>BIOGRAPHY:</h5>
                                    <p>{selected.bio?.biography}</p>
                                </div>

                            </div>

                        </div>

                    </div>
                </div>
            )}
        </section>
    );
}