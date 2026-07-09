import "./Footer.css";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

import footericon1 from "../../assets/icons/Dribbble.png";
import footericon2 from "../../assets/icons/Behance.png";
import footericon3 from "../../assets/icons/Instagram.png";
import footericon4 from "../../assets/icons/Twitter.png";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">

                {/* Column 1 */}
                <div className=" newsletter">
                    <h4>Stay Updated</h4>
                    <p>
                        subscribe to our newsletter and receive the latest news
                        on products, services & more.
                    </p>

                    <div className="newsletter-input">
                        <input type="email" placeholder="Type your email" />
                        <button>➜</button>
                    </div>

                    <small>
                        By subscribing, you accept the Privacy Policy
                    </small>
                </div>

                {/* Column 2 */}
                {/* Column 2 */}
                <div className="footer-col">
                    <h4>About</h4>
                    <ul>
                        <li><a href="#">About Us</a></li>
                        <li><a href="#">Leadership Team</a></li>
                        <li><a href="#">Mobilis 4.0</a></li>
                        <li><a href="#">Contact Us</a></li>
                        <li><a href="#">Careers</a></li>
                    </ul>
                </div>

                {/* Column 3 */}
                <div className="footer-col">
                    <h4>Services</h4>
                    <ul>
                        <li><a href="#">Orthotics</a></li>
                        <li><a href="#">Prosthetics</a></li>
                        <li><a href="#">Orthoprosthetics</a></li>
                        <li><a href="#">Seating & positioning</a></li>
                        <li><a href="#">Book Appointment</a></li>
                    </ul>
                </div>

                {/* Column 4 */}
                <div className="footer-col">
                    <h4>Resources</h4>
                    <ul>
                        <li><a href="#">News & Media</a></li>
                        <li><a href="#">Pricing & Plans</a></li>
                        <li><a href="#">How it Works</a></li>
                        <li><a href="#">Key Features</a></li>
                        <li><a href="#">Testimonials</a></li>
                    </ul>
                </div>

                {/* Column 5 */}
                <div className="footer-col contact">
                    <h4>Quick Contact</h4>
                    <p>
                        Building 9 Golden Mile Galleria<br />
                        Palm – Jumeirah – Dubai – UAE
                    </p>
                    <p className="contact-highlight">
                        info@mobilisuae.com
                    </p>
                    <p>+2 011 6114 5741</p>
                </div>

            </div>

            {/* Bottom bar */}
            <div className="footer-bottom">
                <div className="footer-bottom-left">
                    <div className="copyright">
                        ©2025 Mobilis, All Rights Reserved.
                    </div>

                    <div className="footer-links">
                        <span>Terms & Conditions</span>
                        <span>Privacy Policy</span>
                        <span>Sitemap</span>
                    </div>
                </div>


                <div className="footer-bottom-right">
                    <a href="#" className="social">
                        <img src={footericon1} alt="Dribbble" />
                    </a>
                    <a href="#" className="social">
                        <img src={footericon2} alt="Behance" />
                    </a>
                    <a href="#" className="social">
                        <img src={footericon3} alt="Instagram" />
                    </a>
                    <a href="#" className="social">
                        <img src={footericon4} alt="Twitter" />
                    </a>
                </div>

            </div>
        </footer>
    );
}

export default Footer;
