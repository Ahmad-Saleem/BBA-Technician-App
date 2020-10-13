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
} from "react-native";
import { connect } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { Button, Icon } from "native-base";
import { Video } from "expo-av";
import {
  postTimestamp,
  postCompleted,
  deleteCompleted,
  updateTimestamp,
  deleteTimestamps,
  postNote,
  deleteNote,
} from "../redux/ActionCreators";
import { Stopwatch } from "react-native-stopwatch-timer";

const mapStateToProps = (state) => {
  return {
    equipments: state.equipments,
    timestamps: state.timestamps,
    notes: state.notes.notes,
    projects: state.projects.projects,
    completed: state.completed,
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
  // postComment: (dishId, rating, author, comment) =>
  //   dispatch(postComment(dishId, rating, author, comment)),
});

class Requirements extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      preread: 1,
      postread: 1,
      image: null,
      video: null,
      stopwatchStart: false,
      totalDuration: 90000,
      stopwatchReset: false,
      duration: 0,
      note: "",
    };
    this.resetStopwatch = this.resetStopwatch.bind(this);
  }

  componentDidMount() {
    this.getPermissionAsync();
  }

  resetStopwatch() {
    this.setState({ stopwatchStart: false, stopwatchReset: true });
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

  _pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        this.setState({ image: result.uri });
      }

      // console.log(result);
    } catch (E) {
      console.log(E);
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

  static navigationOptions = {
    title: "Requirements",
  };

  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  handleReservation() {
    // console.log(JSON.stringify(this.state));
    this.toggleModal();
  }

  handleDelete(eId) {
    this.props.deleteTimestamps(eId);
  }

  msToTime(s) {
    // Pad to 2 or 3 digits, default is 2
    function pad(n, z) {
      z = z || 2;
      return ("00" + n).slice(-z);
    }

    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;

    return pad(hrs) + ":" + pad(mins);
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
    // this.setState({
    //   stopwatchStart: !this.state.stopwatchStart,
    // });
    this.props.postTimestamp(eId);
  }

  markStopped(eId) {
    this.props.updateTimestamp(eId);
    // this.setState({ stopwatchStart: !this.state.stopwatchStart });
  }

  render() {
    const project = this.props.projects.find(
      (item) => item.id === this.props.route.params.id
    );
    let { image } = this.state;
    let { video } = this.state;
    const { eId } = this.props.route.params;
    const timestamp = this.props.timestamps.find((item) => item.id === eId);
    var dur = 0;
    return (
      <ScrollView style={{ backgroundColor: "white" }}>
        <TouchableOpacity style={styles.status}>
          <Text style={{color:"white"}}>In Progress</Text>
        </TouchableOpacity>

        <View style={styles.formRow}>
          <View style={styles.formLabel}>
            <Text style={styles.formLabelText}>Pre-read</Text>
          </View>
          <TextInput
            style={styles.formItem}
            selectedValue={this.state.preread}
            placeholder=""
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
            placeholder=""
            defaultValue=""
            onChangeText={(itemValue) => this.setState({ postread: itemValue })}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            paddingTop: 35,
            paddingBottom: 35,
            borderTopColor: "lightgray",
            borderTopWidth: 1,
            borderBottomColor: "lightgray",
            borderBottomWidth: 1,
            margin: 15,
          }}
        >
          <TouchableOpacity
            onPress={this._pickImage}
            style={styles.mediaButton}
          >
            <Icon
              type="FontAwesome"
              name="picture-o"
              style={{ fontSize: 20, color: "gray" }}
            />
            <Text style={styles.mediaButtonText}>Choose Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={this._pickVideo}
            style={styles.mediaButton}
          >
            <Icon
              type="FontAwesome"
              name="picture-o"
              style={{ fontSize: 20, color: "gray" }}
            />
            <Text style={styles.mediaButtonText}>Choose Video</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            // paddingTop: 35,
            // paddingBottom: 35,
            margin: 15,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "#282828" }}>
            Time tracking
          </Text>

          <TouchableOpacity
            style={[styles.mediaButton, { marginRight: 8,    backgroundColor: "black", }]}
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

            <Text style={[styles.mediaButtonText,{color:"white"}]}>
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
            <Text style={[styles.formLabelText, { width: 90 }]}>
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

        <View style={{ margin: 20 }}>
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
                  padding: 5,
                  fontWeight: "bold",
                }}
              >
                Notes from BBA
              </Text>
              {/* <Text>{obj.date}</Text> */}
            </>
            <Icon
              type="FontAwesome"
              name="check"
              style={{ fontSize: 20, color: "gray", marginRight: 10 }}
            />
          </View>
          <Text style={{ marginTop: 20 }}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste nihil
            sunt incidunt laudantium, ad animi consequatur omnis itaque enim
            odit illum asperiores amet atque quidem dicta obcaecati! Culpa ipsam
            corrupti, a iste fugit aut mollitia blanditiis error voluptas
            dolores. Perspiciatis harum itaque aperiam ipsum quisquam
            consectetur laborum veritatis, impedit reprehenderit.
          </Text>
        </View>

        {this.props.notes?.map(
          (obj) =>
            obj.projId === project.id && (
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
                      {obj.author}
                    </Text>
                    <Text style={{ color: "gray" }}>03:15 PM</Text>
                  </View>
                  <TouchableOpacity>
                    <Icon
                      type="FontAwesome"
                      name="trash"
                      style={{ fontSize: 20, color: "#0074B1", marginRight: 10 }}
                      onPress={() => {
                        this.props.deleteNote(obj.id);
                      }}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={{ marginTop: 20, color: "gray" }}>{obj.note}</Text>
              </View>
            )
        )}

        <TextInput
          onChangeText={(note) => this.setState({ note: note })}
          style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
          value={this.state.note}
          placeholder="Textarea"
        />
        <TouchableOpacity
          onPress={() => {
            Alert.prompt(
              "Enter here",
              "Enter your note",
              [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                {
                  text: "OK",
                  onPress: () =>
                    this.props.postNote(
                      this.props.route.params.id,
                      this.state.note
                    ),
                },
              ],
              "secure-text"
            );
          }}
          style={{
            alignSelf: "center",
                padding: 8,
                backgroundColor: "black",
                borderRadius: 3,
                flexDirection: "row",
                alignItems: "center",
                width:180,
                justifyContent:"center"
          }}
        >
          <Icon
            type="FontAwesome"
            name="plus-circle"
            style={{ fontSize: 20, color: "white", marginRight: 10 }}
          />
          <Text style={{ fontSize: 20, fontWeight: "200", color: "white" }}>
            Add note
          </Text>
        </TouchableOpacity>

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
            }}
          >
            <Icon
              type="FontAwesome"
              name="check"
              style={{ fontSize: 20, color: "#fff", marginRight: 10 }}
            />
            <Text style={{color:"white"}}>
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
    margin: 20,
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
    borderRadius: 4,
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
  button: {
    marginTop: 20,
    width: 200,
    borderRadius: 10,
    backgroundColor: "purple",
    justifyContent: "center",
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
  },
  mediaButton: {
    padding: 10,
    flexDirection: "row",
    backgroundColor: "lightgray",
    borderRadius: 5,
    justifyContent: "space-around",
    width: 150,
  },
  mediaButtonText: {
    fontWeight: "bold",
    fontSize: 15,
  },
  timestampContainer: {
    margin: 20,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Requirements);
