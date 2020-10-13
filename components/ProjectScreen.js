import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, ScrollView, FlatList } from "react-native";
import { BaseRouter } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { connect } from "react-redux";
import { Form, Textarea, Button, Icon } from "native-base";
import { postNote, deleteNote } from "../redux/ActionCreators";

const mapStateToProps = (state) => {
  return {
    equipments: state.equipments,
    notes: state.notes.notes,
    projects: state.projects.projects,
    completed: state.completed,
    timestamps: state.timestamps,
  };
};

const mapDispatchToProps = (dispatch) => ({
  postNote: (projId, note) => dispatch(postNote(projId, note)),
  deleteNote: (id) => dispatch(deleteNote(id)),
});

class ProjectScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      note: "",
    };
  }

  render() {
    const project = this.props.projects.find(
      (item) => item.id === this.props.route.params.id
    );
    const equipments = this.props.equipments.equipments.filter(
      (item) => item.projId === project.id
    );
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
          height: 124,
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
            padding: 8,
            justifyContent: "space-between",
          }}
        >
          <Text style={{ paddingBottom: 20, fontSize: 17, fontWeight: "200" }}>
            {item.name}
          </Text>
          {this.props.completed.includes(item.id) ? (
            <TouchableOpacity style={styles.mediaButton}>
              <Icon
                type="FontAwesome"
                name="clock-o"
                style={{ fontSize: 15, color: "#0074B1", marginRight: 4 }}
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
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.mediaButton}>
              <Icon
                type="FontAwesome"
                name="clock-o"
                style={{ fontSize: 15, color: "gray", marginRight: 4 }}
              />
              <Text style={styles.mediaButtonText}>Track</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ flexDirection: "row", alignItems: "baseline" }}>
          <Text style={{ width: 100 }}>CFM:{item.value}</Text>
          <Text>Building: {item.building}</Text>
        </View>
        {this.props.completed.includes(item.id) ? (
          <View
            style={[
              styles.mediaButton,
              {
                marginRight: 8,
                backgroundColor: "#000",
                alignSelf: "flex-end",
              },
            ]}
          >
            <Icon
              type="FontAwesome"
              name="check"
              style={{ fontSize: 20, color: "white", marginRight: 10 }}
            />

            <Text style={{ color: "white" }}>Done</Text>
          </View>
        ) : (
          <View></View>
        )}
      </TouchableOpacity>
    );
    return (
      <ScrollView style={{ backgroundColor: "#fff" }}>
        <View
          style={[
            styles.pcontact,
            { flexDirection: "row", justifyContent: "space-between" },
          ]}
        >
          <View>
            <Text style={{ fontSize: 10 }}>PRIMARY CONTACT</Text>
            <Text style={{ fontSize: 25, fontWeight: "bold" }}>
              {project.pcontact}
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Icon
              type="FontAwesome"
              name="comment-o"
              style={{ fontSize: 20, color: "#0074B1", marginRight: 10 }}
            />
            <Icon
              type="FontAwesome"
              name="phone"
              style={{ fontSize: 20, color: "#0074B1", marginRight: 10 }}
            />
          </View>
        </View>
        <View style={styles.headcontainer}>
          <View style={styles.address}>
            <Text style={{ fontSize: 25, fontWeight: "bold", marginBottom: 2 }}>
              {project.name}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Icon
                type="FontAwesome"
                name="map-marker"
                style={{ fontSize: 20, color: "gray", marginRight: 10 }}
              />
              <Text>{project.location}</Text>
            </View>
          </View>
        </View>

        <View>
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
                style={{ fontSize: 20, color: "#0074B1", marginRight: 10 }}
              />
            </View>
            <Text style={{ marginTop: 20 }}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste
              nihil sunt incidunt laudantium, ad animi consequatur omnis itaque
              enim odit illum asperiores amet atque quidem dicta obcaecati!
              Culpa ipsam corrupti, a iste fugit aut mollitia blanditiis error
              voluptas dolores. Perspiciatis harum itaque aperiam ipsum quisquam
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
                        style={{
                          fontSize: 20,
                          color: "#0074B1",
                          marginRight: 10,
                        }}
                        onPress={() => {
                          this.props.deleteNote(obj.id);
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                  <Text style={{ marginTop: 20, color: "gray" }}>
                    {obj.note}
                  </Text>
                </View>
              )
          )}

          <Form>
            <Textarea
              onChangeText={(note) => this.setState({ note: note })}
              rowSpan={3}
              value={this.state.note}
              bordered
              placeholder="Textarea"
            />
            <TouchableOpacity
              onPress={() => {
                this.props.postNote(
                  this.props.route.params.id,
                  this.state.note
                );
              }}
              style={{
                alignSelf: "center",
                padding: 8,
                backgroundColor: "black",
                borderRadius: 3,
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
                Add note
              </Text>
            </TouchableOpacity>
          </Form>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            margin: 20,
          }}
        >
          <Text style={{ fontSize: 25, fontWeight: "200" }}>Equipments</Text>

          <View
            style={{
              borderWidth: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 6,
              borderRadius: 4,
            }}
          >
            <Icon
              type="FontAwesome"
              name="check"
              style={{ fontSize: 20, color: "gray", marginRight: 10 }}
            />
            <Text>
              {
                equipments.filter((e) => this.props.completed.includes(e.id))
                  .length
              }
              /{equipments.length}
            </Text>
          </View>
        </View>
        {equipments.map(
          (item) => item.projId == project.id && _renderItem(item)
        )}
        <View
          style={{
            height: 50,
            backgroundColor: "lightgray",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon
            type="FontAwesome"
            name="check"
            style={{ fontSize: 20, color: "gray", marginRight: 10 }}
          />
          <Text>Project complete</Text>
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
    height: 100,
    justifyContent: "center",
    fontFamily: "sans-serif",
    margin: 10,
  },
  address: {
    marginLeft: 20,
  },
  pcontact: {
    height: 100,
    justifyContent: "center",
    paddingLeft: 20,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
    margin: 10,
    alignItems: "center",
  },
  mediaButton: {
    padding: 5,
    flexDirection: "row",
    backgroundColor: "#F4F4F4",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    width: 90,
  },
  mediaButtonText: {
    fontWeight: "bold",
    fontSize: 15,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ProjectScreen);
