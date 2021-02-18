import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Header, Left, Body, Title, Right, Icon } from "native-base";

export default class AddChemical extends Component {
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
      estimation: {},
      Loaded: true
    };
  }
  render() {
    return (
      <View>
        <Header style={styles.headerStyle}>
          <Left>
            <Icon
              type="MaterialIcons"
              name="arrow-back"
              style={styles.iconStyle}
              onPress={() => this.props.navigation.navigate("addSuelo")}
            />
          </Left>
          <Body>
            <Title style={styles.titleStyle}>QUÍMICO</Title>
          </Body>
          <Right />
        </Header>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  titleStyle: {
    color: "#fff"
  },
  container: {
    flexDirection: "column",
    height: "100%"
  },
  headerStyle: {
    borderBottomColor: "#fff",
    backgroundColor: "#077A65",
    height: 80
  },
  iconStyle: {
    fontSize: 40,
    color: "#fff"
  },

  buttonStyle: {
    backgroundColor: "#077A65",
    marginTop: 30,
    marginLeft: 10,
    marginRight: 10,
    width: "70%"
  },
  labelStyle: {
    marginTop: 8,
    marginLeft: 10,
    marginRight: 10
  },
  itemStyle: {
    height: 50,
    //marginLeft: 10,
    //marginRight: 10,
    top: -10,
    borderWidth: 1,
    borderColor: "#077A65",
    //backgroundColor: "#7fff00",
    width: "25%"
  }
});
