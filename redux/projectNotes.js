import * as ActionTypes from "./ActionTypes";

export const localProjectNotes = (state = [], action) => {
  switch (action.type) {
    case ActionTypes.ADD_PROJECTNOTE:
      var newNote = { ...action.payload };
      newNote.id = state.length;
      return state.concat(newNote);

    case ActionTypes.DELETE_PROJECTNOTE:
      return state.filter((obj) => obj.id !== action.id);

    case ActionTypes.DELETE_PROJECTNOTES:
      return [];
    default:
      return state;
  }
};
