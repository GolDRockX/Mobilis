import "./AppointmentInformationSection.css";
import appointmentinfoimg from "../../../assets/images/appointmentinformationimage.jpg";
import appointmentteleicon from "../../../assets/images/appointmentinformationtelephone.png";
import appointmentmailicon from "../../../assets/images/appointmentinformationmail.png";
import appointmentlocationicon from "../../../assets/images/careerspositionlocation.png";

function AppointmentInformationSection() {
    return (
        <section className="appointmentInfo">
            <div className="appointmentInfoContainer">

                {/* LEFT INFO CARD */}
                <div className="infoCard">
                    <h2>INFORMATION</h2>

                    <div className="infoText">
                        <p className="companyName">Medical Manufacturing LLC</p>
                        <p className="companySub">
                            HQ — Manufacturing & Administration
                        </p>
                    </div>

                    <div className="infoList">
                        <div className="infoItem">
                            <img src={appointmentteleicon} alt="Phone" />
                            <div>
                                <p>T &nbsp; 04 882 1978</p>
                                <p>F &nbsp; 04 346 6278</p>
                            </div>
                        </div>

                        <div className="infoItem">
                            <img src={appointmentmailicon} alt="Email" />
                            <p>info@mobilis.ae</p>
                        </div>

                        <div className="infoItem">
                            <img src={appointmentlocationicon} alt="Location" />
                            <p>
                                Green Community Village, Dubai Investment Park 1
                                Showroom Number 13 and 14, Dubai, United Arab Emirates
                            </p>
                        </div>
                    </div>
                </div>

                {/* RIGHT MAP IMAGE */}
                <div className="mapCard">
                    <img src={appointmentinfoimg} alt="Location Map" />
                </div>

            </div>
        </section>
    );
}

export default AppointmentInformationSection;
