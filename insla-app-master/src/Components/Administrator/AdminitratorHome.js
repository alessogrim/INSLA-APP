import React, { Component } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { Header, Left, Right, Icon, Body, Spinner, Title } from "native-base";
import { NavigationActions } from "react-navigation";
import { fs } from "../Firebase/config";
import SvgUri from "react-native-svg-uri";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class AdministratorHome extends Component {
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
      Loaded: false,
      soilState: false,
      plowState: false,
      nutrientsState: false,
      successState: false
    };
  }
  goTocultivos() {
    const navigateAction = NavigationActions.navigate({
      routeName: "constcultivos"
    });
    this.props.navigation.dispatch(navigateAction);
  }
  goToinsumos() {
    const navigateAction = NavigationActions.navigate({
      routeName: "insumos"
    });
    this.props.navigation.dispatch(navigateAction);
  }
  goTomateriales() {
    const navigateAction = NavigationActions.navigate({
      routeName: "Material"
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
            <Title style={{ color: "#fff", fontSize: 16 }}>ADMINISTRAR</Title>
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
                width: 200,
                height: 200
              }}
              onPress={() => this.setState({ active: !this.state.active })}
              onPress={() => {
                this.props.navigation.navigate("insumosMenu");
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
                  width="70"
                  height="70"
                  source={require("../../../assets/icons/supplies.svg")}
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
                INSUMOS
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 200,
                height: 200
              }}
              onPress={() => this.setState({ active: !this.state.active })}
              onPress={() => {
                this.props.navigation.navigate("ToolsHome");
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
                  width="70"
                  height="70"
                  source={require("../../../assets/icons/rake.svg")} 
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
                HERRAMIENTAS
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
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
                width: 200,
                height: 200
              }}
              onPress={() => {
                this.props.navigation.navigate("constcultivos");
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
                  width="70"
                  height="70"
                  source={require("../../../assets/icons/sprout.svg")}
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
                CULTIVOS
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 200,
                height: 200
              }}
              onPress={() => this.setState({ active: !this.state.active })}
              onPress={() => {
                this.props.navigation.navigate("Material");
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
                  width="70"
                  height="70"
                  source={require("../../../assets/icons/materials.svg")}
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
                MATERIALES
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
    marginLeft: 5,
    color: "#fff"
  }
});
