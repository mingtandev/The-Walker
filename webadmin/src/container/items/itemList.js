import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import itemApi from "../../api/itemApi";
import MaterialTable from "material-table";
import ItemUpdateDialog from "../../components/dialog/itemUpdate";
import * as itemsAction from "../../actions/itemsAction";
import * as itemColumns from "../../utils/dataColumns";
import "./index.scss";

function ItemList() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rowData, setRowData] = useState(null);

  const items = useSelector((state) => state.items);

  const dispatch = useDispatch();

  async function getAllItems() {
    try {
      let res = await itemApi.getAll();
      console.log(res);
      let itemArray = res.products;
      dispatch(itemsAction.loadItems(itemArray));
      console.log(itemArray);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getAllItems();
  }, []);

  const handleDialogOpen = (rowData) => {
    setRowData(rowData);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleUpdateBlog = async (object, codeId) => {
    let body = [];
    for (const property in object) {
      if (object[property])
        body.push({ propName: property, value: object[property] });
    }
    try {
      console.log("neeeeeeeee");
      let res = await itemApi.update(codeId, body);
      console.log(res);
      if (res && res.msg === "success") {
        setDialogOpen(false);
        getAllItems();
      } else console.log("cannot update");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (data) => {
    try {
      let res = await itemApi.delete(data._id);
      console.log(res);
      if (res && res.msg === "success")
        dispatch(itemsAction.deleteItem(data._id));
      else alert("Cannot delete item");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="items__option">
        <Link to="/items/create">
          <Button variant="contained" color="primary">
            <AddIcon fontSize="large" />
            Create
          </Button>
        </Link>
      </div>
      <div style={{ maxWidth: "100%" }}>
        <MaterialTable
          columns={itemColumns.ITEM_COLUMNS}
          data={items.items}
          title="ITEMS"
          options={{
            actionsColumnIndex: -1,
          }}
          actions={[
            {
              tooltip: "Remove All Selected Users",
              icon: "delete",
              onClick: (evt, data) => {
                handleDelete(data);
              },
            },
            (rowData) => ({
              tooltip: "Edit",
              icon: "edit",
              onClick: (evt, data) => {
                handleDialogOpen(data);
              },
            }),
          ]}
        />
      </div>
      <ItemUpdateDialog
        onsubmit={handleUpdateBlog}
        data={rowData}
        show={dialogOpen}
        onclose={handleDialogClose}
      />
    </>
  );
}

export default ItemList;
