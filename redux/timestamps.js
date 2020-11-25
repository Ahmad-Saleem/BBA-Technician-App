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

      }

      return state.concat(timestamp);

    case ActionTypes.UPDATE_TIMESTAMP:
      var timestamp = { ...action.payload };
      index = state.findIndex((x) => x.id === timestamp.id);
      // console.log(index);
      var month = new Array();
      month[0] = "Jan";
      month[1] = "Feb";
      month[2] = "Mar";
      month[3] = "Apr";
      month[4] = "May";
      month[5] = "Jun";
      month[6] = "Jul";
      month[7] = "Aug";
      month[8] = "Sep";
      month[9] = "oct";
      month[10] = "Nov";
      month[11] = "Dec";
      return state.map((obj, i) =>
        i === index
          ? {
              ...obj,
              duration: (timestamp.time-obj.starting) + obj.duration,
              stopping: timestamp.time.toLocaleTimeString(),
              finalDateString: obj.datestring+ month[timestamp.time.getMonth()] + " " + timestamp.time.getDate()+"/"+timestamp.time.getFullYear(),
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
