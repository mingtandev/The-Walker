import * as actionType from "./actionDefine";

export const loadRollups = (rollups) => {
  return {
    type: actionType.ROLLUP_LOAD,
    payload: rollups,
  };
};

export const deleteRollups = (day) => {
  return {
    type: actionType.ROLLUP_DELETE,
    payload: day,
  };
};
