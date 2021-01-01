import React, { useEffect, useState } from "react";
import itemApi from "../../api/itemApi";
import rollupApi from "../../api/rollupApi";
import Loading from "../../components/loading";
import "./index.scss";

function RollUpDetail({ match }) {
  const [rollItem, setRollItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getCode() {
      try {
        let day = match.params.day;
        let res = await rollupApi.getOne(day);
        console.log(res);
        setRollItem(res.roll.item);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }

    getCode();
  }, []);

  return (
    <div className="rollups">
      <h1 className="rollups__title">Item In Roll - Day: {match.params.day}</h1>
      {!loading ? (
        <div className="rollups__item">
          <img src={rollItem.thumbnail} alt="Item" />
          <h1>{rollItem.name}</h1>
          <div>
            <span className="rollups__item--bold">ID: </span>
            {rollItem._id}
          </div>
          <div>
            <span className="rollups__item--bold">Type: </span>
            {rollItem.type}
          </div>
          <div>
            <span className="rollups__item--bold">Description: </span>
            {rollItem.description}
          </div>
          <div>
            <span className="rollups__item--bold">Details: </span>
            {Object.keys(rollItem.details).map((key, id) => (
              <li key={id}>
                {key}: {rollItem.details[key]}
              </li>
            ))}
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default RollUpDetail;
