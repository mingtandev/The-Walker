import React, { useEffect, useState } from "react";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import PostAddIcon from "@material-ui/icons/PostAdd";
import statisticAPI from "../../api/statisticApi";
import "./index.scss";

function Statistics() {
  const [statistics, setStatistics] = useState(null);

  async function fetchStatistic() {
    try {
      const params = {
        start_day: "",
        end_day: "",
      };
      let res = await statisticAPI.get(params);
      console.log(res);
      if (res && res.msg === "success") setStatistics(res.statistics);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchStatistic();
  }, []);

  return (
    <>
      <div className="statistics">
        {statistics ? (
          <>
            <div className="statistic">
              <div className="statistic__icon">
                <GroupAddIcon />
              </div>
              <h2>{statistics.newUsers}</h2>
              <p>New Users</p>
            </div>
            {/* <div className="statistics__box">
              <h2>{statistics.activeUsers}</h2>
              <p>Active Users</p>
            </div> */}
            <div className="statistic">
              <div className="statistic__icon">
                <MonetizationOnIcon />
              </div>
              <h2>{statistics.cash}</h2>
              <p>Cash</p>
            </div>
            <div className="statistic">
              <div className="statistic__icon">
                <ShoppingCartIcon />
              </div>
              <h2>{statistics.soldItems}</h2>
              <p>Sold Items</p>
            </div>
            <div className="statistic">
              <div className="statistic__icon">
                <PostAddIcon />
              </div>
              <h2>{statistics.blogs}</h2>
              <p>Blogs</p>
            </div>
          </>
        ) : (
          <div>NO STATISTICs</div>
        )}
      </div>
    </>
  );
}

export default Statistics;
