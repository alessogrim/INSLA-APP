import React, { Component } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import {
  Header,
  Left,
  Text,
  Body,
  Icon,
  Fab,
  Spinner,
  Title,
  Right
} from "native-base";
import Tabs from "./TabEmployeeArado";
import { NavigationActions } from "react-navigation";
import { firebase, fs } from "../Firebase/config";

export default class Employeesarado extends Component {
  static navigationOptions = () => {
    let headerLeft = null;
    let gesturesEnabled = false;
    let header = null;
    return { 
      headerLeft,
      header,
      gesturesEnabled
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      active: true,
      text: "",
      estimations: this.props.navigation.state.params,
      farm: this.props.navigation.state.params,
      estimations: [],
      Loaded: false
    };
  }
  componentDidMount() {
    this.setState({
      Loaded: true
    });
  }

  render() { 
      return (
        <View style={styles.container}>
          <Header
            style={{
              height: 80,
              borderBottomColor: "#fff",
              backgroundColor: "#077A65"
            }}
          >
            <Left>
              <Icon
                type="MaterialIcons"
                name="arrow-back"
                style={styles.iconStyle}
                onPress={() => this.props.navigation.navigate("plowHome")}
              />
            </Left>
            <Body>
              <Title style={{ color: "#fff", fontSize: 18 }}>EMPLEADO</Title>
            </Body>
            <Right />
          </Header>
          <Tabs navigation={this.props.navigation} />
        </View>
      );
    }
  
}

const styles = StyleSheet.create({
  textStyle: {
    marginTop: 20,
    fontSize: 25,
    textAlign: "center"
  },
  container: {
    flex: 1
  },
  fab: {
    position: "absolute",
    width: 20,
    height: 20,
    backgroundColor: "red"
  },
  iconStyle: {
    fontSize: 40,
    color: "#fff"
  }
});
