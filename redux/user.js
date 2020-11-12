import * as ActionTypes from "./ActionTypes";

export const user = (
  state = { isLoading: true, errMess: null, user: {} },
  action
) => {
  switch (action.type) {
    case ActionTypes.ADD_USER:
      return {
        ...state,
        isLoading: false,
        errMess: null,
        user: action.payload,
      };

    case ActionTypes.USER_LOADING:
      return { ...state, isLoading: true, errMess: null, user: {} };

    case ActionTypes.USER_FAILED:
      return { ...state, isLoading: false, errMess: action.payload };

    // case ActionTypes.ADD_NOTE:
    //   return {
    //     ...state,
    //     isLoading: false,
    //     errMess: action.payload,
    //     user: state.user.assigned_projects_as_technician.forEach((item) => {
    //       if (item.id === action.payload.project.id) {
    //         item.notes.push(action.payload);
    //       }
    //     }),
    //   };

    default:
      return state;
  }
};
