import React, { Component } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { Header, Left, Right, Body, Spinner, Title, Icon } from "native-base";
import { NavigationActions } from "react-navigation";
import { fs } from "../Firebase/config";
import SvgUri from "react-native-svg-uri";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class SeedHome extends Component {
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
      estimation: this.props.navigation.state.params.estimation,
      index: this.props.navigation.state.params.index,
      active: false,
      Loaded: false,
      soilState: false,
      plowState: false,
      nutrientsState: false,
      successState: false,
      stateSeed: false,
      preloader: false
    };
  }
  componentDidMount = () => {
    const { estimation } = this.state;
    fs.collection("Estimations")
      .doc(estimation.id)
      .get()
      .then(doc => {
        this.setState({
          estimation: doc
        });
      })
      .then(() => {
        fs.collection("seed")
          .where("idEstimation", "==", estimation.id)
          .get()
          .then(query => {
            if (query.size != 0) this.setState({ stateSeed: true });
          })
          .then(() => {
            this.setState({
              Loaded: true
            });
          });
      });
  };

  terminatedSeed = () => {
    const { estimation } = this.state;
    Alert.alert(
      "Terminar Labor",
      "Si termina esta labor solo" +
        " podra tener acceso al reporte de la misma",
      [
        {
          text: "Cancelar",

          style: "Cancelar"
        },
        {
          text: "Aceptar",
          onPress: () => {
            this.setState({
              preloader: true
            });
            fs.collection("Estimations")
              .doc(estimation.id)
              .update({
                seedCheck: true
              })
              .then(() => {
                this.componentDidMount();
                this.props.navigation.state.params.update(
                  this.state.estimation.id,
                  this.props.navigation.state.params.index
                );
                this.props.navigation.state.params.actual();
              })
              .then(() => {
                this.props.navigation.navigate("Estimaciones");
              });
          }
        }
      ],
      { cancelable: false }
    );
  };

  render() {
    const { Loaded, estimation, stateSeed } = this.state;

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
                style={{
                  fontSize: 40,
                  color: "#fff",
                  padding: 5
                }}
                onPress={() => this.props.navigation.navigate("Labores")}
              />
            </Left>
            <Body>
              <Title style={{ color: "#fff" }}>SIEMBRA</Title>
            </Body>
            <Right />
          </Header>

          <View style={{ height: "100%", display: "flex" }}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "space-around"
              }}
            >
              <TouchableOpacity
                disabled={estimation.data().seedCheck}
                onPress={() =>
                  this.props.navigation.navigate("seedContainer", estimation)
                }
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 200,
                  height: 200
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
                    source={require("../../../assets/icons/seedWorkers.svg")}
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
                  MANO DE OBRA
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("seedReport", estimation);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 200,
                  height: 200
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
                    source={require("../../../assets/icons/report.svg")}
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
                  REPORTE
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
                  stateSeed
                    ? Alert.alert(
                        "Siembra semilla",
                        "Este costo ya fue calculado" + "\n¿Desea modificarlo?",
                        [
                          {
                            text: "Cancelar",
                            style: "Cancelar"
                          },
                          {
                            text: "Aceptar",
                            onPress: () => {
                              fs.collection("seed")
                                .where("idEstimation", "==", estimation.id)
                                .get()
                                .then(query => {
                                  query.forEach(doc => {
                                    let value = {
                                      doc,
                                      estimation,
                                      action: "edit"
                                    };
                                    this.props.navigation.navigate(
                                      "seed",
                                      value
                                    );
                                  });
                                });
                            }
                          }
                        ],
                        { cancelable: false }
                      )
                    : this.props.navigation.navigate("seed", estimation);
                }}
                disabled={estimation.data().seedCheck}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 200,
                  height: 200
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
                    source={require("../../../assets/icons/seed.svg")}
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
                  SEMILLAS
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={estimation.data().seedCheck}
                onPress={() => this.terminatedSeed()}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 200,
                  height: 200
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
                    source={require("../../../assets/icons/Success.svg")}
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
                  TERMINAR LABOR
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {this.state.preloader && (
            <Spinner
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                right: "50%"
              }}
            />
          )}
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
