import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import MaterialTable from "material-table";
import GiftcodeEditDialog from "../../components/dialog/giftcodeEdit";
import DeleteConfirmBox from "../../components/dialog/deleteConfirm";
import giftcodeApi from "../../api/giftcodeApi";
import * as giftcodeAction from "../../actions/giftcodeAction";
import * as dataColumns from "../../utils/dataColumns";
import * as actions from "../../utils/actions";
import "./index.scss";

function CodeList() {
  const [updateOpen, setUpdateOpen] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [error, setError] = useState("");
  const giftcodes = useSelector((state) => state.codes);
  const dispatch = useDispatch();

  async function getAllCodes() {
    try {
      let res = await giftcodeApi.getAll();
      console.log(res);
      let giftcodeArray = res.giffcodes;
      dispatch(giftcodeAction.loadGiftcodes(giftcodeArray));
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getAllCodes();
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

  const handleDelete = async (data) => {
    try {
      let res = await giftcodeApi.delete(data.code);
      console.log(res);
      if (res && res.msg === "success") {
        dispatch(giftcodeAction.deleteGiftcode(data.code));
        setDeleteConfirm(false);
      } else alert("Cannot delete item");
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async (object, codeId) => {
    let body = [];
    for (const property in object) {
      if (object[property])
        body.push({ propName: property, value: object[property] });
    }
    try {
      let res = await giftcodeApi.update(codeId, body);
      console.log(res);
      if (res && res.msg === "success") {
        setUpdateOpen(false);
        getAllCodes();
      }
      if (res && res.msg === "ValidatorError") setError(res.errors.type);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="giftcode__option">
        <Link to="/giftcode/create">
          <Button variant="contained" color="primary">
            <AddIcon fontSize="large" />
            Create
          </Button>
        </Link>
      </div>
      <div style={{ maxWidth: "100%" }}>
        <MaterialTable
          columns={dataColumns.GIFTCODE_COLUMNS}
          data={giftcodes.giftcodes}
          title="GIFTCODES"
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
            {
              tooltip: "Edit",
              icon: "edit",
              onClick: (evt, data) => {
                handleDialogOpen(data, actions.EDIT);
              },
            },
          ]}
        />
      </div>
      <GiftcodeEditDialog
        onsubmit={handleUpdate}
        data={rowData}
        show={updateOpen}
        error={error}
        onClearError={() => setError("")}
        onclose={() => handleDialogClose(actions.EDIT)}
      />
      <DeleteConfirmBox
        onsubmit={handleDelete}
        title="Delete this giftcode?"
        data={rowData}
        show={deleteConfirm}
        onclose={() => handleDialogClose(actions.DELETE)}
      />
    </>
  );
}

export default CodeList;
