import React, { Component } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { Header, Left, Right, Body, Spinner, Title, Icon } from "native-base";
import { fs, firebase } from "../Firebase/config";
import SvgUri from "react-native-svg-uri";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class MenuMercado extends Component {
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
      active: false,
      Loaded: true
    };
  }

  render() {
    const { Loaded, farm } = this.state;

    if (!Loaded) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Spinner color="green" />
        </View>
      );
    } else {
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
                onPress={() => this.props.navigation.navigate("menu")}
              />
            </Left>
            <Body>
              <Title style={{ color: "#fff", fontSize: 23 }}>MERCADO</Title>
            </Body>
            <Right />
          </Header>
          <Text
            style={{
              textAlign: "center",
              fontWeight: "600",
              marginTop: 20,
              fontSize: 30,
              color: "#077A65",
              marginBottom: 20
            }}
          >
            MERCADO
          </Text>
          <View
            style={{
              height: "100%",
              display: "flex"
            }}
          >
            <View
              style={{
                display: "flex",
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "space-around"
              }}
            >
              <TouchableOpacity
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 180,
                  height: 180
                }}
                onPress={() => {
                  this.props.navigation.navigate("buy");
                }}
              >
                <View
                  style={{
                    backgroundColor: "#C5E4C5",
                    padding: "15%",
                    borderRadius: "100%"
                  }}
                >
                  <SvgUri
                    width="80"
                    height="80"
                    source={require("../../../assets/icons/buy.svg")}
                  />
                </View>
                <Text
                  style={{
                    marginTop: 3,
                    fontSize: 20,
                    fontWeight: "600",
                    textAlign: "center"
                  }}
                >
                  COMPRAR
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                display: "flex",
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "space-around",
                marginBottom: 50
              }}
            >
              <TouchableOpacity
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 180,
                  height: 180
                }}
                onPress={() => {
                  this.props.navigation.navigate("mercado");
                }}
              >
                <View
                  style={{
                    backgroundColor: "#C5E4C5",
                    padding: "15%",
                    borderRadius: "100%"
                  }}
                >
                  <SvgUri
                    width="80"
                    height="80"
                    source={require("../../../assets/icons/sale.svg")}
                  />
                </View>
                <Text
                  style={{
                    marginTop: 3,
                    fontSize: 20,
                    fontWeight: "600",
                    textAlign: "center"
                  }}
                >
                  VENDER
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }
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
