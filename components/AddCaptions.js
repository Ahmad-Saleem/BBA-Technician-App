import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { connect } from "react-redux";
import { Icon, Textarea } from "native-base";
import { postCaption, deleteImages } from "../redux/ActionCreators";

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
                <Textarea
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
                />
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
