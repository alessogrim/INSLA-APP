import React from "react";
import { StyleSheet, Dimensions, Text, View } from "react-native";
import { Spinner } from "native-base";
import Navigation from "./src/Components/Navigation/Navigation";
import LoginNavigation from "./src/Components/Navigation/LoginNavigation";
import { firebase } from "./src/Components/Firebase/config";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogged: false,
      Loaded: false
    };
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user !== null) {
        this.setState({
          isLogged: true,
          Loaded: true
        });
      } else {
        this.setState({
          isLogged: false,
          Loaded: true
        });
      }
    });
  }
  render() {
    const { isLogged, Loaded } = this.state;

    if (!Loaded) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Spinner color="green" />
        </View>
      );
    } else {
      if (isLogged) {
        return <Navigation />;
      } else {
        return <LoginNavigation />;
      }
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
