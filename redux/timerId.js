import * as ActionTypes from "./ActionTypes";

export const timerId = (state = null, action) => {
  switch (action.type) {
    case ActionTypes.ADD_TIMERID:
      return action.payload;
    case ActionTypes.REMOVE_TIMERID:
      return null;
    default:
      return state;
  }
};
