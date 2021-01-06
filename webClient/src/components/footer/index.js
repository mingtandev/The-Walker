import React from "react";
import "./index.scss";

export default function Footer() {
  return (
    <div className="footer">
      <div class="footer__left">
        <span>A project in Introduction to Software Engineering</span>
      </div>
      <div class="footer__right">
        <span className="footer__right-title">CONTACT US: </span>
        <div className="footer__right-detail">
          <a
            className="footer__right-main"
            href="https://www.facebook.com/ReferenceToWorld"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i class="fab fa-facebook footer__right-icon"></i>
            <span>R2W Team</span>
          </a>

          <a
            className="footer__right-main"
            href="https://www.facebook.com/ReferenceToWorld"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i class="fas fa-envelope footer__right-icon"></i>
            <span>blogger123@gmail.com</span>
          </a>
        </div>

        {/* <a
          className="footer__icon"
          href="https://www.facebook.com/messages/t/ReferenceToWorld"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i class="fab fa-facebook-messenger"></i>
        </a> */}
      </div>
    </div>
  );
}
