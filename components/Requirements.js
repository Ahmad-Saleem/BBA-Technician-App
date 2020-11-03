import React from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Platform,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from "react-native";
import { connect } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { Icon, Form, Textarea } from "native-base";
import {
  postTimestamp,
  postCompleted,
  deleteCompleted,
  updateTimestamp,
  deleteTimestamps,
  postNote,
  deleteNote,
  deleteImages,
  uploadToStorage,
  postEquipNote
} from "../redux/ActionCreators";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { SimpleLineIcons } from '@expo/vector-icons'; 
// import Amplify, { Auth } from "aws-amplify";
import { Storage, StorageProvider } from 'aws-amplify';
const mapStateToProps = (state) => {
  return {
    // equipments: state.equipments,
    timestamps: state.timestamps,
    // notes: state.notes.notes,
    user:state.user.user,
    projects: state.user.user.assigned_projects_as_technician,
    completed: state.completed,
    selectedImages: state.selectedImages,
  };
};

const mapDispatchToProps = (dispatch) => ({
  postNote: (projId, note) => dispatch(postNote(projId, note)),
  deleteNote: (id) => dispatch(deleteNote(id)),
  postTimestamp: (eId) => dispatch(postTimestamp(eId)),
  updateTimestamp: (eId, duration) => dispatch(updateTimestamp(eId, duration)),
  deleteTimestamps: (eId) => dispatch(deleteTimestamps(eId)),
  postCompleted: (eId) => dispatch(postCompleted(eId)),
  deleteCompleted: (eId) => dispatch(deleteCompleted(eId)),
  deleteImages: (eId, images) => dispatch(deleteImages(eId, images)),
  postEquipNote: (projId,eId, note) => dispatch(postEquipNote(projId,eId, note)),
  uploadToStorage: (preread,postread,eId, images) => dispatch(uploadToStorage(preread,postread,eId, images)),

  // postComment: (dishId, rating, author, comment) =>
  //   dispatch(postComment(dishId, rating, author, comment)),
});

