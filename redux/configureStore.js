import AsyncStorage from "@react-native-community/async-storage";
import { createStore, applyMiddleware } from "redux";
import { persistStore, persistCombineReducers } from "redux-persist";
import { ApolloClient, InMemoryCache ,ApolloProvider } from '@apollo/client';
import thunk from "redux-thunk";
import logger from "redux-logger";
import { projects } from "./projects";
import { equipments } from "./equipments";
import { completed } from "./completed";
import { timestamps } from "./timestamps";
import { notes } from "./notes";
import { selectedImages } from "./selectedImages";
const client = new ApolloClient({
  uri: 'https://bba-server.herokuapp.com/graphql',
  cache: new InMemoryCache()
});

const config = {
  key: "root",
  storage: AsyncStorage,
  debug: true,
};

export const ConfigureStore = () => {
  const store = createStore(
    persistCombineReducers(config, {
      projects,
      equipments,
      timestamps,
      completed,
      notes,
      selectedImages,
      
    }),
    applyMiddleware(thunk, logger)
  );
  const persistor = persistStore(store);

  return { persistor, store };
};
