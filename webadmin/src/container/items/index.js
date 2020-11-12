import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import itemApi from "../../api/itemApi";
import * as itemsAction from "../../actions/itemsAction";

import MaterialTable from "material-table";

function ItemList() {
  const columns = [
    { field: "id", title: "No." },
    { field: "_id", title: "ID" },
    { field: "thumbnail ", title: "Thumbnail" },
    { field: "type", title: "Type" },
    { field: "price", title: "Price" },
    {
      field: "sale",
      title: "Sale",
    },
    {
      field: "saleExpiresTime",
      title: "Sale Expire Time",
    },
  ];

  const items = useSelector((state) => state.items);

  const dispatch = useDispatch();

  const history = useHistory();

  useEffect(() => {
    async function fetchAllUsers() {
      try {
        let res = await itemApi.getAll();
        console.log(res);
        let itemArray = res.products;
        itemArray.map((item, i) => (item.id = i));
        dispatch(itemsAction.loadItems(itemArray));
        console.log(itemArray);
      } catch (error) {
        console.log(error);
      }
    }
    fetchAllUsers();
  }, []);

  const handleDelete = (data) => {
    try {
      let deleteIDs = [];

      async function deleteItems() {
        await Promise.all(
          data.map(async (item) => {
            let res = await itemApi.delete(item._id);
            if (res && res.msg === "success") {
              console.log(res);
              deleteIDs.push(item._id);
            }
          })
        );
        //  dispatch(itemsAction(deleteIDs));
      }
      deleteItems();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div style={{ maxWidth: "100%" }}>
        <MaterialTable
          columns={columns}
          data={items.items}
          title="Demo Title"
          options={{
            selection: true,
          }}
          actions={[
            {
              tooltip: "Remove All Selected Users",
              icon: "delete",
              onClick: (evt, data) => {
                handleDelete(data);
              },
            },
            {
              tooltip: "Edit",
              icon: "edit",
              onClick: (evt, data) => {
                history.push("/dashboard");
              },
            },
          ]}
        />
      </div>
    </>
  );
}

export default ItemList;
