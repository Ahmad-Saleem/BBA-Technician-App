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
  Dimensions,
  ImageBackground,
} from "react-native";
import { connect } from "react-redux";
import * as Permissions from "expo-permissions";
import { Icon, Form, Textarea, Picker } from "native-base";
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
  postEquipNote,
  postLocalEquipNote,
  deleteEquipNote,
  postDataRead,
  postImages,
} from "../redux/ActionCreators";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
// import Amplify, { Auth } from "aws-amplify";
import { Storage, StorageProvider } from "aws-amplify";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import NetInfo from "@react-native-community/netinfo";
import { Camera } from "expo-camera";

const mapStateToProps = (state) => {
  return {
    timestamps: state.timestamps,
    user: state.user.user,
    projects: state.user.user.assigned_projects_as_technician,
    completed: state.completed,
    selectedImages: state.selectedImages,
    localEquipNotes: state.localEquipNotes,
    dataReads: state.dataReads,
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
  postEquipNote: (projId, eId, note, note_category) =>
    dispatch(postEquipNote(projId, eId, note, note_category)),
  uploadToStorage: (preread, postread, eId, images, pId) =>
    dispatch(uploadToStorage(preread, postread, eId, images, pId)),
  postLocalEquipNote: (projId, eId, author, note) =>
    dispatch(postLocalEquipNote(projId, eId, author, note)),
  deleteEquipNote: (id) => dispatch(deleteEquipNote(id)),
  postDataRead: (id, prereads, postreads) =>
    dispatch(postDataRead(id, prereads, postreads)),
  // postComment: (dishId, rating, author, comment) =>
  //   dispatch(postComment(dishId, rating, author, comment)),
  postImages: (eId, images) => dispatch(postImages(eId, images)),
});

