import React, { useEffect } from "react";
import AOS from "aos";
import { members } from "../../utils/members";
import Member from "../../components/about";
import "./index.scss";

function About() {
  useEffect(() => {
    AOS.init({ duration: 500 });
  }, []);

  return (
    <div id="about-us" className="about">
      <h1 className="about__title">ABOUT US</h1>
      <div className="about__main">
        {members.map((item, idx) => (
          <div data-aos="zoom-in" className="about__item" key={idx}>
            <Member avatar={item.avatar} name={item.name} role={item.role} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default About;
