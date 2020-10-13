import * as ActionTypes from "./ActionTypes";

export const timestamps = (state = [], action) => {
  switch (action.type) {
    case ActionTypes.ADD_TIMESTAMP:
      var timestamp = { ...action.payload };
      const found = state.some((el) => el.id === timestamp.id);
      if (found) {
        index = state.findIndex((x) => x.id === timestamp.id);
        return state.map((obj, i) =>
        i === index
          ? {
              ...obj,
              starting:timestamp.starting,
              isStarted:true
            }
          : obj
      );
        // .map((obj, i) =>
        //   i === index ? { ...obj, starting: timestamp.starting } : obj
        // );
      }

      //       index = timestamps.findIndex(x => x.eid ===timestamp.eid);
      //       return { ...state, timestamps: timestamps[index].concat(timestamp) };

      return state.concat(timestamp);

    case ActionTypes.UPDATE_TIMESTAMP:
      var timestamp = { ...action.payload };
      index = state.findIndex((x) => x.id === timestamp.id);
      // console.log(index);
      return state.map((obj, i) =>
        i === index
          ? {
              ...obj,
              duration: (timestamp.time-obj.starting) + obj.duration,
              stopping: timestamp.time.toLocaleTimeString(),
              isStarted:false
            }
          : obj
      );

    case ActionTypes.DELETE_TIMESTAMP:
      // console.log(state);
      return state.filter((obj) => obj.id !== action.payload);

    default:
      return state;
  }
};
