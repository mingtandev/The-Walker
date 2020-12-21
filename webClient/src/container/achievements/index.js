import React, { useEffect } from "react";
import AOS from "aos";
import { achievements } from "../../utils/achievements";
import "./index.scss";

function Achievements() {
  useEffect(() => {
    AOS.init({ duration: 500 });
  }, []);

  return (
    <div id="achievement" className="achievement">
      <h1 className="achievement__title">WHAT WE HAVE DONE...</h1>
      <div className="achievement__main">
        {achievements.map((item, idx) => (
          <div data-aos="zoom-in" className="achievement__item" key={idx}>
            <div className="achievement__item-left">
              <img src={item.img}></img>
            </div>
            <div className="achievement__item-right">
              {" "}
              <h1 className="achievement__item-number">{item.number}</h1>
              <p className="achievement__item-text">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Achievements;
