import * as ActionTypes from "./ActionTypes";

export const localNotes = (state = [], action) => {
  switch (action.type) {
    case ActionTypes.ADD_LOCALNOTE:
      var newNote = { ...action.payload };
    //   newNote.id = state.length;
      return state.concat(newNote);

    case ActionTypes.DELETE_LOCALNOTE:
      return state.filter((obj) => obj.id !== action.id);

    case ActionTypes.DELETE_LOCALNOTES:
      return [];
    default:
      return state;
  }
};
