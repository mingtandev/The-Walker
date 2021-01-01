import React, { useEffect, useState } from "react";
import giftcodeApi from "../../api/giftcodeApi";
import itemApi from "../../api/itemApi";
import Loading from "../../components/loading";
import "./index.scss";

function CodeDetail({ match }) {
  const [codeItems, setCodeItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getCode() {
      try {
        let id = match.params.id;
        let res = await giftcodeApi.getOne(id);
        console.log(res);
        let itemArray = res.code.items.map((itemID) => itemApi.getOne(itemID));
        itemArray = await Promise.all(itemArray);
        console.log(itemArray);
        setCodeItems(itemArray);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }

    getCode();
  }, []);

  return (
    <div className="giftcodes">
      <h1 className="giftcodes__title">Items In Code ID: {match.params.id}</h1>
      <div className="giftcodes__items">
        {!loading ? (
          codeItems.length ? (
            codeItems.map((item, id) => (
              <div className="giftcodes__item" key={id}>
                <img src={item.item.thumbnail} alt="Item" />
                <h1>{item.item.name}</h1>
                <div>
                  <span className="giftcodes__item--bold">ID: </span>
                  {item.item._id}
                </div>
                <div>
                  <span className="giftcodes__item--bold">Type: </span>
                  {item.item.type}
                </div>
                <div>
                  <span className="giftcodes__item--bold">Description: </span>
                  {item.item.description}
                </div>
                <div>
                  <span className="giftcodes__item--bold">Details: </span>
                  {Object.keys(item.item.details).map((key, id) => (
                    <li key={id}>
                      {key}: {item.item.details[key]}
                    </li>
                  ))}
                </div>
                <div>
                  <span className="giftcodes__item--bold">Sale: </span>
                  {item.item.sale}%
                </div>
                <div>
                  <span className="giftcodes__item--bold">Sale Expire: </span>
                  {new Date(item.item.saleExpiresTime).toGMTString()}
                </div>
              </div>
            ))
          ) : (
            <div>NO ITEMS</div>
          )
        ) : (
          <div className="giftcodes__items__loading">
            <Loading />
          </div>
        )}
      </div>
    </div>
  );
}

export default CodeDetail;
