import React from "react";
import HomeSlideBanner from "../../components/carousel";
import About from "../../container/about";
import Achievements from "../../container/achievements";
import "./index.scss";

export default function HomePage() {
  return (
    <div className="home">
      <div className="home__banner">
        <HomeSlideBanner />
      </div>
      <div className="home__achievement">
        <Achievements />
      </div>
      <hr className="home__split"></hr>
      <div className="home__about">
        <About />
      </div>
    </div>
  );
}
