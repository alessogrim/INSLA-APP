import React, { Component } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { Header, Left, Text, Body, Icon, Fab, Title, Right } from "native-base";
import Tabs from "./Tabs";
import { NavigationActions } from "react-navigation";

export default class Estimations extends Component {
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
      text: ""
    };
  }
  goToFarm() {
    const navigateAction = NavigationActions.navigate({
      routeName: "addFarm"
    });
    this.props.navigation.dispatch(navigateAction);
  }
  render() {
    return (
      <View style={styles.container}>
        <Header
          style={{
            height: 80,
            borderBottomColor: "#fff",
            backgroundColor: "#077A65",
            textAlign: "center"
          }}
        >
          <Left>
            <Icon
              name="menu"
              style={{
                fontSize: 50,
                marginLeft: 10,
                color: "#fff"
              }}
              onPress={() => this.props.navigation.openDrawer()}
            />
          </Left>
          <Body>
            <Title style={{ color: "#fff", fontSize: 25 }}>FINCAS</Title>
          </Body>
          <Right />
        </Header>
        <Tabs navigation={this.props.navigation} />
        <Fab
          active={this.state.active}
          direction="up"
          style={{ backgroundColor: "#077A65", padding: 0, margin: 0 }}
          position="bottomRight"
          onPress={() => this.setState({ active: !this.state.active })}
          onPress={this.goToFarm.bind(this)}
        >
          <Icon type="FontAwesome5" name="plus" />
        </Fab>
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
    height: 20
  }
});
