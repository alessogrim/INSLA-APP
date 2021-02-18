import React, { Component } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { Header, Left, Right, Body, Spinner, Title, Icon } from "native-base";
import { fs, firebase } from "../Firebase/config";
import SvgUri from "react-native-svg-uri";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class Stages extends Component {
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
      farm: this.props.navigation.state.params.farm,
      production: this.props.navigation.state.params.production,
      index: this.props.navigation.state.params.index,
      update: this.props.navigation.state.params.update,
      initialStage: this.props.navigation.state.params.production.data()
        .initialStage,
      growthStage: this.props.navigation.state.params.production.data()
        .growthStage,
      finalStage: this.props.navigation.state.params.production.data()
        .finalStage
    };
  }

  render() {
    const { Loaded } = this.state;
    const { farm, production, index, update } = this.state;
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
                onPress={() => this.props.navigation.goBack()}
              />
            </Left>
            <Body>
              <Title style={{ color: "#fff", fontSize: 19 }}>ETAPAS</Title>
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
                  this.props.navigation.navigate("InitialStage", {
                    farm: farm,
                    production: production,
                    index: index,
                    update: update
                  });
                }}
                disabled={this.state.initialStage}
              >
                <View
                  style={{
                    backgroundColor: "#C5E4C5",
                    padding: "15%",
                    borderRadius: "100%"
                  }}
                >
                  <SvgUri
                    width="75"
                    height="75"
                    source={require("../../../assets/icons/chick.svg")}
                    paddin
                  />
                  {this.state.initialStage ? (
                    <Icon
                      type="MaterialIcons"
                      name="done"
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        fontWeight: "600",
                        fontSize: 80,
                        color: "#6bcc3c"
                      }}
                    />
                  ) : null}
                </View>
                <Text
                  style={{
                    marginTop: 3,
                    fontSize: 20,
                    fontWeight: "600",
                    textAlign: "center"
                  }}
                >
                  INICIAL
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
                  this.props.navigation.navigate("GrowthStage", {
                    farm: farm,
                    production: production,
                    index: index,
                    update: update
                  });
                }}
                disabled={this.state.growthStage || !this.state.initialStage}
              >
                <View
                  style={{
                    backgroundColor: "#C5E4C5",
                    padding: "15%",
                    borderRadius: "100%"
                  }}
                >
                  <SvgUri
                    width="75"
                    height="75"
                    source={require("../../../assets/icons/bird.svg")}
                    paddin
                  />
                  {this.state.growthStage ? (
                    <Icon
                      type="MaterialIcons"
                      name="done"
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        fontWeight: "600",
                        fontSize: 80,
                        color: "#6bcc3c"
                      }}
                    />
                  ) : null}
                  {!this.state.initialStage ? (
                    <Icon
                      type="MaterialIcons"
                      name="block"
                      style={{
                        position: "absolute",
                        top: "35%",
                        right: 25,
                        fontWeight: "600",
                        fontSize: 80,
                        color: "red"
                      }}
                    />
                  ) : null}
                </View>
                <Text
                  style={{
                    marginTop: 3,
                    fontSize: 18,
                    fontWeight: "600",
                    textAlign: "center"
                  }}
                >
                  CRECIMIENTO
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
                  this.props.navigation.navigate("finalStage", {
                    farm: farm,
                    production: production,
                    index: index,
                    update: update
                  });
                }}
                disabled={this.state.finalStage || !this.state.growthStage}
              >
                <View
                  style={{
                    backgroundColor: "#C5E4C5",
                    padding: "15%",
                    borderRadius: "100%"
                  }}
                >
                  <SvgUri
                    width="75"
                    height="75"
                    source={require("../../../assets/icons/chickends.svg")}
                    paddin
                  />
                  {this.state.finalStage ? (
                    <Icon
                      type="MaterialIcons"
                      name="done"
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        fontWeight: "600",
                        fontSize: 80,
                        color: "#6bcc3c"
                      }}
                    />
                  ) : null}
                  {!this.state.growthStage ? (
                    <Icon
                      type="MaterialIcons"
                      name="block"
                      style={{
                        position: "absolute",
                        top: "35%",
                        right: 25,
                        fontWeight: "600",
                        fontSize: 80,
                        color: "red"
                      }}
                    />
                  ) : null}
                </View>
                <Text
                  style={{
                    marginTop: 3,
                    fontSize: 20,
                    fontWeight: "600",
                    textAlign: "center"
                  }}
                >
                  FINAL
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
                  this.props.navigation.navigate("rawMaterial", {
                    farm: farm,
                    production: production,
                    index: index,
                    update: update
                  });
                }}
                disabled={this.state.finalStage}
              >
                <View
                  style={{
                    backgroundColor: "#C5E4C5",
                    padding: "15%",
                    borderRadius: "100%"
                  }}
                >
                  <SvgUri
                    width="75"
                    height="75"
                    source={require("../../../assets/icons/materia-prima.svg")}
                    paddin
                  />
                </View>
                {this.state.finalStage ? (
                  <Icon
                    type="MaterialIcons"
                    name="block"
                    style={{
                      position: "absolute",
                      top: "22%",
                      right: 50,
                      fontWeight: "600",
                      fontSize: 80,
                      color: "red"
                    }}
                  />
                ) : null}
                <Text
                  style={{
                    marginTop: 3,
                    fontSize: 20,
                    fontWeight: "600",
                    textAlign: "center"
                  }}
                >
                  MATERIA PRIMA
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
                  this.props.navigation.navigate("chickenProduct", {
                    production: production,
                    farm: this.state.farm
                  });
                }}
                disabled={!this.state.finalStage}
              >
                <View
                  style={{
                    backgroundColor: "#C5E4C5",
                    padding: "15%",
                    borderRadius: "100%"
                  }}
                >
                  <SvgUri
                    width="75"
                    height="75"
                    source={require("../../../assets/icons/chickendead.svg")}
                    paddin
                  />
                  {!this.state.finalStage ? (
                    <Icon
                      type="MaterialIcons"
                      name="block"
                      style={{
                        position: "absolute",
                        top: "35%",
                        right: 25,
                        fontWeight: "600",
                        fontSize: 80,
                        color: "red"
                      }}
                    />
                  ) : null}
                </View>
                <Text
                  style={{
                    marginTop: 3,
                    fontSize: 20,
                    fontWeight: "600",
                    textAlign: "center"
                  }}
                >
                  PRODUCTO
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
