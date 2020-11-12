import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { CheckBox, Form, Input, Button } from "native-base";
import { Auth } from "aws-amplify";
import ExpoStatusBar from "expo-status-bar/build/ExpoStatusBar";
import * as Font from "expo-font";
import { AppLoading } from "expo";
let customFonts = {
  "Montserrat-Thin": require("../assets/Montserrat-Light.ttf"),
};

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      email: "",
      password: "",
      toggleCheck: false,
      remcolor: "#fff",
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
  }

  render() {
    const { email, password } = this.state;
    const { updateAuthState } = this.props;
    async function signIn() {
      try {
        await Auth.signIn(email, password);
        console.log(" Success");
        updateAuthState("loggedIn");
        console.log(Auth.currentUserInfo());
      } catch (error) {
        console.log(" Error signing in...", error);
      }
    }

    if (this.state.fontsLoaded) {
      return (
        <ScrollView style={{ backgroundColor: "#000" }}>
          <StatusBar style="light" />
          <KeyboardAvoidingView style={styles.container} enabled>
            <View style={styles.logoContainer}>
              <Image
                source={require("../assets/logo.png")}
                style={{ width: 78, height: 76 }}
              />
            </View>
            <View style={styles.nameContainer}>
              <Text
                style={{
                  color: "#fff",
                  fontFamily: "Montserrat-Thin",
                  fontWeight: "400",
                  fontSize: 36,
                  lineHeight: 43,
                }}
              >
                BBA Technician App
              </Text>
            </View>
            {/* <View style={styles.contentContainer}>
              <Text
                style={{
                  color: "#fff",
                  fontFamily: "Montserrat-Thin",
                  fontWeight: "400",
                  fontSize: 12,
                  lineHeight: 14,
                }}
              >
                Donec tristique nibh at sapien accumsan condimentum
              </Text>
            </View> */}

            <Form style={styles.form}>
              <View
                style={{
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: "#fff",
                }}
              >
                <Input
                  style={{
                    backgroundColor: "#fff",
                    borderBottomColor: "lightgray",
                    borderBottomWidth: 1,
                  }}
                  placeholder="Username"
                  autoCorrect={false}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onChangeText={(email) => this.setState({ email })}
                  // value={this.state.email}
                />
                <Input
                  // value={this.state.password}
                  style={{ backgroundColor: "#fff" }}
                  placeholder="Password"
                  secureTextEntry={true}
                  autoCorrect={false}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onChangeText={(password) => this.setState({ password })}
                />
              </View>
              <View
                style={{ justifyContent: "center", width: "100%", height: 25 }}
              >
                <Text
                  style={{
                    alignSelf: "flex-end",
                    fontFamily: "Montserrat-Thin",
                    fontSize: 12,
                    color: "#fff",
                  }}
                >
                  Forgot your password?
                </Text>
              </View>

              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 20,
                }}
              >
                {this.state.toggleCheck&&<CheckBox
                  checked={true}
                  onPress={() => {
                    this.setState({ toggleCheck: !this.state.toggleCheck });
                    // if (this.state.remcolor == "#fff") {
                    //   this.setState({ remcolor: "none" });
                    // }
                    // if (this.state.remcolor == "none") {
                    //   this.setState({ remcolor: "#fff" });
                    // }
                  }}
                  color="#0074B1"
                  style={{
                    fontSize: 12,
                    borderColor: "none",
                    // backgroundColor: "none",
                    marginRight: 20,
                    borderRadius: 4,
                    marginLeft: -12,
                  }}
                />}
                {!this.state.toggleCheck&&<CheckBox
                  checked={false}
                  onPress={() => {
                    this.setState({ toggleCheck: !this.state.toggleCheck });
                    // if (this.state.remcolor == "#fff") {
                    //   this.setState({ remcolor: "none" });
                    // }
                    // if (this.state.remcolor == "none") {
                    //   this.setState({ remcolor: "#fff" });
                    // }
                  }}
                  color="#0074B1"
                  style={{
                    fontSize: 12,
                    borderColor: "none",
                    backgroundColor: "#fff",
                    marginRight: 20,
                    borderRadius: 4,
                    marginLeft: -12,
                  }}
                />}
                <Text
                  style={{
                    fontFamily: "Montserrat-Thin",
                    fontSize: 12,
                    color: "#fff",
                  }}
                >
                  Remember Me
                </Text>
              </View>

              <Button
                style={styles.button}
                onPress={signIn}
                // onPress={() => this.props.navigation.navigate("HomeScreen")}
              >
                <Text
                  style={{
                    fontFamily: "Montserrat-Thin",
                    fontSize: 14,
                    color: "#fff",
                  }}
                >
                  Log In
                </Text>
              </Button>
            </Form>

            <TouchableOpacity style={styles.help}>
              <Text
                style={{
                  fontFamily: "Montserrat-Thin",
                  fontSize: 14,
                  color: "#fff",
                }}
              >
                Need Help?{" "}
              </Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </ScrollView>
      );
    } else return <AppLoading />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  logoContainer: {
    // alignItems: "center",
    marginTop: 139,
    marginLeft: 30,
    marginBottom: 29,
  },
  nameContainer: {
    width: 220,
    height: 150,
    marginLeft: 30,
  },
  contentContainer: {
    width: 300,
    marginLeft: 43,
  },
  logotext: {
    fontSize: 20,
    fontWeight: "bold",
  },
  form: {
    margin: 30,
    // marginLeft: 30,
    marginBottom: 30,
  },
  check: {
    marginTop: 10,
    flexDirection: "row",
    marginLeft: 5,
  },
  button: {
    marginTop: 20,
    width: "100%",
    borderRadius: 5,
    backgroundColor: "#0074B1",
    justifyContent: "center",
    alignSelf: "center",
  },
  help: {
    alignItems: "center",
  },
});
