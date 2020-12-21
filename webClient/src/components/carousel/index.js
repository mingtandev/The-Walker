import React from "react";
import Carousel from "react-bootstrap/Carousel";
import "./index.scss";

function HomeSlideBanner() {
  return (
    <>
      <Carousel>
        <Carousel.Item interval={2}>
          <img
            className="carousel__img"
            src={require("../../images/carousel_bg1.png")}
            alt="First slide"
          />
          <Carousel.Caption>
            <h2 className="carousel__toptitle carousel__toptitle--orange">
              Island
            </h2>
            <h3 className="carousel__title">
              The{" "}
              <span className="carousel__title carousel__title--orange">
                Walker
              </span>
            </h3>
            <p className="carousel__caption">
              Survive on fighting with the Bloodthirsty Zombies
            </p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item interval={2}>
          <img
            className="carousel__img"
            src={require("../../images/carousel_bg2.png")}
            alt="Second slide"
          />
          <Carousel.Caption>
            <h3 className="carousel__title">Second slide label</h3>
            <p className="carousel__caption">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item interval={2}>
          <img
            className="carousel__img"
            src={require("../../images/carousel_bg3.png")}
            alt="Third slide"
          />
          <Carousel.Caption>
            <h3 className="carousel__title">Third slide label</h3>
            <p className="carousel__caption">
              Praesent commodo cursus magna, vel scelerisque nisl consectetur.
            </p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item interval={2}>
          <img
            className="carousel__img"
            src={require("../../images/carousel_bg4.png")}
            alt="Third slide"
          />
          <Carousel.Caption>
            <h3 className="carousel__title">Third slide label</h3>
            <p className="carousel__caption">
              Praesent commodo cursus magna, vel scelerisque nisl consectetur.
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
      ;
    </>
  );
}

export default HomeSlideBanner;
