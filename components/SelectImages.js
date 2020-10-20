import React, { Component } from "react";
import { Text, View } from "react-native";
import { AssetsSelector } from "expo-images-picker";
import { Ionicons } from "@expo/vector-icons";
import { connect } from "react-redux";
import { postImages } from "../redux/ActionCreators";

const mapStateToProps = (state) => {
  return {
    images: state.selectedImages,
  };
};

const mapDispatchToProps = (dispatch) => ({
  postImages: (eId, images) => dispatch(postImages(eId, images)),
 
});

class SelectImages extends Component {
  render() {
    const goBack = () => {
      this.props.navigation.goBack();
    };
    const onDone = (Asset) => {
      // this.props.navigation.navigate('Home',{Asset})
      this.props.postImages(this.props.route.params.eId, Asset);
      console.log(Asset);
      this.props.navigation.goBack();
    };
    return (
      <AssetsSelector
        options={{
          assetsType: ["photo","video"],
          noAssetsText: "No media found.",
          maxSelections: 5,
          margin: 3,
          portraitCols: 4,
          landscapeCols: 5,
          widgetWidth: 100,
          widgetBgColor: "white",
          selectedBgColor: "red",
          videoIcon: {
            Component: Ionicons,
            iconName: "ios-videocam",
            color: "white",
            size: 20,
          },
          selectedIcon: {
            Component: Ionicons,
            iconName: "ios-checkmark-circle-outline",
            color: "white",
            bg: "#830dff50",
            size: 26,
          },
          defaultTopNavigator: {
            continueText: "Finish",
            goBackText: "Back",
            buttonBgColor: "black",
            buttonTextColor: "white",
            midTextColor: "black",
            backFunction: () => goBack(),
            doneFunction: (Asset) => onDone(Asset),
          },
          noAssets: {
            Component: () => (
              <View>
                <Text>Hey</Text>
              </View>
            ),
          },
        }}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectImages);
