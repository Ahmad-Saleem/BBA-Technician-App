import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions
} from "react-native";
import { connect } from "react-redux";
import { Icon, Textarea, Picker } from "native-base";
import { postCaption, deleteImages } from "../redux/ActionCreators";
let width = Dimensions.get("window").width;

const mapStateToProps = (state) => {
  return {
    selectedImages: state.selectedImages,
  };
};

const mapDispatchToProps = (dispatch) => ({
  postCaption: (eId, caption, id) => dispatch(postCaption(eId, caption, id)),
  deleteImages: (eId, images) => dispatch(deleteImages(eId, images)),
});

class AddCaptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showInput: false,
      caption: "",
      imgId:0
    };
  }

  toggleInput(id) {
    this.setState({
      showInput: !this.state.showInput,
      imgId:id
    });
  }
  render() {
    this.props.navigation.setOptions({
      headerBackTitleVisible: false,
      headerRight: () => (
        <TouchableOpacity
          // onPress={async () => {
          //   await this.props.postDataRead(
          //     eId,
          //     this.state.preread,
          //     this.state.postread
          //   );
          //   NetInfo.fetch().then((state) => {
          //     if (state.isConnected) {
          //       this.props.uploadToStorage(
          //         this.state.preread,
          //         this.state.postread,
          //         eId,
          //         images,
          //         project.id
          //       );
          //     }
          //   });
          //   // console.log(this.state.preread, this.state.postread);
          // }}
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
    const imageSet = this.props.selectedImages?.find((item) => item.id === this.props.route.params.eId,);
    const images = imageSet?.images;
    return (
      <ScrollView style={{ backgroundColor: "#fff" }}>
        {images.map((obj, i) => (
          <View
            key={i}
            style={{ margin: 10, alignSelf: "center", marginBottom: 30 }}
          >
            <Image
              source={{ uri: obj.uri }}
              style={{ width: 330, height: 260 }}
            />
            {obj.caption != "" && <Text>{obj.caption}</Text>}
            {this.state.showInput && this.state.imgId === obj.id && (
              <View>
                {/* <Textarea
                  onChangeText={(caption) => this.setState({ caption })}
                  rowSpan={4}
                  //   value={this.state.note}
                  bordered
                  placeholder="Add caption"
                  style={{
                    width: 330,
                    borderWidth: 2,
                    borderColor: "#DADADA",
                    alignSelf: "center",
                    borderRadius: 5,
                    marginTop: 25,
                    paddingLeft: 25,
                    paddingTop: 15,
                  }}
                /> */}
                <View>
                 <Picker
                  mode="dropdown"
                  iosHeader="Select Captions"
                  iosIcon={<Icon name="arrow-down" />}
                  selectedValue={this.state.caption}
                  // renderHeader={<Text>Choose category</Text>}
                  onValueChange={(value) =>
                    this.setState({ caption:value })
                  }
                >
                  <Picker.Item label="UNIT BEFORE CLEANING" value="UNIT BEFORE CLEANING" />
                  <Picker.Item label="DURING TREATMENT" value="DURING TREATMENT" />
                  <Picker.Item label="PRE-READ" value="PRE-READ" />
                  <Picker.Item label="POST-READ" value="POST-READ" />
                  <Picker.Item label="BREAKTHROUGH" value="BREAKTHROUGH" />
                  <Picker.Item label="BIOFOULING" value="BIOFOULING" />
                  <Picker.Item label="HYDROCARBON FOULING" value="HYDROCARBON FOULING" />
                  <Picker.Item label="FRONT OF COILS - BEFORE" value="FRONT OF COILS - BEFORE" />
                  <Picker.Item label="FRONT OF COILS - AFTER" value="FRONT OF COILS - AFTER" />
                  <Picker.Item label="BACKSIDE COILS - BEFORE" value="BACKSIDE COILS - BEFORE" />
                  <Picker.Item label="BACKSIDE COILS - AFTER" value="BACKSIDE COILS - AFTER" />
                  <Picker.Item label="DAMAGE" value="DAMAGE" />
                  <Picker.Item label="OTHER" value="OTHER" />
                </Picker>
               </View>
                <TouchableOpacity
                  style={{
                    padding: 8,
                    backgroundColor: "black",
                    borderRadius: 5,
                    flexDirection: "row",
                    // alignItems: "center",
                    alignSelf: "center",
                    width: 100,
                    marginTop: 10,
                    justifyContent: "center",
                  }}
                  onPress={() => {
                    this.toggleInput();
                    this.props.postCaption(
                      this.props.route.params.eId,
                      this.state.caption,
                      obj.id
                    );
                  }}
                >
                  <Text
                    style={{ fontSize: 17, fontWeight: "200", color: "white" }}
                  >
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {(!this.state.showInput || this.state.imgId != obj.id) && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingTop: 25,
                  paddingBottom: 5,
                }}
              >
                <TouchableOpacity
                  style={{
                    padding: 8,
                    backgroundColor: "black",
                    borderRadius: 5,
                    flexDirection: "row",
                    alignItems: "center",
                    width: 150,
                    justifyContent: "center",
                  }}
                  onPress={() => this.toggleInput(obj.id)}
                >
                  <Icon
                    type="FontAwesome"
                    name="plus-circle"
                    style={{ fontSize: 17, color: "white", marginRight: 10 }}
                  />
                  <Text
                    style={{ fontSize: 17, fontWeight: "200", color: "white" }}
                  >
                    Add Caption
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    padding: 8,
                    borderRadius: 5,
                    flexDirection: "row",
                    alignItems: "center",
                    width: 150,
                    justifyContent: "center",
                    borderWidth: 2,
                    borderColor: "#DADADA",
                  }}
                  onPress={()=>this.props.deleteImages(this.props.route.params.eId,[obj,])}
                >
                  <Text
                    style={{ fontSize: 17, fontWeight: "200", color: "black" }}
                  >
                    Delete Item
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
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
});



export default connect(mapStateToProps, mapDispatchToProps)(AddCaptions);