class Requirements extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      preread: 0,
      postread: 0,
      duration: 0,
      note: "",
      toggleInput: false,
      selection: [],
    };
  }
  
  componentDidMount() {
    this.getPermissionAsync();
  }

  getFormattedTime(time) {
    // this.currentTime = time;
  }

  getPermissionAsync = async () => {
    if (Platform.OS !== "web") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  _pickVideo = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        this.setState({ video: result.uri });
      }

      // console.log(result);
    } catch (E) {
      console.log(E);
    }
  };



  handleDelete(eId) {
    this.props.deleteTimestamps(eId);
  }

  resetForm() {
    this.setState({
      preread: 1,
      postread: 1,
      showModal: false,
      image: null,
      video: null,
    });
  }

  markStarted(eId) {
    this.props.postTimestamp(eId);
  }

  markStopped(eId) {
    this.props.updateTimestamp(eId);
  }

  markSelected(uri) {
    let newSelection = [...this.state.selection];
    if (newSelection.includes(uri)) {
     newSelection= newSelection.filter((URI) => URI != uri);
    } else {
      newSelection.push(uri);
    }
    this.setState({ selection: newSelection });
    console.log("this.state.selection");
  }

  render() {
    const project = this.props.projects?.find(
      (item) => item.id === this.props.route.params.id
    );
    
    const { eId } = this.props.route.params;
    const equipment = project.equipments?.find(
      (item) => item.id === eId
    );
    const timestamp = this.props.timestamps.find((item) => item.id === eId);
    const imageSet = this.props.selectedImages?.find((item) => item.id === eId);
    const images = imageSet?.images;
    this.props.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => this.props.uploadToStorage(this.state.preread , this.state.postread , eId , images)}
          style={{
            width: 140,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            borderColor: "#fff",
            borderWidth: 1,
            padding: 5,
            borderRadius: 5,
            marginRight: 20,
          }}
        >
          <Icon
            type="FontAwesome"
            name="check"
            style={{ fontSize: 15, color: "white", marginRight: 7 }}
          />
          <Text
            style={{ color: "#fff", fontWeight: "bold", fontSize: 15, paddingTop:3,paddingBottom:3 }}
          >
            Update
          </Text>
        </TouchableOpacity>
      ),
    })
    var dur = 0;
    return (
      <ScrollView style={{ backgroundColor: "white" }}>
        <TouchableOpacity style={styles.status}>
          <Text style={{ color: "white" }}>In Progress</Text>
        </TouchableOpacity>

        <View style={styles.formRow}>
          <View style={styles.formLabel}>
            <Text style={styles.formLabelText}>Pre-read</Text>
          </View>
          <TextInput
            style={styles.formItem}
            selectedValue={this.state.preread}
            placeholder="0"
            defaultValue=""
            onChangeText={(itemValue) => this.setState({ preread: itemValue })}
          />
        </View>
        <View style={styles.formRow}>
          <View style={styles.formLabel}>
            <Text style={styles.formLabelText}>Post-read</Text>
          </View>
          <TextInput
            selectedValue={this.state.preread}
            style={styles.formItem}
            placeholder="0"
            defaultValue=""
            onChangeText={(itemValue) => this.setState({ postread: itemValue })}
          />
        </View>
        <View style={{}}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              margin: 15,
              borderTopColor: "lightgray",
              borderTopWidth: 1,
              paddingTop: 35,
              paddingBottom: 5,
            }}
          >
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("Images", { eId: eId, type: "photo" })
              }
              style={styles.mediaButton}
            >
              <AntDesign name="picture" size={20} color="black" />
              <Text style={styles.mediaButtonText}>Choose Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
               onPress={() =>
                this.props.navigation.navigate("Images", { eId: eId, type: "video" })
              }
              style={styles.mediaButton}
            >
              <Feather name="video" size={20} color="black" />
              <Text style={styles.mediaButtonText}>Choose Video</Text>
            </TouchableOpacity>
          </View>
          {images?.length > 0 && (
            <View style={{ marginLeft: 20 }}>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  // justifyContent: "space-around",
                  // paddingTop: 35,
                  // marginLeft: 15,
                  // marginRight: 15,
                  // paddingBottom: 5,
                }}
              >
                {images.map((obj) => (
                  <TouchableOpacity
                    onPress={async () => {
                        
                        try {
                          const response = await fetch(obj.uri)
                      
                          const blob = await response.blob()
                      
                          Storage.put(obj.filename, blob, {
                            contentType: 'image/jpeg',
                          }).then (result => console.log(result))

                        } catch (err) {
                          console.log(err)
                        }
                      
                     console.log(obj);
                      this.markSelected(obj);
                    }}
                    style={{
                      // flex:1,
                      margin: 2,
                    }}
                  >
                    {this.state.selection.includes(obj) && (
                      <AntDesign
                        name="checkcircle"
                        size={24}
                        color="black"
                        style={{
                          fontSize: 15,

                          position: "absolute",
                          top: 2,
                          right: 2,
                          zIndex: 2,
                        }}
                      />
                    )}
                    <Image
                      source={{ uri: obj.uri }}
                      style={{ width: 75, height: 75 }}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingTop: 35,
                  paddingBottom: 5,
                  marginRight:20
                }}
              >
                <TouchableOpacity
                  style={[
                    styles.mediaButton,
                    {
                      borderColor: "#DADADA",
                      borderWidth: 1,
                      backgroundColor: "none",
                    },
                  ]}
                  onPress={() =>
                    this.props.navigation.navigate("AddCaptions", { images: this.state.selection, eId:eId })
                  }
                >
                  <Text style={styles.mediaButtonText}>Edit Items</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.mediaButton,
                    {
                      borderColor: "#DADADA",
                      borderWidth: 1,
                      backgroundColor: "none",
                    },
                  ]}
                  onPress={() => {
                    this.props.deleteImages(eId, this.state.selection);
                    this.setState({ selection: [] });
                  }}
                >
                  <Text style={styles.mediaButtonText}>Delete Items</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingTop: 35,
            // paddingBottom: 35,
            borderTopColor: "lightgray",
            borderTopWidth: 1,
            margin: 15,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "#282828" }}>
            Time tracking
          </Text>

          <TouchableOpacity
            style={[
              styles.mediaButton,
              { marginRight: 8, backgroundColor: "black" },
            ]}
            onPress={() =>
              !timestamp?.isStarted
                ? this.markStarted(eId)
                : this.markStopped(eId)
            }
          >
            <Icon
              type="FontAwesome"
              name="clock-o"
              style={{ fontSize: 20, color: "white" }}
            />

            <Text style={[styles.mediaButtonText, { color: "white" }]}>
              {timestamp
                ? !timestamp.isStarted
                  ? "Start Tracking"
                  : "Stop Tracking"
                : "Start Tracking"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.timestampContainer}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={styles.formLabelText}>Start time</Text>

            <View
              style={{
                borderBottomColor: "lightgray",
                borderBottomWidth: 1,
                flex: 1,
                margin: 5,
              }}
            />
            <Text>{timestamp ? timestamp.initial : "Start tracking"}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={[styles.formLabelText, { width: 90, textAlign: "right" }]}
            >
              End time
            </Text>

            {/* alignItems:"flex-end" */}
            <View
              style={{
                borderBottomColor: "lightgray",
                borderBottomWidth: 1,
                flex: 1,
                margin: 5,
              }}
            />
            <Text>{timestamp ? timestamp.stopping : "Start tracking"}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={[styles.formLabelText, { width: 90, fontWeight: "bold" }]}
            >
              Total time
            </Text>

            <View
              style={{
                borderBottomColor: "lightgray",
                borderBottomWidth: 1,
                flex: 1,
                margin: 5,
              }}
            />
            <Text>
              {" "}
              {timestamp
                ? (
                    "0" + Math.floor(timestamp?.duration / (1000 * 60 * 60))
                  ).slice(-2) +
                  ":" +
                  ("0" + Math.floor(timestamp?.duration / (1000 * 60))).slice(
                    -2
                  ) +
                  ":" +
                  ("0" + Math.floor(timestamp?.duration / 1000)).slice(-2)
                : "Start tracking"}
            </Text>
          </View>
        </View>

        {/* <View style={{ margin: 20 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <>
              <Text
                style={{
                  fontWeight: "bold",
                }}
              >
                Notes from BBA
              </Text>
               <Text>{obj.date}</Text> 
            </>
          </View>
          <Text style={{ marginTop: 20, color: "#616161" }}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste nihil
            sunt incidunt laudantium, ad animi consequatur omnis itaque enim
            odit illum asperiores amet atque quidem dicta obcaecati! Culpa ipsam
            corrupti, a iste fugit aut mollitia blanditiis error voluptas
            dolores. Perspiciatis harum itaque aperiam ipsum quisquam
            consectetur laborum veritatis, impedit reprehenderit.
          </Text>
        </View> */}

        

        {this.state.toggleInput && (
          <Form>
            <Textarea
              onChangeText={(note) => this.setState({ note })}
              rowSpan={4}
              value={this.state.note}
              bordered
              placeholder="Add note"
              style={{
                width: 300,
                borderWidth: 2,
                borderColor: "#0074B1",
                alignSelf: "center",
                borderRadius: 5,
                marginBottom: 15,
              }}
            />
            <TouchableOpacity
              onPress={() => {
                this.props.postEquipNote(
                  project.id,
                  eId,
                  this.state.note
                );
                console.log(project.id, eId,this.state.note);
                this.setState({ toggleInput: false });
              }}
              style={{
                alignSelf: "center",
                padding: 8,
                backgroundColor: "black",
                borderRadius: 5,
                flexDirection: "row",
                alignItems: "center",
                width: 180,
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "200", color: "white" }}>
                Submit
              </Text>
            </TouchableOpacity>
          </Form>
        )}
        {!this.state.toggleInput && (
          <TouchableOpacity
            onPress={() => {
              this.setState({ toggleInput: true });
            }}
            style={{
              alignSelf: "center",
              padding: 8,
              backgroundColor: "black",
              borderRadius: 5,
              flexDirection: "row",
              alignItems: "center",
              width: 180,
              justifyContent: "center",
            }}
          >
            <Icon
              type="FontAwesome"
              name="plus-circle"
              style={{ fontSize: 20, color: "white", marginRight: 10 }}
            />
            <Text style={{ fontSize: 20, fontWeight: "200", color: "white" }}>
              Add Note
            </Text>
          </TouchableOpacity>
        )}
        {equipment.notes.map(
          (obj) =>
             (
              <View
                style={{
                  margin: 20,
                  paddingTop: 40,
                  borderTopWidth: 1,
                  borderTopColor: "lightgray",
                }}
                key={obj.id}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        paddingRight: 5,
                        marginRight: 5,
                        fontWeight: "bold",
                        borderRightWidth: 1,
                        borderRightColor: "gray",
                      }}
                    >
                      {obj.created_by.first_name}
                    </Text>
                    <Text style={{ color: "gray" }}>03:15 PM</Text>
                  </View>
                  {this.props.user.id === obj.created_by.id && (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: 85,
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        padding: 9,
                        borderRadius: 24,
                        backgroundColor: "#F4F4F4",
                      }}
                    >
                      <SimpleLineIcons
                        name="pencil"
                        size={18}
                        color="#0074B1"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        padding: 7,
                        borderRadius: 24,
                        backgroundColor: "#F4F4F4",
                      }}
                    >
                      <Feather
                        name="trash-2"
                        size={22}
                        color="#0074B1"
                        onPress={() => {
                          Alert.alert(
                            "Delete Note?",
                            "Are you sure you want to delete this note?",
                            [
                              {
                                text: "Cancel",
                                onPress: () => console.log("Not Deleted"),
                                style: " cancel",
                              },
                              {
                                text: "OK",
                                onPress: () => this.props.deleteNote(obj.id),
                              },
                            ],
                            { cancelable: false }
                          );
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                )}
                </View>
                <Text style={{ marginTop: 20, color: "gray" }}>{obj.note}</Text>
              </View>
            )
        )}

        {/* <Button onPress={() => this.handleDelete(eId)}>
          <Text>Delete</Text>
        </Button> */}
        <TouchableOpacity
          onPress={() => {
            this.props.completed.some((el) => el === eId)
              ? this.props.deleteCompleted(eId)
              : this.props.postCompleted(eId);
          }}
        >
          <View
            style={{
              height: 50,
              backgroundColor: "#0074B1",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 80,
            }}
          >
            <Feather
              name="check-square"
              size={20}
              color="#fff"
              style={{ marginRight: 10 }}
            />
            <Text style={{ color: "white", fontWeight: "400", fontSize: 16 }}>
              {this.props.completed.some((el) => el === eId)
                ? "Mark as not Done?"
                : "Mark as Done"}
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const options = {
  container: {
    backgroundColor: "none",
    padding: 5,
    borderRadius: 5,
    width: 220,
  },
  text: {
    fontSize: 30,
    color: "#000",
    marginLeft: 7,
  },
};

