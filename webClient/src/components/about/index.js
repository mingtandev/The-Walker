import React from "react";
import "./index.scss";

function Member(props) {
  const { avatar, name, role } = props;
  return (
    <div className="member">
      <img className="member__avatar" src={avatar} alt="member" />
      <div className="member__info">
        <span className="member__text--bold">Name: </span>
        <span className="member__text--upper">{name}</span>
      </div>
      <div className="member__info">
        <span className="member__text--bold">Age:</span> 20
      </div>
      <div className="member__info">
        <span className="member__text--bold">Role:</span> {role}
      </div>
    </div>
  );
}

export default Member;
