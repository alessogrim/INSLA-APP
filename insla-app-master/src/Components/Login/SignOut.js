import React, { Component } from "react";
import { Button, Text } from "native-base";
import { db, fs, firebase } from "../Firebase/config";

export default class SignOut extends Component {
  constructor(props) {
    super(props);
  }
  sinout() {
    firebase.auth().signOut();
  }
  render() {
    return (
      <Button
        style={{ backgroundColor: "none" }}
        onPress={this.sinout.bind(this)}
      >
        <Text style={{ color: "red", fontSize: 15, fontWeight: "600" }}>
          Cerrar Sesión
        </Text>
      </Button>
    );
  }
}
