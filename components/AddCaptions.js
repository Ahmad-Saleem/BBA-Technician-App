import React, { Component } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { connect } from "react-redux";
import { Icon, Textarea } from "native-base";

class AddCaptions extends Component {
  render() {
    return (
      <ScrollView style={{ backgroundColor:"#fff"}}>
        {this.props.route.params.images.map((uri,i) => (
          <View key={i} style={{ margin: 10, alignSelf: "center",marginBottom: 30}}>
            <Image source={{ uri: uri }} style={{ width: 330, height: 260 }} />
            <Textarea
              //   onChangeText={(note) => this.setState({ note })}
              rowSpan={4}
              //   value={this.state.note}
              bordered
              placeholder="Add note"
              style={{
                width: 330,
                borderWidth: 2,
                borderColor: "#DADADA",
                alignSelf: "center",
                borderRadius: 4,
                marginTop: 25,
              }}
            />
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
                  borderRadius: 3,
                  flexDirection: "row",
                  alignItems: "center",
                  width: 150,
                  justifyContent: "center",
                }}
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
                  borderRadius: 3,
                  flexDirection: "row",
                  alignItems: "center",
                  width: 150,
                  justifyContent: "center",
                  borderWidth: 2,
                  borderColor: "#DADADA",
                }}
              >
                <Text
                  style={{ fontSize: 17, fontWeight: "200", color: "black" }}
                >
                  Delete Item
                </Text>
              </TouchableOpacity>
            </View>
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
    borderRadius: 3,
    justifyContent: "space-around",
    width: 150,
  },
  mediaButtonText: {
    fontSize: 15,
  },
});

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(AddCaptions);
