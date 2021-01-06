import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import AddIcon from "@material-ui/icons/Add";
import { Button } from "@material-ui/core";
import MaterialTable from "material-table";
import RollUpEditDialog from "../../components/dialog/rollupEdit";
import DeleteConfirmBox from "../../components/dialog/deleteConfirm";
import rollupAPI from "../../api/rollupApi";
import * as rollupAction from "../../actions/rollupAction";
import * as dataColumns from "../../utils/dataColumns";
import * as actions from "../../utils/actions";
import "./index.scss";

function RollUpList() {
  const [updateOpen, setUpdateOpen] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [error, setError] = useState("");
  const rollups = useSelector((state) => state.rollup);
  const dispatch = useDispatch();

  async function getAllRoll() {
    try {
      let res = await rollupAPI.getAll();
      console.log(res);
      let rollupArray = res.rolls;
      dispatch(rollupAction.loadRollups(rollupArray));
      console.log(rollupArray, rollups.rollups);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getAllRoll();
    // return () => getAllRoll();
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

  const handleUpdateBlog = async (object, day) => {
    let body = [];
    for (const property in object) {
      if (object[property])
        body.push({ propName: property, value: object[property] });
    }

    try {
      let res = await rollupAPI.update(day, body);
      console.log(res);
      if (res && res.msg === "success") {
        setUpdateOpen(false);
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
      if (res && res.msg === "success") {
        dispatch(rollupAction.deleteRollups(data.day));
        setDeleteConfirm(false);
      } else alert("Cannot delete item");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="rollups__option">
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
      <RollUpEditDialog
        onsubmit={handleUpdateBlog}
        data={rowData}
        show={updateOpen}
        show={updateOpen}
        error={error}
        onClearError={() => setError("")}
        onclose={() => handleDialogClose(actions.EDIT)}
      />
      <DeleteConfirmBox
        onsubmit={handleDelete}
        title="Delete this roll?"
        data={rowData}
        show={deleteConfirm}
        onclose={() => handleDialogClose(actions.DELETE)}
      />
    </>
  );
}

export default RollUpList;
