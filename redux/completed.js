import * as ActionTypes from "./ActionTypes";

export const completed = (state = [], action) => {
  switch (action.type) {
    case ActionTypes.ADD_COMPLETE:
      if (state.some((el) => el === action.payload)) return state;
      else return state.concat(action.payload);

    case ActionTypes.DELETE_COMPLETE:
      return state.filter((complete) => complete !== action.payload);

    default:
      return state;
  }
};
