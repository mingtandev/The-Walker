import * as actions from "../actions/actionDefine";

const initialState = {
  rollups: [],
  status: "",
};

const rollupReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.ROLLUP_LOAD:
      return {
        ...state,
        rollups: action.payload,
      };
    case actions.ROLLUP_DELETE:
      let newRollups = [...state.rollups];
      let day = action.payload;
      newRollups = newRollups.filter(function (code) {
        return code.day !== day;
      });
      return {
        ...state,
        rollups: newRollups,
      };
    default:
      return { ...state };
  }
};

export default rollupReducer;
