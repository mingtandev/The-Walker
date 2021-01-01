import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import itemApi from "../../api/itemApi";
import MaterialTable from "material-table";
import ItemUpdateDialog from "../../components/dialog/itemUpdate";
import DeleteConfirmBox from "../../components/dialog/deleteConfirm";
import * as itemsAction from "../../actions/itemsAction";
import * as itemColumns from "../../utils/dataColumns";
import * as actions from "../../utils/actions";
import "./index.scss";

function ItemList() {
  const [updateOpen, setUpdateOpen] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [error, setError] = useState("");
  const items = useSelector((state) => state.items);
  const dispatch = useDispatch();

  async function getAllItems() {
    try {
      let res = await itemApi.getAll();
      console.log(res);
      let itemArray = res.products;
      dispatch(itemsAction.loadItems(itemArray));
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getAllItems();
    return () => getAllItems();
  }, []);

  const handleDialogOpen = (rowData, e) => {
    setRowData(rowData);
    if (e === actions.EDIT) setUpdateOpen(true);
    else setDeleteConfirm(true);
  };

  const handleDialogClose = (e) => {
    if (e === actions.EDIT) setUpdateOpen(false);
    else setDeleteConfirm(false);
  };

  const handleUpdate = async (object, codeId) => {
    let body = [];
    for (const property in object) {
      if (object[property])
        body.push({ propName: property, value: object[property] });
    }
    try {
      let res = await itemApi.update(codeId, body);
      console.log(res);
      if (res && res.msg === "success") {
        setUpdateOpen(false);
        getAllItems();
        return;
      }
      if (res && res.msg === "ValidatorError") {
        if (res.errors.name === "Name already exists!") {
          setError("Item Name already exists!");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (data) => {
    try {
      let res = await itemApi.delete(data._id);
      console.log(res);
      if (res && res.msg === "success") {
        setDeleteConfirm(false);
        dispatch(itemsAction.deleteItem(data._id));
      } else alert("Cannot delete item");
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
            rowStyle: (rowData) => ({
              backgroundColor:
                rowData.tableData.id % 2 === 0
                  ? "rgba(249, 249, 249, 0.6)"
                  : "#FFF",
            }),
          }}
          actions={[
            {
              tooltip: "Remove All Selected Users",
              icon: "delete",
              onClick: (evt, data) => {
                handleDialogOpen(data, actions.DELETE);
              },
            },
            () => ({
              tooltip: "Edit",
              icon: "edit",
              onClick: (e, data) => {
                handleDialogOpen(data, actions.EDIT);
              },
            }),
          ]}
        />
      </div>
      <ItemUpdateDialog
        onsubmit={handleUpdate}
        data={rowData}
        show={updateOpen}
        error={error}
        onClearError={() => setError("")}
        onclose={() => handleDialogClose(actions.EDIT)}
      />
      <DeleteConfirmBox
        onsubmit={handleDelete}
        title="Delete this item?"
        data={rowData}
        show={deleteConfirm}
        onclose={() => handleDialogClose(actions.DELETE)}
      />
    </>
  );
}

export default ItemList;
