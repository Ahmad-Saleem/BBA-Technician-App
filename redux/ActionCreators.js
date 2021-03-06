import * as ActionTypes from "./ActionTypes";
// import { setContext } from "apollo-link-context";
import { setContext } from "@apollo/client/link/context";
import {
  ApolloClient,
  InMemoryCache,
  gql,
  createHttpLink,
} from "@apollo/client";
// import { Auth } from "aws-amplify";
import { executeSync } from "graphql";
import { Auth, Storage, StorageProvider } from "aws-amplify";

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

export const fetchUser = () => async (dispatch) => {
  dispatch(userLoading());
  const myId = await Auth.currentAuthenticatedUser()
    .then((user) => {
      return user.attributes["custom:userId"];
    })
    .catch((err) => console.log(err));
  // const myId = user.attributes["custom:userId"]

  return client
    .query({
      query: gql`
          query {
            user(id: ${myId}){
              id
              first_name
              last_name
              assigned_projects_as_technician {
                id
                project_name
                start_date
                close_date
                notes {
                  id
                  category
                  message
                  created_by {
                    id
                    first_name
                    last_name
                  }
                  created_at
                  labels
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
                  cfm
                  system_name
                  sub_location
                  notes {
                    id
                    message
                    
                    created_by {
                      id
                      first_name
                      last_name
                    }
                    
                    created_at
                    labels
                  }
                }
              }
            }
          }
        `,
    })

    .then(({ data }) => dispatch(addUser(data.user)))
    .catch((error) => dispatch(userFailed(error.message)));
};

export const fetchQuestions = () => async (dispatch) => {
  client
    .query({
      query: gql`
        query {
          questions {
            id
            text
            options
          }
        }
      `,
    })
    .then(({ data }) => dispatch(addQuestions(data.questions)))
    .catch((error) => console.log(error));
};

export const addQuestions = (questions) => ({
  type: ActionTypes.ADD_QUESTIONS,
  payload: questions,
});

export const userLoading = () => ({
  type: ActionTypes.USER_LOADING,
});

export const userFailed = (errmess) => ({
  type: ActionTypes.USER_FAILED,
  payload: errmess,
});

