import React from "react";
import "./index.scss";

function ItemHover(props) {
  const { type, sale, saleExpiresTime, details, description } = props.data;

  return (
    <div className="item__hover">
      {type && <p>Type: {type}</p>}
      {sale && <p>Sale: {sale}%</p>}
      {saleExpiresTime && (
        <p>Sale Expires Time: {new Date(saleExpiresTime).toGMTString()}</p>
      )}
      {description && <p>Description: {description}</p>}
      {props && props.data.details && (
        <div className="item__hover__detail">
          <p>Detail:</p>
          <ul>
            {Object.keys(details).map((detail, idx) => (
              <li key={idx}>
                {detail}: {details[detail]}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ItemHover;
