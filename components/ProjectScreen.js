import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  Alert,
  Linking,
  Platform,
  RefreshControl,
  Dimensions,
  TextInput,
} from "react-native";
import { BaseRouter } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { connect } from "react-redux";
import { Form, Textarea, Icon } from "native-base";
import {
  postNote,
  deleteNote,
  postRequest,
  fetchUser,
  postLocalProjectNote,
  deleteProjectNote,
} from "../redux/ActionCreators";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Auth } from "aws-amplify";
import NetInfo from "@react-native-community/netinfo";

const mapStateToProps = (state) => {
  return {
    // equipments: state.equipments,
    // notes: state.notes.notes,
    user: state.user.user,
    projects: state.user.user.assigned_projects_as_technician,
    completed: state.completed,
    timestamps: state.timestamps,
    selectedImages: state.selectedImages,
    localProjectNotes: state.localProjectNotes,
  };
};

const mapDispatchToProps = (dispatch) => ({
  postNote: (projId, note, author) => dispatch(postNote(projId, note, author)),
  postRequest: (projId, note) => dispatch(postRequest(projId, note)),
  deleteNote: (id) => dispatch(deleteNote(id)),
  fetchUser: () => dispatch(fetchUser()),
  postLocalProjectNote: (projId, note, author) =>
    dispatch(postLocalProjectNote(projId, note, author)),
  deleteProjectNote: (id) => dispatch(deleteProjectNote(id)),
});

const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

let width = Dimensions.get("window").width;

class ProjectScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      project: this.props.user.assigned_projects_as_technician?.find(
        (item) => item.id === this.props.route.params.id
      ),
      notes: this.props.projects?.find(
        (item) => item.id === this.props.route.params.id
      ).notes,
      note: "",
      toggleInput: false,
      toggleChange: false,
      toggleEdit: false,
      refreshing: false,
      editId: undefined,
    };
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if (this.state.project != prevState.project) {
  //     this.setState({
  //       project: this.props.user.assigned_projects_as_technician?.find(
  //         (item) => item.id === this.props.route.params.id
  //       ),
  //     });
  //   }
  // }

  componentDidMount() {
    NetInfo.fetch().then(async (state) => {
      const localProjectNotes = this.props.localProjectNotes.filter(
        (obj) => obj.projId === this.props.route.params.id
      );
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
      if (state.isConnected) {
        for (let i = 0; i < localProjectNotes.length; i++) {
          var data = await this.props.postNote(
            this.props.route.params.id,
            localProjectNotes[i].note
            // this.props.user.user.first_name
          );
          console.log(data.id);
          let newNotes = [...this.state.notes];
          console.log(newNotes);
          newNotes.push({
            created_at: data.created_at,
            created_by: {
              first_name: data.created_by.first_name,
              id: data.created_by.id,
              last_name: data.created_by.last_name,
            },
            id: data.id,
            labels: [],
            message: localProjectNotes[i].note,
            project: { id: this.props.route.params.id },
          });
          this.setState({
            toggleInput: false,
            note: "",
            notes: newNotes,
          });
          this.props.deleteProjectNote(localProjectNotes[i].id);
        }
      }
    });
  }

  // handleConnectivityChange = async (connection) => {
  //   console.log(connection);
  //   if (connection.isConnected) {
  //     console.log('pass here');
  //     for (let i = 0; i < localProjectNotes.length; i++) {
  //       var data = await this.props.postNote(
  //         this.props.route.params.id,
  //         localProjectNotes[i].note
  //         // this.props.user.user.first_name
  //       );
  //       console.log(data.id);
  //       let newNotes = [...this.state.notes];
  //       console.log(newNotes);
  //       newNotes.push({
  //         created_at: data.created_at,
  //         created_by: {
  //           first_name: data.created_by.first_name,
  //           id: data.created_by.id,
  //           last_name: data.created_by.last_name,
  //         },
  //         id: data.id,
  //         labels: [],
  //         message: localProjectNotes[i].note,
  //         project: { id: this.props.route.params.id },
  //       });
  //       this.setState({
  //         toggleInput: false,
  //         note: "",
  //         notes: newNotes,
  //       });
  //       this.props.deleteProjectNote(localProjectNotes[i].id);
  //     }

  //   }
  // };

  // componentWillUnmount() {
  //   if (this.netinfoUnsubscribe) {
  //     this.netinfoUnsubscribe();
  //     this.netinfoUnsubscribe;
  //   }
  // }

  render() {
    const onRefresh = () => {
      this.setState({ refreshing: true });

      wait(2000).then(() => this.setState({ refreshing: false }));
    };
    const { project, notes } = this.state;
    // const project = this.props.projects?.find(
    //   (item) => item.id === this.props.route.params.id
    // );
    // const equipments = this.props.equipments.equipments.filter(
    //   (item) => item.projId === project.id
    // );

    const equipments = project?.equipments;
    const completed = equipments?.map(
      (obj) => this.props.completed?.includes(obj.id) && obj.id
    );
    const localProjectNotes = this.props.localProjectNotes.filter(
      (obj) => obj.projId === this.props.route.params.id
    );
    // NetInfo.addEventListener(async ({isConnected}) => {
    //     // console.log("Connection type", state.type);
    //     console.log("Is connected?", isConnected);
    //     if (isConnected) {
    //       for (let i = 0; i < localProjectNotes.length; i++) {
    //         var data = await this.props.postNote(
    //           this.props.route.params.id,
    //           localProjectNotes[i].note
    //           // this.props.user.user.first_name
    //         );
    //         console.log(data.id);
    //         let newNotes = [...this.state.notes];
    //         console.log(newNotes);
    //         newNotes.push({
    //           created_at: data.created_at,
    //           created_by: {
    //             first_name: data.created_by.first_name,
    //             id: data.created_by.id,
    //             last_name: data.created_by.last_name,
    //           },
    //           id: data.id,
    //           labels: [],
    //           message: localProjectNotes[i].note,
    //           project: { id: this.props.route.params.id },
    //         });
    //         this.setState({
    //           toggleInput: false,
    //           note: "",
    //           notes: newNotes,
    //         });
    //         this.props.deleteProjectNote(localProjectNotes[i].id);
    //       }

    //     }
    //   });

    _renderItem = (item) => (
      <TouchableOpacity
        key={item.id}
        style={{
          borderWidth: 1,
          margin: 8,
          borderTopColor: "lightgray",
          borderBottomColor: "lightgray",
          borderRightColor: "lightgray",
          borderLeftWidth: 7,
          borderLeftColor: "black",
          borderRadius: 4,
          padding: 15,
        }}
        onPress={() =>
          this.props.navigation.navigate("Requirements", {
            eId: item.id,
            id: this.props.route.params.id,
          })
        }
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: width / 22, fontWeight: "400" }}>
            Equipment {" " + item.id}
          </Text>
          {this.props.completed?.includes(item.id) ? (
            <View
              style={[
                styles.mediaButton,
                { padding: 10, fontSize: width / 24, width: 100 },
              ]}
            >
              <Icon
                type="FontAwesome"
                name="clock-o"
                style={{
                  fontSize: width / 24,
                  color: "#0074B1",
                  marginRight: 4,
                }}
              />
              <Text style={[styles.mediaButtonText, { color: "#0074B1" }]}>
                {this.props.timestamps.find((obj) => obj.id === item.id)
                  ? (
                      "0" +
                      Math.floor(
                        this.props.timestamps.find((obj) => obj.id === item.id)
                          ?.duration /
                          (1000 * 60 * 60)
                      )
                    ).slice(-2) +
                    ":" +
                    (
                      "0" +
                      Math.floor(
                        this.props.timestamps.find((obj) => obj.id === item.id)
                          ?.duration /
                          (1000 * 60)
                      )
                    ).slice(-2) +
                    ":" +
                    (
                      "0" +
                      Math.floor(
                        this.props.timestamps.find((obj) => obj.id === item.id)
                          ?.duration / 1000
                      )
                    ).slice(-2)
                  : ""}
              </Text>
            </View>
          ) : (
            <View
              style={[
                styles.mediaButton,
                {
                  padding: 10,
                  fontSize: width / 24,
                  backgroundColor: "#f4f4f4",
                },
              ]}
            >
              <Icon
                type="FontAwesome"
                name="clock-o"
                style={{ fontSize: width / 24, marginRight: 4 }}
              />
              <Text style={styles.mediaButtonText}>Track time</Text>
            </View>
          )}
        </View>
        {this.props.completed?.includes(item.id) && (
          <View style={{ flexDirection: "row", marginTop: 5 }}>
            <Icon
              type="FontAwesome"
              name="calendar"
              style={{ fontSize: width / 18, color: "black", marginRight: 10 }}
            />

            <Text style={{ color: "black" }}>
              {
                this.props.timestamps.find((obj) => obj.id === item.id)
                  ?.finalDateString
              }
            </Text>
          </View>
        )}
        {/* <View style={{ flexDirection: "row", alignItems: "baseline",marginTop:15 }}>
          <Text style={{ width: 100 }}>CFM:{item.value}</Text>
          <Text>Building: {item.building}</Text>
        </View> */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 15,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <View style={{ flexDirection: "row", width: 70, marginTop: 5 }}>
              <Entypo
                name="attachment"
                size={width / 18}
                color="black"
                style={{ marginRight: 10 }}
              />
              <Text style={{ fontSize: width / 24 }}>
                {
                  this.props.selectedImages?.find((obj) => obj.id === item.id)
                    ?.images.length
                }
              </Text>
            </View>
            <View style={{ flexDirection: "row", marginTop: 5 }}>
              <AntDesign
                name="message1"
                size={width / 18}
                color="black"
                style={{ marginRight: 10 }}
              />
              <Text style={{ fontSize: width / 24 }}>
                {item.notes.length} notes
              </Text>
            </View>
          </View>

          {this.props.completed?.includes(item.id) && (
            <View
              style={[
                styles.mediaButton,
                {
                  backgroundColor: "#000",
                  alignSelf: "flex-end",
                  padding: 10,
                  fontSize: width / 24,
                  width: 100,
                },
              ]}
            >
              <Icon
                type="FontAwesome"
                name="check"
                style={{
                  fontSize: width / 18,
                  color: "white",
                  marginRight: 10,
                }}
              />

              <Text style={{ color: "white" }}>Done</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
    handleLink = (address, city, state) => {
      let daddr = encodeURIComponent(`${address} ${city}, ${state}`);

      if (Platform.OS === "ios") {
        Linking.openURL(`http://maps.apple.com/?daddr=${daddr}`);
      } else {
        Linking.openURL(`http://maps.google.com/?daddr=${daddr}`);
      }
    };

    return (
      <ScrollView
        style={{
          backgroundColor: "#fff",
        }}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <View
          style={[
            styles.pcontact,
            { flexDirection: "row", justifyContent: "space-between" },
          ]}
        >
          <View>
            <Text style={{ fontSize: width / 24, color: "#616161" }}>
              Primary Contact
            </Text>
            <Text
              style={{
                fontSize: width / 15,
                fontWeight: "bold",
                color: "#282828",
              }}
            >
              Jim Brewin
            </Text>
            <Text style={{ fontSize: width / 24, color: "#2C3E50" }}>
              Director of Institute
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: 70,
            }}
          >
            <TouchableOpacity onPress={() => Linking.openURL(`sms:8094050767`)}>
              <MaterialCommunityIcons
                name="tooltip-text-outline"
                size={width / 12}
                color="#0074B1"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL(`tel:8094050767`)}>
              <Feather name="phone-call" size={26} color="#0074B1" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.headcontainer}>
          <View style={styles.address}>
            <Text
              style={{
                fontSize: width / 15,
                fontWeight: "bold",
                marginBottom: 6,
              }}
            >
              {project?.project_name}
            </Text>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={() =>
                handleLink(
                  project?.location.address,
                  project?.location.city,
                  project?.location.state
                )
              }
            >
              <Feather
                name="map-pin"
                size={width / 20}
                color="#2C3E50"
                style={{ marginRight: 9 }}
              />
              <Text style={{ color: "#2C3E50" }}>
                {project?.location.location_name +
                  " " +
                  project?.location.address}
              </Text>
            </TouchableOpacity>
            <View
              style={{
                padding: 5,
                marginTop: 7,
                flexDirection: "row",
                borderLeftColor: "#000",
                borderLeftWidth: 2,
                alignItems: "center",
              }}
            >
              <Feather
                name="check-square"
                size={width / 18}
                color="#000"
                style={{ marginRight: 6 }}
              />
              <Text style={{ fontWeight: "bold", fontSize: width / 24 }}>
                AHU {" " + equipments?.length}
              </Text>
            </View>
          </View>
        </View>

        <View>
          <View
            style={{
              margin: 20,
              marginTop: 28,

              paddingBottom: 17,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: width / 20,
              }}
            >
              Notes from BBA
            </Text>

            <Text style={{ marginTop: 20, color: "#616161", fontSize: 15 }}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste
              nihil sunt incidunt laudantium, ad animi consequatur omnis itaque
              enim odit illum asperiores amet atque quidem dicta obcaecati!
              Culpa ipsam corrupti, a iste fugit aut mollitia blanditiis error
              voluptas dolores. Perspiciatis harum itaque aperiam ipsum quisquam
              consectetur laborum veritatis, impedit reprehenderit.
            </Text>
          </View>
          {this.state.toggleChange && (
            <Form style={{ marginBottom: 10 }}>
              <TextInput
                onChangeText={(note) => this.setState({ note })}
                // multiline
                // numberOfLines={4}
                // rowSpan={4}
                value={this.state.note}
                // bordered
                placeholder="Add request"
                style={{
                  width: 300,
                  borderWidth: 2,
                  borderColor: "#0074B1",
                  alignSelf: "center",
                  borderRadius: 4,
                  marginBottom: 15,
                  paddingLeft: 25,
                  paddingTop: 15,
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.props.postRequest(
                      this.props.route.params.id,
                      this.state.note
                    );
                    this.setState({ toggleChange: false, note: "" });
                  }}
                  style={{
                    alignSelf: "center",
                    padding: 8,
                    backgroundColor: "black",
                    borderRadius: 5,
                    flexDirection: "row",
                    alignItems: "center",
                    width: 100,
                    justifyContent: "center",
                    marginRight: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: width / 18,
                      fontWeight: "200",
                      color: "white",
                    }}
                  >
                    Submit
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ toggleChange: false, note: "" });
                  }}
                  style={{
                    padding: 8,
                    backgroundColor: "gray",
                    borderRadius: 5,
                    flexDirection: "row",
                    alignItems: "center",
                    width: 100,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: width / 18,
                      fontWeight: "200",
                      color: "white",
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </Form>
          )}

          {this.state.toggleEdit && (
            <Form style={{ marginBottom: 10 }}>
              <TextInput
                onChangeText={(note) => this.setState({ note })}
                // multiline
                // numberOfLines={4}
                // rowSpan={4}
                value={this.state.note}
                // bordered
                placeholder="Add note"
                style={{
                  width: 300,
                  borderWidth: 2,
                  borderColor: "#0074B1",
                  alignSelf: "center",
                  borderRadius: 4,
                  marginBottom: 15,
                  paddingLeft: 25,
                  paddingTop: 15,
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  onPress={async () => {
                    NetInfo.fetch().then(async (state) => {
                      console.log("Connection type", state.type);
                      console.log("Is connected?", state.isConnected);
                      if (state.isConnected) {
                        var data = await this.props.postNote(
                          this.props.route.params.id,
                          this.state.note
                          // this.props.user.user.first_name
                        );
                        console.log(data.id);
                        let newNotes = [...this.state.notes];
                        console.log(newNotes);
                        newNotes.push({
                          created_at: data.created_at,
                          created_by: {
                            first_name: data.created_by.first_name,
                            id: data.created_by.id,
                            last_name: data.created_by.last_name,
                          },
                          id: data.id,
                          labels: [],
                          message: this.state.note,
                          project: { id: this.props.route.params.id },
                        });
                        this.setState({
                          toggleEdit: false,
                          note: "",
                          notes: newNotes,
                        });
                        this.props.deleteNote(this.state.editId);
                        this.setState({
                          notes: this.state.notes.filter(
                            (e) => e.id != this.state.editId
                          ),
                          editId: undefined,
                        });
                      } else {
                        this.props.postLocalProjectNote(
                          this.props.route.params.id,
                          this.state.note,
                          this.props.user.first_name
                        );
                        this.setState({
                          toggleEdit: false,
                          note: "",
                        });
                      }
                    });
                  }}
                  style={{
                    alignSelf: "center",
                    padding: 8,
                    backgroundColor: "black",
                    borderRadius: 5,
                    flexDirection: "row",
                    alignItems: "center",
                    width: 100,
                    justifyContent: "center",
                    marginRight: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: width / 18,
                      fontWeight: "200",
                      color: "white",
                    }}
                  >
                    Submit
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      toggleEdit: false,
                      note: "",
                      editId: undefined,
                    });
                  }}
                  style={{
                    padding: 8,
                    backgroundColor: "gray",
                    borderRadius: 5,
                    flexDirection: "row",
                    alignItems: "center",
                    width: 100,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: width / 18,
                      fontWeight: "200",
                      color: "white",
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </Form>
          )}

          {this.state.toggleInput && (
            <Form style={{ marginBottom: 10 }}>
              <TextInput
                onChangeText={(note) => this.setState({ note })}
                // multiline
                // numberOfLines={4}
                // rowSpan={4}
                value={this.state.note}
                // bordered
                placeholder="Add note"
                style={{
                  width: 300,
                  borderWidth: 2,
                  borderColor: "#0074B1",
                  alignSelf: "center",
                  borderRadius: 4,
                  marginBottom: 15,
                  paddingLeft: 25,
                  paddingTop: 15,
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  onPress={async () => {
                    NetInfo.fetch().then(async (state) => {
                      console.log("Connection type", state.type);
                      console.log("Is connected?", state.isConnected);
                      if (state.isConnected) {
                        var data = await this.props.postNote(
                          this.props.route.params.id,
                          this.state.note
                          // this.props.user.user.first_name
                        );
                        console.log(data.id);
                        let newNotes = [...this.state.notes];
                        console.log(newNotes);
                        newNotes.push({
                          created_at: data.created_at,
                          created_by: {
                            first_name: data.created_by.first_name,
                            id: data.created_by.id,
                            last_name: data.created_by.last_name,
                          },
                          id: data.id,
                          labels: [],
                          message: this.state.note,
                          project: { id: this.props.route.params.id },
                        });
                        console.log(this.state.note);
                        this.setState({
                          toggleInput: false,
                          note: "",
                          notes: newNotes,
                        });
                      } else {
                        this.props.postLocalProjectNote(
                          this.props.route.params.id,
                          this.state.note,
                          this.props.user.first_name
                        );
                        this.setState({
                          toggleInput: false,
                          note: "",
                        });
                      }
                    });
                  }}
                  style={{
                    alignSelf: "center",
                    padding: 8,
                    backgroundColor: "black",
                    borderRadius: 5,
                    flexDirection: "row",
                    alignItems: "center",
                    width: 100,
                    justifyContent: "center",
                    marginRight: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: width / 18,
                      fontWeight: "200",
                      color: "white",
                    }}
                  >
                    Submit
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ toggleInput: false, note: "" });
                  }}
                  style={{
                    padding: 8,
                    backgroundColor: "gray",
                    borderRadius: 5,
                    flexDirection: "row",
                    alignItems: "center",
                    width: 100,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: width / 18,
                      fontWeight: "200",
                      color: "white",
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </Form>
          )}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginLeft: 20,
              marginRight: 20,
            }}
          >
            {!this.state.toggleInput &&
              !this.state.toggleChange &&
              !this.state.toggleEdit && (
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
                    width: 130,
                    justifyContent: "center",
                    marginBottom: 5,
                    // marginTop: 30,
                  }}
                >
                  <Icon
                    type="FontAwesome"
                    name="plus-circle"
                    style={{
                      fontSize: width / 24,
                      color: "white",
                      marginRight: 10,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: width / 24,
                      // fontWeight: "200",
                      color: "white",
                    }}
                  >
                    Add Note
                  </Text>
                </TouchableOpacity>
              )}
            {!this.state.toggleInput &&
              !this.state.toggleChange &&
              !this.state.toggleEdit && (
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ toggleChange: true });
                  }}
                  style={{
                    alignSelf: "center",
                    padding: 8,
                    backgroundColor: "black",
                    borderRadius: 5,
                    flexDirection: "row",
                    alignItems: "center",
                    width: 170,
                    justifyContent: "center",
                    marginBottom: 5,
                    // marginTop: 30,
                  }}
                >
                  {/* <Icon
                  type="FontAwesome"
                  name="plus-circle"
                  style={{ fontSize: 15, color: "white", marginRight: 10 }}
                /> */}
                  <Feather
                    name="clipboard"
                    size={width / 24}
                    color="white"
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={{
                      fontSize: width / 24,
                      fontWeight: "200",
                      color: "white",
                    }}
                  >
                    Change Request
                  </Text>
                </TouchableOpacity>
              )}
          </View>
          {notes.map(
            (obj) =>
              obj.labels != "CHANGE_REQUEST" && (
                <View
                  style={{
                    margin: 20,
                    paddingTop: 20,
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
                      <Text style={{ color: "gray" }}>
                        {new Date(obj.created_at).getHours() > 12
                          ? (
                              "0" +
                              (new Date(obj.created_at).getHours() - 12)
                            ).slice(-2)
                          : ("0" + new Date(obj.created_at).getHours()).slice(
                              -2
                            )}
                        :{("0"+new Date(obj.created_at).getMinutes()).slice(-2)}{" "}
                        {new Date(obj.created_at).getHours() > 12 ? "PM" : "AM"}
                      </Text>
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
                          onPress={() => {
                            this.setState({
                              editId: obj.id,
                              toggleEdit: true,
                            });
                          }}
                        >
                          <SimpleLineIcons
                            name="pencil"
                            size={width / 20}
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
                            size={width / 16}
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
                                    onPress: () => {
                                      this.props.deleteNote(obj.id);
                                      this.setState({
                                        notes: this.state.notes.filter(
                                          (e) => e.id != obj.id
                                        ),
                                      });
                                    },
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
                  <Text style={{ marginTop: 20, color: "gray" }}>
                    {obj.message}
                  </Text>
                </View>
              )
          )}

          {localProjectNotes.map((obj) => (
            <View
              style={{
                margin: 20,
                paddingTop: 20,
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
                  <Text style={{ color: "gray" }}>(will be uploaded)</Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: 85,
                  }}
                >
                  {/* <TouchableOpacity
                    style={{
                      padding: 9,
                      borderRadius: 24,
                      backgroundColor: "#F4F4F4",
                    }}
                    onPress={() => {
                      this.setState({
                        project: this.props.user.assigned_projects_as_technician?.find(
                          (item) => item.id === this.props.route.params.id
                        ),
                      });
                      console.log(
                        this.props.user.assigned_projects_as_technician[0].notes
                      );
                    }}
                  >
                    <SimpleLineIcons
                      name="pencil"
                      size={width / 20}
                      color="#0074B1"
                    />
                  </TouchableOpacity> */}
                  <TouchableOpacity
                    style={{
                      padding: 7,
                      borderRadius: 24,
                      backgroundColor: "#F4F4F4",
                    }}
                  >
                    <Feather
                      name="trash-2"
                      size={width / 16}
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
                              onPress: () => {
                                this.props.deleteProjectNote(obj.id);
                              },
                            },
                          ],
                          { cancelable: false }
                        );
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={{ marginTop: 20, color: "gray" }}>{obj.note}</Text>
            </View>
          ))}
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            margin: 20,
          }}
        >
          <Text style={{ fontSize: width / 15, fontWeight: "200" }}>
            Equipments
          </Text>

          <View
            style={{
              backgroundColor: "#f4f4f4",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 10,
              borderRadius: 5,
            }}
          >
            <MaterialCommunityIcons
              name="check-all"
              size={width / 18}
              color="#0074B1"
              style={{ marginRight: 10 }}
            />
            <Text>
              {
                equipments?.filter((e) => this.props.completed?.includes(e.id))
                  .length
              }
              /{equipments?.length}
            </Text>
          </View>
        </View>

        {equipments?.map((item) => _renderItem(item))}

        <View
          style={{
            height: 50,
            backgroundColor: "#0074B1",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Feather
            name="check-square"
            size={width / 18}
            color="#fff"
            style={{ marginRight: 10 }}
          />
          <Text style={{ color: "white", fontWeight: "400", fontSize: 16 }}>
            {completed?.length == equipments?.length &&
            !completed?.includes(false)
              ? "Project Complete"
              : "Complete Project"}
          </Text>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headcontainer: {
    justifyContent: "center",
    fontFamily: "sans-serif",
  },
  address: {
    marginLeft: 20,
  },
  pcontact: {
    paddingBottom: 30,
    margin: 20,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
    alignItems: "center",
  },
  mediaButton: {
    padding: 10,
    flexDirection: "row",

    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    // width: 90,
  },
  mediaButtonText: {
    fontWeight: "normal",
    fontSize: width / 24,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ProjectScreen);
