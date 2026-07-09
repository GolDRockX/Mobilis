import "./AppointmentContactSection.css";
import {
    contactTimes,
    topics,
    services,
    clinicians
} from "./AppointmentContactData";

export default function AppointmentContactSection() {
    return (
        <section className="appointmentContact">
            <div className="appointmentContainer">

                <form className="appointmentForm">

                    {/* ROW 1 */}
                    <div className="formField">
                        <div className="outlinedField">
                            <fieldset>
                                <legend>First Name*</legend>
                                <input type="text" placeholder="Enter" required />
                            </fieldset>
                        </div>
                    </div>

                    <div className="formField">
                        <div className="outlinedField">
                            <fieldset>
                                <legend>Last Name*</legend>
                                <input type="text" placeholder="Enter" required />
                            </fieldset>
                        </div>
                    </div>

                    {/* ROW 2 */}
                    <div className="formField">
                        <div className="outlinedField">
                            <fieldset>
                                <legend>Contact Number*</legend>
                                <input type="text" placeholder="Enter" required />
                            </fieldset>
                        </div>
                    </div>

                    <div className="formField">
                        <div className="outlinedField">
                            <fieldset>
                                <legend>Email Address*</legend>
                                <input type="email" placeholder="Enter" required />
                            </fieldset>
                        </div>
                    </div>

                    {/* MEMBER */}
                    <div className="formField memberField">
                        <label className="staticLabel">Are you a Member*</label>
                        <div className="radioGroup">
                            <label className="radio">
                                <input type="radio" name="member" />
                                <span>Yes</span>
                            </label>
                            <label className="radio">
                                <input type="radio" name="member" />
                                <span>No</span>
                            </label>
                        </div>
                    </div>

                    <div className="formField">
                        <div className="outlinedField">
                            <fieldset>
                                <legend>MRN Number*</legend>
                                <input type="text" placeholder="Enter" required />
                            </fieldset>
                        </div>
                    </div>

                    {/* SELECTS */}
                    <div className="formField">
                        <div className="outlinedField selectField">
                            <fieldset>
                                <legend>Preferred Contact Time*</legend>
                                <select defaultValue="">
                                    <option value="" disabled>Select</option>
                                    {contactTimes.map((item, i) => (
                                        <option key={i}>{item}</option>
                                    ))}
                                </select>
                            </fieldset>
                        </div>
                    </div>

                    <div className="formField">
                        <div className="outlinedField selectField">
                            <fieldset>
                                <legend>Choose a Topic*</legend>
                                <select defaultValue="">
                                    <option value="" disabled>Select</option>
                                    {topics.map((item, i) => (
                                        <option key={i}>{item}</option>
                                    ))}
                                </select>
                            </fieldset>
                        </div>
                    </div>

                    <div className="formField">
                        <div className="outlinedField selectField">
                            <fieldset>
                                <legend>Choose a Service and Product*</legend>
                                <select defaultValue="">
                                    <option value="" disabled>Select</option>
                                    {services.map((item, i) => (
                                        <option key={i}>{item}</option>
                                    ))}
                                </select>
                            </fieldset>
                        </div>
                    </div>

                    <div className="formField">
                        <div className="outlinedField selectField">
                            <fieldset>
                                <legend>Choose a Clinicians*</legend>
                                <select defaultValue="">
                                    <option value="" disabled>Select</option>
                                    {clinicians.map((item, i) => (
                                        <option key={i}>{item}</option>
                                    ))}
                                </select>
                            </fieldset>
                        </div>
                    </div>

                    {/* MESSAGE */}
                    <div className="formField fullWidth">
                        <div className="outlinedField textarea">
                            <fieldset>
                                <legend>Message*</legend>
                                <textarea placeholder="Write" required />
                            </fieldset>
                        </div>
                    </div>

                    {/* SUBMIT */}
                    <div className="submitRow">
                        <button type="submit" className="submitBtn">
                            Submit
                            <span className="arrow">→</span>
                        </button>
                    </div>

                </form>
            </div>
        </section>
    );
}
