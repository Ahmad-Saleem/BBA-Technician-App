import * as ActionTypes from "./ActionTypes";

export const selectedImages = (state = [], action) => {
  switch (action.type) {
    case ActionTypes.ADD_IMAGES:
      var imageSet = { ...action.payload };
      console.log(imageSet);
      const found = state.some((el) => el.id === imageSet.id);
      if (found) {
        index = state.findIndex((x) => x.id === imageSet.id);
        let images = state[index].images;
        let newImages = images.concat(imageSet.images);
        return state.map((obj, i) =>
          i === index
            ? {
                ...obj,
                images: newImages,
              }
            : obj
        );
      }
      return state.concat(imageSet);

    case ActionTypes.DELETE_IMAGES:
      // console.log(state);
      index = state.findIndex((x) => x.id === action.id);
      let images = state[index].images;
      let newImages = images.filter(
        (image) => !action.payload.includes(image.uri)
      );
      return state.map((obj, i) =>
        i === index
          ? {
              ...obj,
              images: newImages,
            }
          : obj
      );

    default:
      return state;
  }
};
