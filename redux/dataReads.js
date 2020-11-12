import * as ActionTypes from "./ActionTypes";

export const dataReads = (state = [], action) => {
  switch (action.type) {
    case ActionTypes.ADD_DATAREAD:
      var dataread = { ...action.payload };
      const found = state.some((el) => el.id === dataread.id);
      if (found) {
        index = state.findIndex((x) => x.id === dataread.id);
        return state.map((obj, i) =>
        i === index
          ? {
              ...obj,
              prereads:dataread.prereads,
              postreads:dataread.postreads
            }
          : obj
      );
      }

      return state.concat(dataread);

    // case ActionTypes.UPDATE_TIMESTAMP:
    //   var timestamp = { ...action.payload };
    //   index = state.findIndex((x) => x.id === timestamp.id);
    //   // console.log(index);
    //   return state.map((obj, i) =>
    //     i === index
    //       ? {
    //           ...obj,
    //           duration: (timestamp.time-obj.starting) + obj.duration,
    //           stopping: timestamp.time.toLocaleTimeString(),
    //           isStarted:false
    //         }
    //       : obj
    //   );

    // case ActionTypes.DELETE_TIMESTAMP:
    //   // console.log(state);
    //   return state.filter((obj) => obj.id !== action.payload);

    default:
      return state;
  }
};