let width = Dimensions.get("window").width;
const CameraPreview = ({ photo }) => {
  console.log("sdsfds", photo);
  return (
    <View
      style={{
        backgroundColor: "transparent",
        flex: 1,
        width: "100%",
        height: "100%",
      }}
    >
      <ImageBackground
        source={{ uri: photo && photo.uri }}
        style={{
          flex: 1,
        }}
      />
    </View>
  );
};
class Requirements extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      preread: {
        date: this.props.dataReads?.find(
          (item) => item.id === this.props.route.params.eId
        )?.prereads?.date,
        time: this.props.dataReads?.find(
          (item) => item.id === this.props.route.params.eId
        )?.prereads?.time,
        coil_differential_pressure_with_filter: this.props.dataReads?.find(
          (item) => item.id === this.props.route.params.eId
        )?.prereads?.coil_differential_pressure_with_filter,
        coil_differential_pressure_without_filter: this.props.dataReads?.find(
          (item) => item.id === this.props.route.params.eId
        )?.prereads?.coil_differential_pressure_without_filter,
        fan_speed: this.props.dataReads?.find(
          (item) => item.id === this.props.route.params.eId
        )?.prereads?.fan_speed,
        outside_air_temperature: this.props.dataReads?.find(
          (item) => item.id === this.props.route.params.eId
        )?.prereads?.outside_air_temperature,
        outside_air_damper_position: this.props.dataReads?.find(
          (item) => item.id === this.props.route.params.eId
        )?.prereads?.outside_air_damper_position,
        air_temp_reading: this.props.dataReads?.find(
          (item) => item.id === this.props.route.params.eId
        )?.prereads?.air_temp_reading,
        coil_Infrared_image_coil: this.props.dataReads?.find(
          (item) => item.id === this.props.route.params.eId
        )?.prereads?.coil_Infrared_image_coil,
        // is_terminal: this.props.dataReads?.find(
        //   (item) => item.id === this.props.route.params.eId
        // )?.prereads?.is_terminal,
        is_terminal: true,
        velocity: this.props.dataReads?.find(
          (item) => item.id === this.props.route.params.eId
        )?.prereads?.velocity,
        supply_air_temperature: this.props.dataReads?.find(
          (item) => item.id === this.props.route.params.eId
        )?.prereads?.supply_air_temperature,
      },
      postread: {
        date: this.props.dataReads?.find(
          (item) => item.id === this.props.route.params.eId
        )?.postreads?.date,
        time: this.props.dataReads?.find(
          (item) => item.id === this.props.route.params.eId
        )?.postreads?.time,
        coil_differential_pressure_with_filter: this.props.dataReads?.find(
          (item) => item.id === this.props.route.params.eId
        )?.postreads?.coil_differential_pressure_with_filter,
        coil_differential_pressure_without_filter: this.props.dataReads?.find(
          (item) => item.id === this.props.route.params.eId
        )?.postreads?.coil_differential_pressure_without_filter,
        fan_speed: this.props.dataReads?.find(
          (item) => item.id === this.props.route.params.eId
        )?.postreads?.fan_speed,
        outside_air_temperature: this.props.dataReads?.find(
          (item) => item.id === this.props.route.params.eId
        )?.postreads?.outside_air_temperature,
        outside_air_damper_position: this.props.dataReads?.find(
          (item) => item.id === this.props.route.params.eId
        )?.postreads?.outside_air_damper_position,
        air_temp_reading: this.props.dataReads?.find(
          (item) => item.id === this.props.route.params.eId
        )?.postreads?.air_temp_reading,
        coil_Infrared_image_coil: this.props.dataReads?.find(
          (item) => item.id === this.props.route.params.eId
        )?.postreads?.coil_Infrared_image_coil,
        // is_terminal: this.props.dataReads?.find(
        //   (item) => item.id === this.props.route.params.eId
        // )?.postreads?.is_terminal,
        is_terminal: true,
        velocity: this.props.dataReads?.find(
          (item) => item.id === this.props.route.params.eId
        )?.postreads?.velocity,
        supply_air_temperature: this.props.dataReads?.find(
          (item) => item.id === this.props.route.params.eId
        )?.postreads?.supply_air_temperature,
      },
      duration: 0,
      note: "",
      note_category: "",
      notes: this.props.projects
        ?.find((item) => item.id === this.props.route.params.id)
        .equipments.find((item) => item.id === this.props.route.params.eId)
        .notes,
      toggleInput: false,
      selection: [],
      showPreDate: false,
      showPreTime: false,
      showPostDate: false,
      showPostTime: false,
      // equipment:project?.equipments?.find((item) => item.id === eId),
      user: this.props.user,
      editId: undefined,
      toggleEdit: false,
      editNote: "",
      startCamera: false,
      previewVisible: false,
      capturedImage: null,
    };
  }

  componentDidMount() {
    this.getPermissionAsync();
    NetInfo.fetch().then(async (state) => {
      const localEquipNotes = this.props.localEquipNotes.filter(
        (obj) => obj.eId === this.props.route.params.eId
      );
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
      console.log(this.props.user.first_name);
      if (state.isConnected) {
        for (let i = 0; i < localEquipNotes.length; i++) {
          var data = await this.props.postEquipNote(
            this.props.route.params.id,
            this.props.route.params.eId,
            localEquipNotes[i].note
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
            message: localEquipNotes[i].note,
            project: { id: this.props.route.params.id },
            equipment: { id: this.props.route.params.id },
          });
          this.setState({
            toggleInput: false,
            note: "",
            notes: newNotes,
          });
          this.props.deleteEquipNote(localEquipNotes[i].id);
        }
      }
    });
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

  handleDelete(eId) {
    this.props.deleteTimestamps(eId);
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
      newSelection = newSelection.filter((URI) => URI != uri);
    } else {
      newSelection.push(uri);
    }
    this.setState({ selection: newSelection });
    console.log("this.state.selection");
  }

  render() {
    const project = this.state.user.assigned_projects_as_technician?.find(
      (item) => item.id === this.props.route.params.id
    );
    const onChangePreDate = (selectedDate) => {
      const currentDate = selectedDate || this.state.preread.date;
      this.setState({ showPreDate: false });
      this.setState({
        preread: {
          ...this.state.preread,
          date: currentDate.toLocaleString(),
        },
      });
      console.log(this.state.preread.date);
    };
    const onChangePostDate = (selectedDate) => {
      const currentDate = selectedDate || this.state.postread.date;
      this.setState({ showPostDate: false });
      this.setState({
        postread: {
          ...this.state.postread,
          date: currentDate.toLocaleString(),
        },
      });
      console.log(this.state.postread.date);
    };

    const showModePreDate = () => {
      this.setState({ showPreDate: true });
      this.setState({ mode: "date" });
    };

    const showModePostDate = () => {
      this.setState({ showPostDate: true });
      this.setState({ mode: "date" });
    };

    const __startCamera = async () => {
      console.log("camera");
      const { status } = await Camera.requestPermissionsAsync();
      if (status === "granted") {
        // start the camera
        this.setState({ startCamera: true });
      } else {
        Alert.alert("Access denied");
      }
    };

    const __takePicture = async () => {
      if (!this.camera) return;
      const photo = await this.camera.takePictureAsync();
      
      console.log(photo);
      this.setState({ previewVisible: true });
      this.setState({ capturedImage: photo });
      await this.props.postImages(this.props.route.params.eId, [
        photo,
      ]);
      setTimeout(() => {
        this.props.navigation.navigate("AddCaptions", {
          eId: this.props.route.params.eId,
        });
      }, 2000);
      
    };

    const { eId } = this.props.route.params;
    const equipment = project?.equipments?.find((item) => item.id === eId);
    const localEquipNotes = this.props.localEquipNotes.filter(
      (obj) => obj.eId === eId
    );
    // const dataread = this.props.dataReads?.find((item) => item.id === eId);
    // const prereads = dataread?.prereads;
    // const postreads = dataread?.postreads;
    const timestamp = this.props.timestamps.find((item) => item.id === eId);
    const imageSet = this.props.selectedImages?.find((item) => item.id === eId);
    const images = imageSet?.images;
    this.props.navigation.setOptions({
      headerBackTitleVisible: false,
      headerTitle: equipment.system_name,
      headerRight: () => (
        <TouchableOpacity
          onPress={async () => {
            await this.props.postDataRead(
              eId,
              this.state.preread,
              this.state.postread
            );
            NetInfo.fetch().then((state) => {
              if (state.isConnected) {
                // const upload = async () => {
                this.props.uploadToStorage(
                  this.state.preread,
                  this.state.postread,
                  eId,
                  images,
                  project.id
                );
                // };
                //  upload();
                Alert.alert(
                  "Success",
                  "Data uploaded successfully!",
                  [
                    {
                      text: "ok",
                      // onPress: () => console.log("Not Deleted"),
                      style: " cancel",
                    },
                  ],
                  { cancelable: false }
                );
              }
            });
            // console.log(this.state.preread, this.state.postread);
          }}
          style={{
            width: width / 3,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            borderColor: "#fff",
            borderWidth: 1,
            // padding: 5,
            borderRadius: 5,
            marginRight: 20,
          }}
        >
          <Icon
            type="FontAwesome"
            name="check"
            style={{ fontSize: width / 20, color: "white", marginRight: 7 }}
          />
          <Text
            style={{
              color: "#fff",
              fontWeight: "bold",
              fontSize: width / 20,
              paddingTop: 5,
              paddingBottom: 5,
            }}
          >
            Update
          </Text>
        </TouchableOpacity>
      ),
    });
    var dur = 0;
    return this.state.startCamera ? (
      this.state.previewVisible && this.state.capturedImage ? (
        <CameraPreview photo={this.state.capturedImage} />
      ) : (
        <Camera
          style={{ flex: 1, width: "100%" }}
          ref={(r) => {
            this.camera = r;
          }}
        >
          <View
            style={{
              position: "absolute",
              bottom: 0,
              flexDirection: "row",
              flex: 1,
              width: "100%",
              padding: 20,
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                alignSelf: "center",
                flex: 1,
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={__takePicture}
                style={{
                  width: 70,
                  height: 70,
                  bottom: 0,
                  borderRadius: 50,
                  backgroundColor: "#fff",
                }}
              />
            </View>
          </View>
        </Camera>
      )
    ) : (
      <ScrollView style={{ backgroundColor: "white" }}>
        <TouchableOpacity style={styles.status}>
          <Text style={{ color: "white" }}>In Progress</Text>
        </TouchableOpacity>
        <View style={styles.formRow}>
          <View style={styles.formLabel}>
            <Text style={{ textAlign: "right" }}>Equipment name:</Text>
          </View>
          <Text style={[styles.formItem, { borderWidth: 0 }]}>
            {equipment.system_name}
          </Text>
        </View>
        <View style={styles.formRow}>
          <View style={styles.formLabel}>
            <Text style={{ textAlign: "right" }}>Location:</Text>
          </View>
          <Text style={[styles.formItem, { borderWidth: 0 }]}>
            {equipment.location.location_name}
          </Text>
        </View>
        <View style={styles.formRow}>
          <View style={styles.formLabel}>
            <Text style={{ textAlign: "right" }}>CFM/Tonnage:</Text>
          </View>
          <Text style={[styles.formItem, { borderWidth: 0 }]}>
            {equipment.cfm}
          </Text>
        </View>
        <View style={styles.formRow}>
          <View style={styles.formLabel}>
            <Text style={{ textAlign: "right" }}>Type of equipment:</Text>
          </View>
          <Text style={[styles.formItem, { borderWidth: 0 }]}>Coming soon</Text>
        </View>
        <TouchableOpacity
                  // onPress={() => {
                  //   this.setState({ toggleChange: true });
                  // }}
                  style={{
                    alignSelf: "center",
                    padding: 8,
                    backgroundColor: "black",
                    borderRadius: 5,
                    flexDirection: "row",
                    alignItems: "center",
                    width: 170,
                    justifyContent: "center",
                    marginBottom: 50,
                    // marginTop: 30,
                  }}
                >
                  
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
        
        <TouchableOpacity style={{ marginLeft: 15 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Pre-reads</Text>
        </TouchableOpacity>
        <View style={styles.formRow}>
          <View style={styles.formLabel}>
            <Text style={{ textAlign: "right" }}>Date and Time</Text>
          </View>
          <TextInput
            style={styles.formItem}
            selectedValue={this.state.preread.date}
            placeholder={this.state.preread.date}
            defaultValue={this.state.preread.date}
            // onPress={showDatepicker}
            onTouchStart={showModePreDate}
          />
        </View>

        {this.state.showPreDate && (
          <DateTimePickerModal
            isVisible={this.state.showPreDate}
            mode="datetime"
            onConfirm={onChangePreDate}
            onCancel={() => this.setState({ showPreDate: false })}
          />
        )}

        {this.state.showPostDate && (
          <DateTimePickerModal
            isVisible={this.state.showPostDate}
            mode="datetime"
            onConfirm={onChangePostDate}
            onCancel={() => this.setState({ showPostDate: false })}
          />
        )}

        <View style={styles.formRow}>
          <View style={styles.formLabel}>
            <Text style={{ textAlign: "right" }}>
              Coil differential pressure with filter
            </Text>
          </View>
          <TextInput
            selectedValue={
              this.state.preread?.coil_differential_pressure_with_filter
            }
            style={styles.formItem}
            placeholder={
              this.state.preread?.coil_differential_pressure_with_filter
            }
            defaultValue={
              this.state.preread?.coil_differential_pressure_with_filter
            }
            onChangeText={(itemValue) =>
              this.setState({
                preread: {
                  ...this.state.preread,
                  coil_differential_pressure_with_filter: itemValue,
                },
              })
            }
          />
        </View>
        <View style={styles.formRow}>
          <View style={styles.formLabel}>
            <Text style={{ textAlign: "right" }}>
              Coil differential pressure without filter
            </Text>
          </View>
          <TextInput
            selectedValue={
              this.state.preread?.coil_differential_pressure_without_filter
            }
            style={styles.formItem}
            placeholder={
              this.state.preread?.coil_differential_pressure_without_filter
            }
            defaultValue={
              this.state.preread?.coil_differential_pressure_without_filter
            }
            onChangeText={(itemValue) =>
              this.setState({
                preread: {
                  ...this.state.preread,
                  coil_differential_pressure_without_filter: itemValue,
                },
              })
            }
          />
        </View>
        <View style={styles.formRow}>
          <View style={styles.formLabel}>
            <Text style={{ textAlign: "right" }}>Fan speed</Text>
          </View>
          <TextInput
            selectedValue={this.state.preread?.fan_speed}
            style={styles.formItem}
            placeholder={this.state.preread?.fan_speed}
            defaultValue={this.state.preread?.fan_speed}
            onChangeText={(itemValue) =>
              this.setState({
                preread: { ...this.state.preread, fan_speed: itemValue },
              })
            }
          />
        </View>
        <View style={styles.formRow}>
          <View style={styles.formLabel}>
            <Text style={{ textAlign: "right" }}>Outside air temperature</Text>
          </View>
          <TextInput
            selectedValue={this.state.preread?.outside_air_temperature}
            style={styles.formItem}
            placeholder={this.state.preread?.outside_air_temperature}
            defaultValue={this.state.preread?.outside_air_temperature}
            onChangeText={(itemValue) =>
              this.setState({
                preread: {
                  ...this.state.preread,
                  outside_air_temperature: itemValue,
                },
              })
            }
          />
        </View>
        <View style={styles.formRow}>
          <View style={styles.formLabel}>
            <Text style={{ textAlign: "right" }}>
              Outside air damper position
            </Text>
          </View>
          <TextInput
            selectedValue={this.state.preread?.outside_air_damper_position}
            style={styles.formItem}
            placeholder={this.state.preread?.outside_air_damper_position}
            defaultValue={this.state.preread?.outside_air_damper_position}
            onChangeText={(itemValue) =>
              this.setState({
                preread: {
                  ...this.state.preread,
                  outside_air_damper_position: itemValue,
                },
              })
            }
          />
        </View>
        <View style={styles.formRow}>
          <View style={styles.formLabel}>
            <Text style={{ textAlign: "right" }}>Air temp reading</Text>
          </View>
          <TextInput
            selectedValue={this.state.preread?.air_temp_reading}
            style={styles.formItem}
            placeholder={this.state.preread?.air_temp_reading}
            defaultValue={this.state.preread?.air_temp_reading}
            onChangeText={(itemValue) =>
              this.setState({
                preread: { ...this.state.preread, air_temp_reading: itemValue },
              })
            }
          />
        </View>
        <View style={styles.formRow}>
          <View style={styles.formLabel}>
            <Text style={{ textAlign: "right" }}>Coil Infrared image coil</Text>
          </View>
          <TextInput
            selectedValue={this.state.preread?.coil_Infrared_image_coil}
            style={styles.formItem}
            placeholder={this.state.preread?.coil_Infrared_image_coil}
            defaultValue={this.state.preread?.coil_Infrared_image_coil}
            onChangeText={(itemValue) =>
              this.setState({
                preread: {
                  ...this.state.preread,
                  coil_Infrared_image_coil: itemValue,
                },
              })
            }
          />
        </View>
        <View style={styles.formRow}>
          <View style={styles.formLabel}>
            <Text style={{ textAlign: "right" }}>Velocity</Text>
          </View>
          <TextInput
            selectedValue={this.state.preread?.velocity}
            style={styles.formItem}
            placeholder={this.state.preread?.velocity}
            defaultValue={this.state.preread?.velocity}
            onChangeText={(itemValue) =>
              this.setState({
                preread: { ...this.state.preread, velocity: itemValue },
              })
            }
          />
        </View>
        <View style={styles.formRow}>
          <View style={styles.formLabel}>
            <Text style={{ textAlign: "right" }}>Supply air temperature</Text>
          </View>
          <TextInput
            selectedValue={this.state.preread?.supply_air_temperature}
            style={styles.formItem}
            placeholder={this.state.preread?.supply_air_temperature}
            defaultValue={this.state.preread?.supply_air_temperature}
            onChangeText={(itemValue) =>
              this.setState({
                preread: {
                  ...this.state.preread,
                  supply_air_temperature: itemValue,
                },
              })
            }
          />
        </View>
        {/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/}

        <TouchableOpacity style={{ marginLeft: 15 }}>
          <Text style={{ fontSize: width / 18, fontWeight: "bold" }}>
            Post-reads
          </Text>
        </TouchableOpacity>
        <View style={styles.formRow}>
          <View style={styles.formLabel}>
            <Text style={{ textAlign: "right" }}>Date and Time</Text>
          </View>
          <TextInput
            style={styles.formItem}
            selectedValue={this.state.postread?.date}
            placeholder={this.state.postread?.date}
            defaultValue={this.state.postread?.date}
            onTouchStart={showModePostDate}
          />
        </View>
        <View style={styles.formRow}>
          <View style={styles.formLabel}>
            <Text style={{ textAlign: "right" }}>
              Coil differential pressure with filter
            </Text>
          </View>
          <TextInput
            selectedValue={
              this.state.postread?.coil_differential_pressure_with_filter
            }
            style={styles.formItem}
            placeholder={
              this.state.postread?.coil_differential_pressure_with_filter
            }
            defaultValue={
              this.state.postread?.coil_differential_pressure_with_filter
            }
            onChangeText={(itemValue) =>
              this.setState({
                postread: {
                  ...this.state.postread,
                  coil_differential_pressure_with_filter: itemValue,
                },
              })
            }
          />
        </View>
        <View style={styles.formRow}>
          <View style={styles.formLabel}>
            <Text style={{ textAlign: "right" }}>
              Coil differential pressure without filter
            </Text>
          </View>
          <TextInput
            selectedValue={
              this.state.postread?.coil_differential_pressure_without_filter
            }
            style={styles.formItem}
            placeholder={
              this.state.postread?.coil_differential_pressure_without_filter
            }
            defaultValue={
              this.state.postread?.coil_differential_pressure_without_filter
            }
            onChangeText={(itemValue) =>
              this.setState({
                postread: {
                  ...this.state.postread,
                  coil_differential_pressure_without_filter: itemValue,
                },
              })
            }
          />
        </View>
        <View style={styles.formRow}>
          <View style={styles.formLabel}>
            <Text style={{ textAlign: "right" }}>Fan speed</Text>
          </View>
          <TextInput
            selectedValue={this.state.postread?.fan_speed}
            style={styles.formItem}
            placeholder={this.state.postread?.fan_speed}
            defaultValue={this.state.postread?.fan_speed}
            onChangeText={(itemValue) =>
              this.setState({
                postread: { ...this.state.postread, fan_speed: itemValue },
              })
            }
          />
        </View>
        <View style={styles.formRow}>
          <View style={styles.formLabel}>
            <Text style={{ textAlign: "right" }}>Outside air temperature</Text>
          </View>
          <TextInput
            selectedValue={this.state.postread?.outside_air_temperature}
            style={styles.formItem}
            placeholder={this.state.postread?.outside_air_temperature}
            defaultValue={this.state.postread?.outside_air_temperature}
            onChangeText={(itemValue) =>
              this.setState({
                postread: {
                  ...this.state.postread,
                  outside_air_temperature: itemValue,
                },
              })
            }
          />
        </View>
        <View style={styles.formRow}>
          <View style={styles.formLabel}>
            <Text style={{ textAlign: "right" }}>
              Outside air damper position
            </Text>
          </View>
          <TextInput
            selectedValue={this.state.postread?.outside_air_damper_position}
            style={styles.formItem}
            placeholder={this.state.postread?.outside_air_damper_position}
            defaultValue={this.state.postread?.outside_air_damper_position}
            onChangeText={(itemValue) =>
              this.setState({
                postread: {
                  ...this.state.postread,
                  outside_air_damper_position: itemValue,
                },
              })
            }
          />
        </View>
        <View style={styles.formRow}>
          <View style={styles.formLabel}>
            <Text style={{ textAlign: "right" }}>Air temp reading</Text>
          </View>
          <TextInput
            selectedValue={this.state.postread?.air_temp_reading}
            style={styles.formItem}
            placeholder={this.state.postread?.air_temp_reading}
            defaultValue={this.state.postread?.air_temp_reading}
            onChangeText={(itemValue) =>
              this.setState({
                postread: {
                  ...this.state.postread,
                  air_temp_reading: itemValue,
                },
              })
            }
          />
        </View>
        <View style={styles.formRow}>
          <View style={styles.formLabel}>
            <Text style={{ textAlign: "right" }}>Coil Infrared image coil</Text>
          </View>
          <TextInput
            selectedValue={this.state.postread?.coil_Infrared_image_coil}
            style={styles.formItem}
            placeholder={this.state.postread?.coil_Infrared_image_coil}
            defaultValue={this.state.postread?.coil_Infrared_image_coil}
            onChangeText={(itemValue) =>
              this.setState({
                postread: {
                  ...this.state.postread,
                  coil_Infrared_image_coil: itemValue,
                },
              })
            }
          />
        </View>
        <View style={styles.formRow}>
          <View style={styles.formLabel}>
            <Text style={{ textAlign: "right" }}>Velocity</Text>
          </View>
          <TextInput
            selectedValue={this.state.postread?.velocity}
            style={styles.formItem}
            placeholder={this.state.postread?.velocity}
            defaultValue={this.state.postread?.velocity}
            onChangeText={(itemValue) =>
              this.setState({
                postread: { ...this.state.postread, velocity: itemValue },
              })
            }
          />
        </View>
        <View style={styles.formRow}>
          <View style={styles.formLabel}>
            <Text style={{ textAlign: "right" }}>Supply air temperature</Text>
          </View>
          <TextInput
            selectedValue={this.state.postread?.supply_air_temperature}
            style={styles.formItem}
            placeholder={this.state.postread?.supply_air_temperature}
            defaultValue={this.state.postread?.supply_air_temperature}
            onChangeText={(itemValue) =>
              this.setState({
                postread: {
                  ...this.state.postread,
                  supply_air_temperature: itemValue,
                },
              })
            }
          />
        </View>

        {/* -------------------Camera view starts here----------------------- */}

        {/* -------------------Camera view ends here----------------------- */}
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
              // onPress={() =>
              //   this.props.navigation.navigate("Images", {
              //     eId: eId,
              //     type: "photo",
              //   })
              // }
              onPress={() => {
                Alert.alert(
                  "Choose",
                  "Take photo or choose from gallery?",
                  [
                    {
                      text: "Camera",
                      onPress: __startCamera,
                      style: "cancel",
                    },
                    {
                      text: "gallery",
                      onPress: () =>
                        this.props.navigation.navigate("Images", {
                          eId: eId,
                          type: "photo",
                        }),
                    },
                  ],
                  { cancelable: false }
                );
              }}
              style={[styles.mediaButton]}
            >
              <AntDesign
                name="picture"
                style={{ marginRight: 15 }}
                size={width / 18}
                color="black"
              />
              <Text style={styles.mediaButtonText}>Choose Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("Images", {
                  eId: eId,
                  type: "video",
                })
              }
              style={styles.mediaButton}
            >
              <Feather
                name="video"
                style={{ marginRight: 15 }}
                size={width / 18}
                color="black"
              />
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
                        const response = await fetch(obj.uri);

                        const blob = await response.blob();

                        Storage.put(obj.filename, blob, {
                          contentType: "image/jpeg",
                        }).then((result) => console.log(result));
                      } catch (err) {
                        console.log(err);
                      }
                      console.log(this.props.user.first_name);
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
                          fontSize: width / 24,

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
                  marginRight: 20,
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
                    this.props.navigation.navigate("AddCaptions", {
                      eId: eId,
                    })
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
          <Text
            style={{
              fontSize: width / 18,
              fontWeight: "bold",
              color: "#282828",
            }}
          >
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
              style={{ fontSize: width / 22, color: "white", marginRight: 15 }}
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
            <Text style={[styles.formLabelText, { alignSelf: "flex-start" }]}>
              Start time
            </Text>

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
            <Text style={styles.formLabelText}>End time</Text>

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
            <Text style={styles.formLabelText}>Total time</Text>

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
        {this.state.toggleEdit && (
          <Form>
            <TextInput
              onChangeText={(note) => this.setState({ note })}
              // rowSpan={4}
              // defaultValue={this.state.editNote}
              value={this.state.note}
              // initial={this.state.editNote}
              bordered
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
            <TouchableOpacity
              onPress={async () => {
                NetInfo.fetch().then(async (state) => {
                  console.log("Connection type", state.type);
                  console.log("Is connected?", state.isConnected);
                  if (state.isConnected) {
                    var data = await this.props.postEquipNote(
                      project?.id,
                      eId,
                      this.state.note
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
                      equipment: { id: this.props.route.params.eId },
                    });
                    this.setState({
                      toggleEdit: false,
                      note: "",
                      notes: newNotes,
                    });
                    this.props.deleteNote(this.state.editId);
                    this.setState({
                      editId: undefined,
                    });
                  } else {
                    console.log(this.props.user.first_name);
                    this.props.postLocalEquipNote(
                      this.props.route.params.id,
                      eId,
                      this.props.user.first_name,
                      this.state.note
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

        {this.state.toggleInput && (
          <Form>
            <TextInput
              onChangeText={(note) => this.setState({ note })}
              // rowSpan={4}
              value={this.state.note}
              bordered
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
                  width: 300,
                  alignSelf: "center",
                  borderWidth: 2,
                  borderColor: "#0074B1",
                  borderRadius: 4,
                  marginBottom: 15,
                }}
              >
                <Picker
                  mode="dropdown"
                  iosHeader="Select note category"
                  iosIcon={<Icon name="arrow-down" />}
                  selectedValue={this.state.note_category}
                  renderHeader={<Text>Choose category</Text>}
                  onValueChange={(value) =>
                    this.setState({ note_category: value })
                  }
                >
                  <Picker.Item label="type1" value="type1" />
                  <Picker.Item label="type2" value="type2" />
                  <Picker.Item label="type3" value="type3" />
                  <Picker.Item label="type4" value="type4" />
                  <Picker.Item label="type5" value="type5" />
                </Picker>
              </View>
            <TouchableOpacity
            disabled={
              !this.state.note_category.length > 0 ||
              !this.state.note.length > 0
            }
              onPress={async () => {
                NetInfo.fetch().then(async (state) => {
                  console.log("Connection type", state.type);
                  console.log("Is connected?", state.isConnected);
                  if (state.isConnected) {
                    var data = await this.props.postEquipNote(
                      project?.id,
                      eId,
                      this.state.note,
                      this.state.note_category
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
                      category: data.noteType,
                      id: data.id,
                      labels: [],
                      message: this.state.note,
                      project: { id: this.props.route.params.id },
                      equipment: { id: this.props.route.params.eId },
                    });
                    this.setState({
                      toggleInput: false,
                      note: "",
                      notes: newNotes,
                    });
                  } else {
                    console.log(this.props.user.first_name);
                    this.props.postLocalEquipNote(
                      this.props.route.params.id,
                      eId,
                      this.props.user.first_name,
                      this.state.note
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
        {!this.state.toggleInput && !this.state.toggleEdit && (
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
              style={{ fontSize: width / 18, color: "white", marginRight: 10 }}
            />
            <Text
              style={{
                fontSize: width / 18,
                // fontWeight: "200",
                color: "white",
              }}
            >
              Add Note
            </Text>
          </TouchableOpacity>
        )}
        {this.state.notes.map(
          (obj) =>
            obj.labels != "CHANGE_REQUEST" && (
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
                    <Text style={{ color: "gray" }}>
                      {" "}
                      {new Date(obj.created_at).getHours() > 12
                        ? (
                            "0" +
                            (new Date(obj.created_at).getHours() - 12)
                          ).slice(-2)
                        : ("0" + new Date(obj.created_at).getHours()).slice(-2)}
                      :{("0" + new Date(obj.created_at).getMinutes()).slice(-2)}{" "}
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
                            notes: this.state.notes.filter(
                              (e) => e.id != obj.id
                            ),
                            note: obj.message,
                          });
                          // this.props.deleteNote(obj.id);
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
                          size={width / 17}
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

        {localEquipNotes.map((obj) => (
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
                  justifyContent: "flex-end",
                  width: 85,
                }}
              >
                {/* <TouchableOpacity
                  style={{
                    padding: 9,
                    borderRadius: 24,
                    backgroundColor: "#F4F4F4",
                  }}
                  // onPress={() => {
                  //   this.setState({
                  //     project: this.props.user.assigned_projects_as_technician?.find(
                  //       (item) => item.id === this.props.route.params.id
                  //     ),
                  //   });
                  //   console.log(
                  //     this.props.user.assigned_projects_as_technician[0].notes
                  //   );
                  // }}
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
                              this.props.deleteEquipNote(obj.id);
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

        {/* <Button onPress={() => this.handleDelete(eId)}>
          <Text>Delete</Text>
        </Button> */}
        <TouchableOpacity
          onPress={() => {
            timestamp?.isStarted
              ? Alert.alert("Stop tracking first!")
              : this.props.completed?.some((el) => el === eId)
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
              size={width / 18}
              color="#fff"
              style={{ marginRight: 10 }}
            />
            <Text
              style={{
                color: "white",
                fontWeight: "400",
                fontSize: width / 23,
              }}
            >
              {this.props.completed?.some((el) => el === eId)
                ? "Mark as not Done?"
                : "Mark as Done"}
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

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
    justifyContent: "flex-end",
  },
  formLabelText: {
    textAlign: "right",
    fontSize: width / 20,
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
    fontSize: width / 15,
    fontWeight: "bold",
    textAlign: "center",
    color: "purple",
    marginBottom: 20,
  },
  modalText: {
    fontSize: width / 20,
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
    alignItems: "center",
    width: 150,
  },
  mediaButtonText: {
    fontSize: width / 24,
  },
  timestampContainer: {
    margin: 20,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Requirements);