const styles = StyleSheet.create({
  status: {
    backgroundColor: "black",
    padding: 7,
    borderRadius: 2,
    margin: 20,
    width: 100,
  },
  formRow: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
    margin: 15,
    marginRight: 40,
  },
  formLabel: {
    flexDirection: "row",
    flex: 2,
    marginRight: 20,
    fontWeight: "100",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  formLabelText: {
    fontSize: 20,
    fontWeight: "100",
  },

  formItem: {
    flex: 2,
    padding: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "lightgray",
    width: 100,
    alignSelf: "flex-start",
  },
  modal: {
    justifyContent: "center",
    margin: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "purple",
    marginBottom: 20,
  },
  modalText: {
    fontSize: 18,
    margin: 10,
  },
  // button: {
  //   marginTop: 20,
  //   width: 200,
  //   borderRadius: 10,
  //   backgroundColor: "purple",
  //   justifyContent: "center",
  //   alignSelf: "center",
  // },
  buttonText: {
    color: "#fff",
  },
  mediaButton: {
    padding: 10,
    flexDirection: "row",
    backgroundColor: "#F4F4F4",
    borderRadius: 5,
    justifyContent: "space-around",
    width: 150,
  },
  mediaButtonText: {
    fontSize: 15,
  },
  timestampContainer: {
    margin: 20,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Requirements);
