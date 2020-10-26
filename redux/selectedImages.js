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
        (image) => !action.payload.includes(image)
      );
      return state.map((obj, i) =>
        i === index
          ? {
              ...obj,
              images: newImages,
            }
          : obj
      );

    case ActionTypes.ADD_CAPTION:
      index = state.findIndex((x) => x.id === action.id);
      let Images = state[index].images;
      let i = Images.findIndex((x) => x.id === action.payload.id);
      // console.log(i);
      Images[i].caption=action.payload.caption
      return state.map((obj, i) =>
      i === index
        ? {
            ...obj,
            images: Images,
          }
        : obj
    );

    default:
      return state;
  }
};
