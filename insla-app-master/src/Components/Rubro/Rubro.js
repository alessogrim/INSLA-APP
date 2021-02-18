import React, { Component } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { Header, Left, Right, Body, Spinner, Title, Icon } from "native-base";
import { fs, firebase } from "../Firebase/config";
import SvgUri from "react-native-svg-uri";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class Rubro extends Component {
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
      Loaded: true,
      farm: this.props.navigation.state.params
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
                onPress={() => this.props.navigation.navigate("Farms")}
              />
            </Left>
            <Body>
              <Title style={{ color: "#fff", fontSize: 23 }}>MI FINCA</Title>
            </Body>
            <Right />
          </Header>

          <View style={{ height: "100%", display: "flex" }}>
            <View
              style={{
                display: "flex",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
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
                  this.props.navigation.navigate("Estimaciones", farm);
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
                    source={require("../../../assets/icons/farming.svg")}
                    paddin
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
                  AGRÍCOLA
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 180,
                  height: 180
                }}
                onPress={() => {
                  this.props.navigation.navigate("warehouse", farm);
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
                    source={require("../../../assets/icons/warehouse.svg")}
                    paddin
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
                  ALMACEN
                </Text>
              </TouchableOpacity>
            </View>

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
                  this.props.navigation.navigate("Production", farm);
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
                    source={require("../../../assets/icons/pecuario.svg")}
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
                  PECUARIO
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("corrales", { farm });
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 180,
                  height: 180
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
                    source={require("../../../assets/icons/fence.svg")}
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
                  CORRALES
                </Text>
              </TouchableOpacity>
            </View>

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
                onPress={() => {
                  this.props.navigation.navigate("employees", farm);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 180,
                  height: 180
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
                    source={require("../../../assets/icons/employee.svg")}
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
                  EMPLEADO
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("Bodega", farm);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 180,
                  height: 180
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
                    source={require("../../../assets/icons/farm.svg")}
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
                  BODEGA
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
