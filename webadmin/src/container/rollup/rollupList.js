import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import RollUpEditDialog from "../../components/dialog/rollupEdit";
import { Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import rollupAPI from "../../api/rollupApi";
import * as rollupAction from "../../actions/rollupAction";
import MaterialTable from "material-table";
import * as dataColumns from "../../utils/dataColumns";
import "./index.scss";
import rollupApi from "../../api/rollupApi";

function RollUpList() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rowData, setRowData] = useState(null);

  const rollups = useSelector((state) => state.rollup);

  const dispatch = useDispatch();

  async function getAllRoll() {
    try {
      let res = await rollupAPI.getAll();
      console.log(res);
      let rollupArray = res.rolls;
      dispatch(rollupAction.loadRollups(rollupArray));
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getAllRoll();
  }, []);

  const handleDialogOpen = (rowData) => {
    console.log("rrrrrrrrrr", rowData);
    setRowData(rowData);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleUpdateBlog = async (object, day) => {
    let body = [];
    for (const property in object) {
      if (object[property])
        body.push({ propName: property, value: object[property] });
    }

    try {
      let res = await rollupApi.update(day, body);
      console.log(res);
      if (res && res.msg === "success") {
        setDialogOpen(false);
        getAllRoll();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (data) => {
    try {
      let res = await rollupAPI.delete(data.day);
      console.log(res);
      if (res && res.msg === "success")
        dispatch(rollupAction.deleteRollups(data.day));
      else alert("Cannot delete item");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="giftcode__option">
        <Link to="/rollup/create">
          <Button variant="contained" color="primary">
            <AddIcon fontSize="large" />
            Create
          </Button>
        </Link>
      </div>
      <div style={{ maxWidth: "100%" }}>
        <MaterialTable
          columns={dataColumns.ROLLUP_COLUMNS}
          data={rollups.rollups}
          title="ROLL-UPS"
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
      <RollUpEditDialog
        onsubmit={handleUpdateBlog}
        data={rowData}
        show={dialogOpen}
        onclose={handleDialogClose}
      />
    </>
  );
}

export default RollUpList;
