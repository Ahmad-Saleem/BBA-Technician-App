import AsyncStorage from "@react-native-community/async-storage";
import { createStore, applyMiddleware } from "redux";
import { persistStore, persistCombineReducers } from "redux-persist";
import thunk from "redux-thunk";
import logger from "redux-logger";
import { user } from "./user";
import { completed } from "./completed";
import { localProjectNotes } from "./projectNotes";
import { localEquipNotes } from "./equipNotes";
import { timestamps } from "./timestamps";
import { dataReads } from "./dataReads";
import { selectedImages } from "./selectedImages";
import { timerId } from "./timerId";
import { questions } from "./questions";

const config = {
  key: "root",
  storage: AsyncStorage,
  debug: true,
};

export const ConfigureStore = () => {
  const store = createStore(
    persistCombineReducers(config, {
      user,
      timestamps,
      completed,
      selectedImages,
      localProjectNotes,
      localEquipNotes,
      dataReads,
      timerId,
      questions
    }),
    applyMiddleware(thunk, logger)
  );
  const persistor = persistStore(store);

  return { persistor, store };
};
