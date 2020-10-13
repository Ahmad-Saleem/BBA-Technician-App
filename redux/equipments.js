import * as ActionTypes from "./ActionTypes";

export const equipments = (
  state = { errMess: null, equipments: [] },
  action
) => {
  switch (action.type) {
    case ActionTypes.ADD_EQUIPMENTS:
      return { ...state, errMess: null, equipments: action.payload };

    // case ActionTypes.ADD_COMMENT:
    //   const { equipments } = state;
    //   const comment = { id: equipments.length, ...action.payload };
    //   return { ...state, equipments: equipments.concat(comment) };

    case ActionTypes.EQUIPMENTS_FAILED:
      return { ...state, errMess: action.payload };

    default:
      return state;
  }
};