export const addUser = (user) => ({
  type: ActionTypes.ADD_USER,
  payload: user,
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

export const postDataRead = (eId, prereads, postreads) => (dispatch) => {
  const newDataRead = {
    id: eId,
    prereads: prereads,
    postreads: postreads,
  };
  setTimeout(() => {
    dispatch(addDataRead(newDataRead));
  }, 2000);
};

export const addDataRead = (newDataRead) => ({
  type: ActionTypes.ADD_DATAREAD,
  payload: newDataRead,
});

export const postTimestamp = (eId) => (dispatch) => {
  const newTimestamp = {
    id: eId,
    isStarted: true,
  };
  const date = new Date();
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
  month[9] = "Oct";
  month[10] = "Nov";
  month[11] = "Dec";
  newTimestamp.initial = date.toLocaleTimeString();
  newTimestamp.starting = new Date().getTime();
  newTimestamp.stopping = "Stop tracking";
  newTimestamp.duration = 0;
  newTimestamp.datestring =
    month[date.getMonth()] + " " + date.getDate() + " - ";
  newTimestamp.finalDateString = "";
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
  let newImages = [...images];
  for (let i = 0; i < newImages.length; i++) {
    newImages[i].caption = "";
  }
  const newImageSet = {
    id: eId,
    images: newImages,
  };

  setTimeout(async () => {
    await dispatch(addImages(newImageSet));
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

export const postNote = (projId, note, category) => async (dispatch) => {
  const myId = await Auth.currentAuthenticatedUser()
    .then((user) => {
      return user.attributes["custom:userId"];
    })
    .catch((err) => console.log(err));
  console.log(note);
  const request = '"' + note + '"';
  const note_category = '"' + category + '"';
  console.log(request);
  var notee = {};
  await client
    .mutate({
      mutation: gql`
    mutation {
      createNote(input: {
        project_id:${projId}
        created_by:${myId},
        message:${request},
        category:${note_category},
      })
      {
        id
        created_by{
          id
          first_name
          last_name
        }
        created_at
        category
      }
    }
  `,
    })
    .then(({ data }) => {
      notee.id = data.createNote.id;
      notee.created_by = data.createNote.created_by;
      notee.created_at = data.createNote.created_at;
      notee.noteType = data.createNote.category;
    });
  return notee;
  // setTimeout(() => {
  //   dispatch(addNote(newNote));
  // }, 2000);
};

export const postEquipNote = (projId, eId, note, category) => async (
  dispatch
) => {
  const myId = await Auth.currentAuthenticatedUser()
    .then((user) => {
      return user.attributes["custom:userId"];
    })
    .catch((err) => console.log(err));
  const request = '"' + note + '"';
  const note_category = '"' + category + '"';
  var notee = {};
  await client
    .mutate({
      mutation: gql`
    mutation {
      createNote(input: {
        project_id:${projId},
        created_by:${myId},
        message:${request},
        equipment:${eId},
        category:${note_category},
      })
      {
        id
        created_by{
          id
          first_name
          last_name
        }
        created_at
        category
      }
    }
  `,
    })
    .then(({ data }) => {
      notee.id = data.createNote.id;
      notee.created_by = data.createNote.created_by;
      notee.created_at = data.createNote.created_at;
      notee.noteType = data.createNote.category;
    });
  return notee;
};

export const deleteNote = (id) => async (dispatch) => {
  const myId = await Auth.currentAuthenticatedUser()
    .then((user) => {
      return user.attributes["custom:userId"];
    })
    .catch((err) => console.log(err));
  client.mutate({
    mutation: gql`
    mutation{
      deleteNote(where:{id:${id}}){
        id
      }
    }
  `,
  });
  setTimeout(() => {
    dispatch(reload());
  }, 1000);
};

export const reload = () => (dispatch) => {
  setTimeout(() => {
    console.log("hey");
  }, 500);
};

export const postCaption = (eId, caption, id) => (dispatch) => {
  const newCaption = {
    eId: eId,
    id: id,
    caption: caption,
  };
  setTimeout(() => {
    dispatch(addCaption(newCaption));
  }, 2000);
};

export const addCaption = (newCaption) => ({
  type: ActionTypes.ADD_CAPTION,
  id: newCaption.eId,
  payload: { ...newCaption },
});

export const uploadToStorage = (preread, postread, eId, images, pId) => (
  dispatch
) => {
  // console.log(preread, postread, eId, images);
  var pre = { ...preread };
  var post = { ...postread };
  if (!pre.coil_differential_pressure_with_filter) {
    pre.coil_differential_pressure_with_filter = 0;
  }
  if (!pre.coil_differential_pressure_without_filter) {
    pre.coil_differential_pressure_without_filter = 0;
  }
  if (!pre.coil_Infrared_image_coil) {
    pre.coil_Infrared_image_coil = 0;
  }
  if (!pre.air_temp_reading) {
    pre.air_temp_reading = 0;
  }
  if (!pre.fan_speed) {
    pre.fan_speed = 0;
  }
  if (!pre.outside_air_damper_position) {
    pre.outside_air_damper_position = 0;
  }
  if (!pre.outside_air_temperature) {
    pre.outside_air_temperature = 0;
  }
  if (!pre.supply_air_temperature) {
    pre.supply_air_temperature = 0;
  }
  if (!pre.velocity) {
    pre.velocity = 0;
  }
  if (!post.coil_differential_pressure_with_filter) {
    post.coil_differential_pressure_with_filter = 0;
  }
  if (!post.coil_differential_pressure_without_filter) {
    post.coil_differential_pressure_without_filter = 0;
  }
  if (!post.coil_Infrared_image_coil) {
    post.coil_Infrared_image_coil = 0;
  }
  if (!post.air_temp_reading) {
    post.air_temp_reading = 0;
  }
  if (!post.fan_speed) {
    post.fan_speed = 0;
  }
  if (!post.outside_air_damper_position) {
    post.outside_air_damper_position = 0;
  }
  if (!post.outside_air_temperature) {
    post.outside_air_temperature = 0;
  }
  if (!post.supply_air_temperature) {
    post.supply_air_temperature = 0;
  }
  if (!post.velocity) {
    post.velocity = 0;
  }

  const upload = async (obj) => {
    try {
      console.log(obj.uri);
      const response = await fetch(obj.uri);

      const blob = await response.blob();

      await Storage.put(`/${pId}/${obj.filename}`, blob, {
        contentType: "image/jpeg",
      }).then((result) => console.log(result));
    } catch (err) {
      console.log(err);
    }
  };

  for (let index = 0; index < images?.length; index++) {
    const obj = images[index];
    console.log(obj);
    upload(obj);
  }

  setTimeout(() => {
    console.log("storage done");
    dispatch(uploadDataReads(pre, post, eId, images, pId));
  }, 2000);
};

export const uploadDataReads = (preread, postread, eId, images, pId) => async (
  dispatch
) => {
  const preId = await client
    .mutate({
      mutation: gql`
        mutation {
          createDataReads(
            input: {
              coil_differential_pressure_with_filter: ${preread.coil_differential_pressure_with_filter}
              coil_differential_pressure_without_filter: ${preread.coil_differential_pressure_without_filter}
              fan_speed: ${preread.fan_speed}
              outside_air_temperature: ${preread.outside_air_temperature}
              outside_air_damper_position: ${preread.outside_air_damper_position}
              air_temp_reading: ${preread.air_temp_reading}
              coil_Infrared_image_coil: ${preread.coil_Infrared_image_coil}
              is_terminal: ${preread.is_terminal}
              velocity: ${preread.velocity}
              supply_air_temperature: ${preread.supply_air_temperature}
            }
          ) {
            id
          }
        }
      `,
    })
    .then(({ data }) => {
      console.log("preread creation done" + data.createDataReads.id);
      return data.createDataReads.id;
    });

  const postId = await client
    .mutate({
      mutation: gql`
        mutation {
          createDataReads(
            input: {
              coil_differential_pressure_with_filter: ${postread.coil_differential_pressure_with_filter}
              coil_differential_pressure_without_filter: ${postread.coil_differential_pressure_without_filter}
              fan_speed: ${postread.fan_speed}
              outside_air_temperature: ${postread.outside_air_temperature}
              outside_air_damper_position: ${postread.outside_air_damper_position}
              air_temp_reading: ${postread.air_temp_reading}
              coil_Infrared_image_coil: ${postread.coil_Infrared_image_coil}
              is_terminal: ${postread.is_terminal}
              velocity: ${postread.velocity}
              supply_air_temperature: ${postread.supply_air_temperature}
            }
          ) {
            id
          }
        }
      `,
    })
    .then(({ data }) => {
      console.log("postread creation done" + data.createDataReads.id);
      return data.createDataReads.id;
    });

  setTimeout(() => {
    console.log("data creation done");
    dispatch(uploadData(preId, postId, eId, images, pId));
  }, 4000);
};

export const uploadData = (preId, postId, eId, images, pId) => async (
  dispatch
) => {
  const myId = await Auth.currentAuthenticatedUser()
    .then((user) => {
      return user.attributes["custom:userId"];
    })
    .catch((err) => console.log(err));
  const dataId = await client
    .mutate({
      mutation: gql`
        mutation {
          createData(
            input: {
              created_by: ${myId}
              notes: "hey"
              pre_reads:${preId}
              post_reads:${postId}
            }
          ) {
            id
          }
        }
      `,
    })
    .then(({ data }) => {
      console.log(data.createData.id);
      return data.createData.id;
    });

  setTimeout(() => {
    console.log("data creation done");
    dispatch(uploadImages(eId, myId, dataId, images, pId));
  }, 6000);
};
export const uploadImages = (eId, myId, dataId, images, pId) => (dispatch) => {
  console.log(eId, myId, dataId, images);
  if (images?.length > 0) {
    for (let index = 0; index < images?.length; index++) {
      const { caption, filename, uri } = images[index];
      const name = '"' + filename + '"';
      const urii = '"/' + pId + "/" + filename + '"';
      const captionn = '"' + caption + '"';
      console.log(name);
      client.mutate({
        mutation: gql`
          mutation {
            createFile(
              input: {
                notes: ${captionn},
                created_by : ${myId},
                name:${name},
                data : ${dataId}, 
                path : ${urii}
              }
              ) {
              id
            }
          }
        `,
      });
    }
  }

  setTimeout(() => {
    dispatch(updateEquipment(eId, dataId));
  }, 2000);
};

export const updateEquipment = (eId, dataId) => (dispatch) => {
  console.log(eId, dataId);
  client
    .mutate({
      mutation: gql`
    mutation {
      updateEquipment(
        where: {id:${eId}}
        data: {data: ${dataId}}
      ) {
        id
        }
      }
  `,
    })
    .then(({ data }) => {
      console.log(data.updateEquipment.id);
    });

  setTimeout(() => {
    dispatch(fetchUser());
  }, 2000);
};

export const postLocalProjectNote = (projId, note, author) => async (
  dispatch
) => {
  const newNote = {
    projId: projId,
    author: author,
    note: note,
  };
  setTimeout(() => {
    dispatch(addProjectNote(newNote));
  }, 2000);
};

export const addProjectNote = (newNote) => ({
  type: ActionTypes.ADD_PROJECTNOTE,
  payload: newNote,
});

export const deleteProjectNote = (id) => ({
  type: ActionTypes.DELETE_PROJECTNOTE,
  id: id,
});

export const postLocalEquipNote = (projId, eId, author, note) => async (
  dispatch
) => {
  const newNote = {
    projId: projId,
    eId: eId,
    author: author,
    note: note,
  };
  setTimeout(() => {
    dispatch(addEquipNote(newNote));
  }, 2000);
};

export const addEquipNote = (newNote) => ({
  type: ActionTypes.ADD_EQUIPNOTE,
  payload: newNote,
});

export const deleteEquipNote = (id) => ({
  type: ActionTypes.DELETE_EQUIPNOTE,
  id: id,
});

// export const updateEquipment = (eId, dataId) => (dispatch) => {
//   console.log(eId, dataId);
//   client
//     .mutate({
//       mutation: gql`
//     mutation {
//       createEquipment(
//         where: {id:${eId}}
//         data: {data: ${dataId}}
//       ) {
//         id
//         }
//       }
//   `,
//     })
//     .then(({ data }) => {
//       console.log(data.updateEquipment.id);
//     });

//   setTimeout(() => {
//     dispatch(fetchUser());
//   }, 2000);
// };

export const postLocalNote = (
  id,
  projId,
  category,
  author,
  note,
  eId
) => async (dispatch) => {
  const newNote = {
    id: id,
    projId: projId,
    eId: eId || null,
    author: author,
    note: note,
    category: category,
  };
  setTimeout(() => {
    dispatch(addLocalNote(newNote));
  }, 2000);
};

export const addLocalNote = (newNote) => ({
  type: ActionTypes.ADD_LOCALNOTE,
  payload: newNote,
});

export const deleteLocalNote = (id) => ({
  type: ActionTypes.DELETE_LOCALNOTE,
  id: id,
});

export const startTimer = (eId) => async (dispatch) => {
  const myId = await Auth.currentAuthenticatedUser()
    .then((user) => {
      return user.attributes["custom:userId"];
    })
    .catch((err) => console.log(err));
  client
    .mutate({
      mutation: gql`
  mutation{
    createTimer(equipmentId: ${eId}, userId:${myId}){
      id
    }
  }
`,
    })
    .then(({ data }) => {
      console.log(data.createTimer.id);
      dispatch(addTimerId(data.createTimer.id));
      client.mutate({
        mutation: gql`
          mutation {
            startTimer(timerId: ${data.createTimer.id}) {
              start_time
            }
          }
        `,
      });
    });
  setTimeout(() => {
    dispatch(fetchUser());
  }, 2000);
};
export const addTimerId = (id) => ({
  type: ActionTypes.ADD_TIMERID,
  payload: id,
});
export const stopTimer = (id) => async (dispatch) => {
  client.mutate({
    mutation: gql`
  mutation{
    stopTimer(timerId: ${id}){
      id
    }
  }
`,
  });

  setTimeout(() => {
    dispatch(fetchUser());
  }, 2000);
};
export const removeTimerId = (id) => ({
  type: ActionTypes.REMOVE_TIMERID,
  payload: id,
});

export const updateEquipmentOnRequest = (equipment, eId, data) => (
  dispatch
) => {
  console.log(eId, data);
  let { name, location, cfm, type } = data;
  let name1 = '"' + name + '"';
  let location1 = '"' + location + '"';
  let type1 = '"' + type + '"';

  client
    .mutate({
      mutation: gql`
    mutation {
      updateEquipment(
        where: {id:${eId}}
        data: {system_name: ${name1}, sub_location: ${location1}, cfm: ${cfm}, type: ${type1}}
      ) {
        id
        }
      }
  `,
    })
    .then(({ data }) => {
      console.log(data.updateEquipment.id);
      dispatch(
        postRequest(
          data.updateEquipment.id,
          `CFM/Tonnage: ${equipment.cfm} changed to ${cfm}, Location: ${equipment.sub_location} changed to ${location}, Name: ${equipment.system_name} changed to ${name}, Equipment type: ${equipment.type} changed to ${type}`
        )
      );
    });

  // setTimeout(() => {
  //   dispatch(fetchUser());
  // }, 2000);
};

export const postRequest = (eId, note) => async (dispatch) => {
  const myId = await Auth.currentAuthenticatedUser()
    .then((user) => {
      return user.attributes["custom:userId"];
    })
    .catch((err) => console.log(err));
  const request = '"' + note + '"';
  console.log("request", note);
  client.mutate({
    mutation: gql`
    mutation {
      createNote(input: {
        equipment:${eId},
        created_by:${myId},
        message:${request},
        labels: [CHANGE_REQUEST]
      })
      {
        id
      }
    }
  `,
  });
};

export const postAnswers = (eId, answers) => async (dispatch) => {
  const myId = await Auth.currentAuthenticatedUser()
    .then((user) => {
      return user.attributes["custom:userId"];
    })
    .catch((err) => console.log(err));
  answers.map((ans) => {
    let correct_answer = '"' + ans.answer + '"';
    client.mutate({
      mutation: gql`
  mutation {
    saveAnswers(
      equipmentId:${eId},
      questionId:${ans.qId},
      userId:${myId},
      answer: ${correct_answer}
    )
    {
      id
    }
  }
`,
    });
  });
};
