import React, { useRef, useState } from "react";

import { useAuthController } from "./../../contexts/AuthProvider";

import "./Contact.scss";

function Contact() {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const { user } = useAuthController();

  const subjectRef = useRef(null);
  const descriptionRef = useRef(null);

  function handleSubmit() {
    subjectRef.current.value = "";
    descriptionRef.current.value = "";
  }

  return (
    <div className="contact-main-div">
      <div className="contact-container-div">
        <h3>
          Write <span>Your Queries Here...</span>
        </h3>
        <p className="instruction-para">
          <span>{user.name}</span>, Please feel free to ask about any queries
          and remember your words should not be abusive for any of the blogger
          or about the community , to send your query :-
          <br />
          <br />
          1) Write the subject of your Query into the subject field
          <br />
          <br />
          2) Give a brief description about your doubt or suggestion in minimum
          10 words atleast.
          <br />
          <br />
          3) You have to fill up the subject and description field necessarily
          otherwise we will receive an empty email.
          <br />
          <br />
          3) You will get the reply of your email within 48 hours.
        </p>

        <div className="form-div">
          <form>
            <div>
              <label htmlFor="subject">Subject :-</label>
              <br />

              <input
                ref={subjectRef}
                type="text"
                id="subject"
                autoComplete="on"
                placeholder="Write Your Suject Here..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            <div>
              <label id="desclabel" htmlFor="description">
                Description :-
              </label>

              <br />
              <textarea
                ref={descriptionRef}
                id="description"
                type="text"
                cols={30}
                rows={10}
                value={description}
                placeholder="Write Your Query Here....."
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            <a
              href={`mailto:uttambhatt1402@gmail.com?&subject=${subject
                .split(" ")
                .join("%20")}&body=${description.split(" ").join("%20")}`}
              onClick={handleSubmit}
            >
              Send Email
            </a>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
