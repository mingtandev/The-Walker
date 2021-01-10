import React, { useEffect, useState } from "react";
import Loading from "../../components/loading";
import userApi from "../../api/userApi";
import { useHistory } from "react-router-dom";
import ScheduleIcon from "@material-ui/icons/Schedule";
import jwt_decode from "jwt-decode";
import "./index.scss";

function UserHistory() {
  const [show, setShow] = useState({ manage: false, personal: true });
  const [showOption, setShowOption] = useState(1);
  const [manageList, setManageList] = useState([]);
  const [personalList, setPersonalList] = useState([]);

  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    async function getUserHistory() {
      try {
        if (!localStorage.getItem("token")) history.push("/");
        const userID = jwt_decode(localStorage.getItem("token"))._id;
        let res = await userApi.getUserInfo(userID);
        console.log(res.user.history);
        if (res && res.user) {
          setManageList(res.user.history.manage.reverse());
          setPersonalList(res.user.history.personal.reverse());
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getUserHistory();
  }, []);

  const handleShowHistoryType = (type) => {
    setShowOption(type);
    switch (type) {
      case 1:
        setShow({ manage: false, personal: true });
        break;
      case 2:
        setShow({ manage: true, personal: false });
        break;
      default:
        setShow({ manage: false, personal: true });
        break;
    }
  };

  return (
    <>
      {!loading ? (
        <div className="history__container">
          <h1 className="history__title">My Activities</h1>
          <div className="history__select">
            <button
              className={
                "history__option " +
                (showOption === 1 ? "history__option--selected" : "")
              }
              onClick={() => handleShowHistoryType(1)}
            >
              Personal
            </button>
            <button
              className={
                "history__option " +
                (showOption === 2 ? "history__option--selected" : "")
              }
              onClick={() => handleShowHistoryType(2)}
            >
              Manage
            </button>
          </div>
          <div className="history__main">
            {showOption === 1 &&
              show.personal &&
              (personalList.length ? (
                <div className="history__list">
                  {personalList.map((item, id) => (
                    <div className="history__list__item" key={id}>
                      <span className="history__list-date">
                        <ScheduleIcon />
                        <span>{`${new Date(item.date).toGMTString()}`}</span>
                      </span>
                      <span className="history__list-content">{item.task}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <h1 className="history__caption">
                  No Personal activity recorded
                </h1>
              ))}
            {/*  */}
            {showOption === 2 &&
              show.manage &&
              (manageList.length ? (
                <div className="history__list">
                  {manageList.map((item, id) => (
                    <div className="history__list__item" key={id}>
                      <div className="history__list-date">
                        <ScheduleIcon />
                        <span>{`${new Date(item.date).toGMTString()}`}</span>
                      </div>
                      <div className="history__list-content">{item.task}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <h1 className="history__caption">
                  No Manage activity recorded
                </h1>
              ))}
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default UserHistory;
