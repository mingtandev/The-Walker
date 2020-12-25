import React from "react";
import "./index.scss";

export default function Footer() {
  return (
    <div className="footer">
      <div class="footer__left">
        <span>A project in Introduction to Software Engineering</span>
      </div>
      <div class="footer__right">
        <span className="footer__contact">CONTACT US: </span>
        <a
          className="footer__icon"
          href="https://www.facebook.com/ReferenceToWorld"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i class="fab fa-facebook"></i>
        </a>
        <a
          className="footer__icon"
          href="https://www.facebook.com/messages/t/ReferenceToWorld"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i class="fab fa-facebook-messenger"></i>
        </a>
      </div>
    </div>
  );
}
