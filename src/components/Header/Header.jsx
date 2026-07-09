import { NavLink } from "react-router-dom";
import "./Header.css";
import { useState, useEffect } from "react";

import menuIcon from "../../assets/icons/menu.svg";
import exitmenu from "../../assets/icons/cross.svg";
import navmenuimg1 from "../../assets/icons/nav-menu-img-1.jpg";
import searchIcon from "../../assets/icons/search.svg";
import logo from "../../assets/logo/mobilis-logo.png";
import dropdownarrow from "../../assets/icons/arrow_drop_down.png";


function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);
  return (
    <header className="header">
      <div className="header-container">

        {/* Left */}
        <div className="header-left">
          <button
            className="icon-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <img
              src={isMenuOpen ? exitmenu : menuIcon}
              alt="Menu Toggle"
            />
          </button>
          <button className="icon-button">
            <img src={searchIcon} alt="Search" />
          </button>


        </div>




        {/* Right */}
        <nav className="header-right">
          <ul className="nav-links">
            <li className="dropdown mega-dropdown">
              <span className="dropdown-toggle">Pathologies   <img
                src={dropdownarrow}
                alt="Dropdown arrow"
                className="dropdown-arrow"
              /></span>

              <div className="mega-menu">
                <ul>
                  <li>Plagiocephaly / Flat Head</li>
                  <li>Infantile Cerebral Palsy (ICP)</li>
                  <li>Habitual Tip Toe Walking</li>
                  <li>Hip Displacia</li>
                  <li>Blounts Disease</li>
                  <li>Idiopathic Scoliosis</li>
                  <li>Neuro-Muscular Scoliosis</li>
                </ul>

                <ul>
                  <li>Kyphosis</li>
                  <li>Pectus Carinatum</li>
                  <li>Pects Excavatum</li>
                  <li>Paralysis</li>
                  <li>Foot Pathologies</li>
                  <li>Amputation</li>
                </ul>
              </div>
            </li>


            <li><NavLink to="/mobilis-4">Mobilis 4.0</NavLink></li>
            <li><NavLink to="/about-us">About Us</NavLink></li>

            {/* Center */}
            <div className="header-center">
              <NavLink to="/" className="logo-link">
                <img
                  src={logo}
                  alt="Mobilis Logo"
                  className="logo-image"
                />
              </NavLink>
            </div>
            <li><NavLink to="/blog">Testimonials</NavLink></li>
            <li><NavLink to="/process">Process</NavLink></li>
            <li><NavLink to="/careers">Careers</NavLink></li>
          </ul>

          <NavLink to="/appointment" className="appointment-btn">
            Book an Appointment
          </NavLink>
        </nav>

      </div>


      <div className={`nav-backdrop ${isMenuOpen ? "open" : "close"}`}>
        <div className="nav-panel">

          <div className="nav-overlay-content">
            <div className="nav-overlay-links">
              <NavLink to="/news-media">News & Media</NavLink>
              <NavLink to="/blog">Blogs</NavLink>
              <NavLink to="/team">Team Mobilis</NavLink>
              <NavLink to="/download">Downloads</NavLink>
              <NavLink to="/our-partner">Strategic Partners</NavLink>
            </div>

            <div className="nav-overlay-image">
              <img src={navmenuimg1} alt="Mobilis navigation visual" />
            </div>
          </div>

          <div className="nav-overlay-footer">
            <div className="nav-footer-divider" />

            <div className="nav-footer-content">
              <div className="nav-footer-col nav-footer-brand">
                <strong>Medical Manufacturing LLC</strong>
                <span>HQ – Manufacturing & Administration</span>
              </div>

              <div className="nav-footer-col">
                <span>Green Community Village, Dubai Investment Park 1</span>
                <span>Showroom Number 13 and 14, Dubai, United Arab Emirates</span>
              </div>

              <div className="nav-footer-col">
                <span>T&nbsp;&nbsp;04 882 1978</span>
                <span>F&nbsp;&nbsp;04 346 6278</span>
              </div>

              <div className="nav-footer-col">
                <span>E&nbsp;&nbsp;info@mobilis.ae</span>
              </div>
            </div>
          </div>


        </div>
      </div>



    </header>
  );
}

export default Header;
