import * as ActionTypes from "./ActionTypes";

export const notes = (state = { errMess: null, notes: [] }, action) => {
  switch (action.type) {
    case ActionTypes.ADD_NOTES:
      return { ...state, errMess: null, notes: action.payload };

    case ActionTypes.ADD_NOTE:
      const { notes } = state;
      const note = { id: notes.length, ...action.payload };
      return { ...state, notes: notes.concat(note) };

    case ActionTypes.NOTES_FAILED:
      return { ...state, errMess: action.payload };

    case ActionTypes.DELETE_NOTE:
      // console.log(state);
      const newNotes = state.notes.filter((obj) => obj.id !== action.payload);
      return { ...state, notes: newNotes };

    default:
      return state;
  }
};
