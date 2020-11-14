import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import MaterialTable from "material-table";
import GiftcodeEditDialog from "../../components/dialog/giftcodeEdit";
import giftcodeApi from "../../api/giftcodeApi";
import * as giftcodeAction from "../../actions/giftcodeAction";
import * as dataColumns from "../../utils/dataColumns";
import "./index.scss";

function CodeList() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rowData, setRowData] = useState(null);

  const giftcodes = useSelector((state) => state.codes);

  const dispatch = useDispatch();

  async function getAllCodes() {
    try {
      let res = await giftcodeApi.getAll();
      console.log(res);
      let giftcodeArray = res.giffcodes;
      dispatch(giftcodeAction.loadGiftcodes(giftcodeArray));
      console.log(giftcodeArray);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getAllCodes();
  }, []);

  const handleDialogOpen = (rowData) => {
    setRowData(rowData);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDelete = async (data) => {
    try {
      let res = await giftcodeApi.delete(data.code);
      console.log(res);
      if (res && res.msg === "success")
        dispatch(giftcodeAction.deleteGiftcode(data.code));
      else alert("Cannot delete item");
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateBlog = async (object, codeId) => {
    let body = [];
    for (const property in object) {
      if (object[property])
        body.push({ propName: property, value: object[property] });
    }
    try {
      let res = await giftcodeApi.update(codeId, body);
      console.log(res);
      if (res && res.msg === "success") {
        setDialogOpen(false);
        getAllCodes();
      }
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
                handleDialogOpen(data);
              },
            },
          ]}
        />
      </div>
      <GiftcodeEditDialog
        onsubmit={handleUpdateBlog}
        data={rowData}
        show={dialogOpen}
        onclose={handleDialogClose}
      />
    </>
  );
}

export default CodeList;
