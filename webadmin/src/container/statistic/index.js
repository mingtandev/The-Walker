import React, { useEffect, useState } from "react";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import AccessibilityNewIcon from "@material-ui/icons/AccessibilityNew";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import PostAddIcon from "@material-ui/icons/PostAdd";
import CardGiftcardIcon from "@material-ui/icons/CardGiftcard";
import statisticAPI from "../../api/statisticApi";
import Loading from "../../components/loading";
import "./index.scss";

function Statistics() {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchStatistic() {
    try {
      const params = {
        start_day: "",
        end_day: "",
      };
      let res = await statisticAPI.get(params);
      console.log(res);
      if (res && res.msg === "success") setStatistics(res.statistics);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchStatistic();
  }, []);

  return (
    <>
      {!loading ? (
        statistics ? (
          <div className="statistic__general">
            <div className="statistic">
              <div className="statistic__icon statistic__icon--red">
                <GroupAddIcon />
              </div>
              <h1>{statistics.newUsers}</h1>
              <p>New Users</p>
            </div>
            <div className="statistic">
              <div className="statistic__icon statistic__icon--green">
                <MonetizationOnIcon />
              </div>
              <h1>{statistics.cash}</h1>
              <p>Cash</p>
            </div>
            <div className="statistic">
              <div className="statistic__icon statistic__icon--blue">
                <ShoppingCartIcon />
              </div>
              <h1>{statistics.soldItems}</h1>
              <p>Sold Items</p>
            </div>
            <div className="statistic">
              <div className="statistic__icon statistic__icon--orange">
                <PostAddIcon />
              </div>
              <h1>{statistics.blogs}</h1>
              <p>Blogs</p>
            </div>
            <div className="statistic">
              <div className="statistic__icon statistic__icon--purple">
                <AccessibilityNewIcon />
              </div>
              <h1>{statistics.activeUsers}</h1>
              <p>Active Users</p>
            </div>
            <div className="statistic">
              <div className="statistic__icon statistic__icon--darkgreen">
                <CardGiftcardIcon />
              </div>
              <h1>{statistics.usedCodes}</h1>
              <p>Used Giftcode</p>
            </div>
          </div>
        ) : (
          <div>NO STATISTICS</div>
        )
      ) : (
        <Loading />
      )}
    </>
  );
}

export default Statistics;
