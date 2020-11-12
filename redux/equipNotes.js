import * as ActionTypes from "./ActionTypes";

export const localEquipNotes = (state = [], action) => {
  switch (action.type) {
    case ActionTypes.ADD_EQUIPNOTE:
      var newNote = { ...action.payload };
      newNote.id = state.length;
      return state.concat(newNote);

    case ActionTypes.DELETE_EQUIPNOTE:
      return state.filter((obj) => obj.id !== action.id);

    case ActionTypes.DELETE_EQUIPNOTES:
      return [];
    default:
      return state;
  }
};
