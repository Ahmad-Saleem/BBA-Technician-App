import * as ActionTypes from "./ActionTypes";
// import { setContext } from "apollo-link-context";
import { setContext } from "@apollo/client/link/context";
import { baseUrl } from "../shared/baseUrl";
import {
  ApolloClient,
  InMemoryCache,
  gql,
  createHttpLink,
} from "@apollo/client";
import { Auth } from "aws-amplify";

const httpLink = createHttpLink({
  uri: "https://bba-server.herokuapp.com/graphql",
});

const authLink = setContext(async (_, { headers }) => {
  const user = await Auth.currentAuthenticatedUser();

  const { signInUserSession } = user;
  const { jwtToken } = signInUserSession.accessToken;

  return {
    headers: {
      ...headers,
      authorization: jwtToken || "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  onError: ({ networkError, graphQLError }) => {
    console.log("graphQLErrors", graphQLError);
    console.log("networkErrors", networkError);
  },
});

// export const fetchEquipments = () => (dispatch) => {
//   return fetch(baseUrl + "equipments")
//     .then(
//       (response) => {
//         if (response.ok) {
//           return response;
//         } else {
//           var error = new Error(
//             "Error " + response.status + ": " + response.statusText
//           );
//           error.response = response;
//           throw error;
//         }
//       },
//       (error) => {
//         var errmess = new Error(error.message);
//         throw errmess;
//       }
//     )
//     .then((response) => response.json())
//     .then((equipments) => dispatch(addEquipments(equipments)))
//     .catch((error) => dispatch(equipmentsFailed(error.message)));
// };

// export const equipmentsFailed = (errmess) => ({
//   type: ActionTypes.EQUIPMENTS_FAILED,
//   payload: errmess,
// });

// export const addEquipments = (equipments) => ({
//   type: ActionTypes.ADD_EQUIPMENTS,
//   payload: equipments,
// });

// export const fetchProjects = () => (dispatch) => {
//   dispatch(projectsLoading());

//   return fetch(baseUrl + "projects")
//     .then(
//       (response) => {
//         if (response.ok) {
//           return response;
//         } else {
//           var error = new Error(
//             "Error " + response.status + ": " + response.statusText
//           );
//           error.response = response;
//           throw error;
//         }
//       },
//       (error) => {
//         var errmess = new Error(error.message);
//         throw errmess;
//       }
//     )
//     .then((response) => response.json())
//     .then((projects) => dispatch(addProjects(projects)))
//     .catch((error) => dispatch(projectsFailed(error.message)));
// };

export const fetchProjects = () => (dispatch) => {
  dispatch(projectsLoading());
 
  return (
    client
      .query({
        query: gql`
          query {
            projects {
              id
              project_name
              start_date
              close_date
              notes {
                id
                message
                created_by {
                  first_name
                }
                created_at
              }
              location {
                address
                location_name
                city
                state
              }
              equipments {
                id
                building
              }
            }
          }
        `,
      })
      // .then(
      //   (response) => {
      //     if (response.ok) {
      //       return response;
      //     } else {
      //       var error = new Error(
      //         "Error " + response.status + ": " + response.statusText
      //       );
      //       error.response = response;
      //       throw error;
      //     }
      //   },
      //   (error) => {
      //     var errmess = new Error(error.message);
      //     throw errmess;
      //   }
      // )
      // .then((response) => response.json())
      .then(({ data }) => dispatch(addProjects(data.projects)))
      .catch((error) => dispatch(projectsFailed(error.message)))
  );
};

export const projectsLoading = () => ({
  type: ActionTypes.PROJECTS_LOADING,
});

export const projectsFailed = (errmess) => ({
  type: ActionTypes.PROJECTS_FAILED,
  payload: errmess,
});

export const addProjects = (projects) => ({
  type: ActionTypes.ADD_PROJECTS,
  payload: projects,
});

export const postCompleted = (eId) => (dispatch) => {
  setTimeout(() => {
    dispatch(addCompleted(eId));
  }, 2000);
};

export const addCompleted = (eId) => ({
  type: ActionTypes.ADD_COMPLETE,
  payload: eId,
});

export const deleteCompleted = (eId) => ({
  type: ActionTypes.DELETE_COMPLETE,
  payload: eId,
});

export const postTimestamp = (eId) => (dispatch) => {
  const newTimestamp = {
    id: eId,
    isStarted: true,
  };
  const date = new Date().toLocaleTimeString();
  newTimestamp.initial = date;
  newTimestamp.starting = new Date().getTime();
  newTimestamp.stopping = "Stop tracking";
  newTimestamp.duration = 0;
  setTimeout(() => {
    dispatch(addTimestamp(newTimestamp));
  }, 2000);
};

export const addTimestamp = (newTimestamp) => ({
  type: ActionTypes.ADD_TIMESTAMP,
  payload: newTimestamp,
});

export const updateTimestamp = (eId) => ({
  type: ActionTypes.UPDATE_TIMESTAMP,
  payload: { id: eId, time: new Date() },
});

export const deleteTimestamps = (id) => ({
  type: ActionTypes.DELETE_TIMESTAMP,
  payload: id,
});

export const postImages = (eId, images) => (dispatch) => {
  let newImages=[...images]
  for(let i=0;i<newImages.length;i++){
    newImages[i].caption=""
  }
  const newImageSet = {
    id: eId,
    images: newImages,
  };
  // const date=new Date().toLocaleTimeString();
  // newTimestamp.initial = date;
  // newTimestamp.starting = new Date();
  // newTimestamp.stopping = "Stop tracking";
  // newTimestamp.duration = 0;
  setTimeout(() => {
    dispatch(addImages(newImageSet));
  }, 2000);
};

export const addImages = (newImageSet) => ({
  type: ActionTypes.ADD_IMAGES,
  payload: newImageSet,
});

export const deleteImages = (eId, images) => ({
  type: ActionTypes.DELETE_IMAGES,
  id: eId,
  payload: images,
});

export const postNote = (projId, note) => (dispatch) => {
  const newNote = {
    projId: projId,
    // author: author,
    note: note,
  };
  newNote.date = new Date().toISOString();
  setTimeout(() => {
    dispatch(addNote(newNote));
  }, 2000);
};

export const addNote = (newNote) => ({
  type: ActionTypes.ADD_NOTE,
  payload: newNote,
});

export const fetchNotes = () => (dispatch) => {
  return fetch(baseUrl + "notes")
    .then(
      (response) => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error(
            "Error " + response.status + ": " + response.statusText
          );
          error.response = response;
          throw error;
        }
      },
      (error) => {
        var errmess = new Error(error.message);
        throw errmess;
      }
    )
    .then((response) => response.json())
    .then((notes) => dispatch(addNotes(notes)))
    .catch((error) => dispatch(notesFailed(error.message)));
};

export const notesFailed = (errmess) => ({
  type: ActionTypes.COMMENTS_FAILED,
  payload: errmess,
});

export const addNotes = (notes) => ({
  type: ActionTypes.ADD_NOTES,
  payload: notes,
});

export const deleteNote = (id) => ({
  type: ActionTypes.DELETE_NOTE,
  payload: id,
});

export const postCaption = (eId, caption, id) => (dispatch) => {
  const newCaption = {
    eId: eId,
    id:id,
    caption: caption,
  };
  setTimeout(() => {
    dispatch(addCaption(newCaption));
  }, 2000);
};

export const addCaption = (newCaption) => ({
  type: ActionTypes.ADD_CAPTION,
  id:newCaption.eId,
  payload: {...newCaption},
});
