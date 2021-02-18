import React from "react";
import {
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  Alert
} from "react-native";

import { NavigationActions } from "react-navigation";
import { fs, firebase } from "../Firebase/config";

import {
  Header,
  Container,
  Content,
  Form,
  Item,
  Input,
  Icon,
  Label,
  View,
  Picker,
  Text,
  Button,
  Left,
  Spinner,
  Body,
  Right,
  Title
} from "native-base";

export default class BalanceGeneral extends React.Component {
  state = {};
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
      estimation: this.props.navigation.state.params,
      nutrientsTotalPayRollWorkers: 0,
      nutrientsTotalPayRollAlkalization: 0,
      nutrientsTotalPayRollAcidification: 0,
      nutrientsTotalPayRollMicroMacroNutrients: 0,
      nutrientsTotalPayRoll: 0,
      totalPayRoll: 0,
      totalPayRollPlow: 0,
      totalpayRollChapulin: 0,
      workersTotalPayRoll: 0,
      chapulinTotalPayRoll: 0,
      seed: {},
      cosechasTotalPayRollWorkers: 0,
      materialesTotalPayRoll: 0,
      transporteTotalPayroll: 0,
      sales: 0,
      netSales: 0,
      costosTotales: 0,
      grossProfit: 0, //utilidad bruta
      netIncome: 0, //utlidad neta
      Loaded: false,
      seedFlag: false
    };
  }

  totalPlants = doc => {
    if (doc.data().Medidas == "Hectareas") {
      return parseInt(
        doc.data().Area / 0.0001 / (doc.data().Surco * doc.data().Distancia)
      );
    } else if (doc.data().Medidas == "Manzanas") {
      return parseInt(
        (doc.data().Area * 0.7) /
        0.0001 /
        (doc.data().Distancia * doc.data().Surco)
      );
    } else {
      return parseInt(
        doc.data().Area / (doc.data().Distancia * doc.data().Surco)
      );
    }
  };

  totalQuintales = doc => {
    return parseInt(
      (((this.totalPlants(doc) * doc.data().weightPlant) / 1000) * 2.2) / 100
    );
  };

  totalEstimation = doc => {
    return (this.totalQuintales(doc) * doc.data().estimatedPrice * 100).toFixed(
      2
    );
  };

  getAreaOnMeters = () => {
    const { estimation } = this.state;
    if (estimation.data().Medidas === "Hectareas") {
      return estimation.data().Area / 0.0001;
    } else if (estimation.data().Medidas === "Manzanas") {
      return (estimation.data().Area * 0.7) / 0.0001;
    } else {
      return estimation.data().Area;
    }
  };
  getTotalSeeds = () => {
    const { estimation, seed, seedFlag } = this.state;
    if (!seedFlag) {
      return parseInt(
        (this.getAreaOnMeters() /
          (estimation.data().Surco * estimation.data().Distancia)) *
        seed.data().quantity
      );
    } else {
      return 0;
    }
  };

  totalPound = () => {
    const { seed, seedFlag } = this.state;
    if (!seedFlag) {
      return (
        ((this.getTotalSeeds() * seed.data().weightSeed) / 1000) *
        2.020462
      ).toFixed(2);
    } else {
      return 0;
    }
  };

  totalGlobalSeeds = () => {
    const { seed, seedFlag } = this.state;
    if (!seedFlag) {
      return this.totalPound() * seed.data().price;
    } else {
      return 0;
    }
  };

  componentDidMount() {
    const { estimation } = this.state;
    fs.collection("soilWorkers")
      .where("idEstimation", "==", estimation.id)
      .get()
      .then(query => {
        query.forEach(doc => {
          this.setState({
            totalPayRoll:
              this.state.totalPayRoll + doc.data().dayWorked * doc.data().payDay
          });
        });
      })
      .then(() => {
        fs.collection("plowWorkers")
          .where("idEstimation", "==", estimation.id)
          .get()
          .then(query => {
            query.forEach(doc => {
              this.setState({
                totalPayRollPlow:
                  this.state.totalPayRollPlow +
                  doc.data().dayWorked * doc.data().payDay
              });
            });
          })
          .then(() => {
            fs.collection("soilChapulin")
              .where("idEstimation", "==", estimation.id)
              .get()
              .then(query => {
                query.forEach(doc => {
                  this.setState({
                    totalpayRollChapulin:
                      this.state.totalpayRollChapulin +
                      doc.data().totalHours * doc.data().payForHour
                  });
                });
              })
              .then(() => {
                fs.collection("soilNutrients")
                  .where("idEstimation", "==", estimation.id)
                  .get()
                  .then(query => {
                    query.forEach(doc => {
                      this.setState({
                        nutrientsTotalPayRollWorkers:
                          this.state.nutrientsTotalPayRollWorkers +
                          doc.data().dayWorked * doc.data().payDay
                      });
                    });
                  })
                  .then(() => {
                    fs.collection("soilAlkalization")
                      .where("idEstimation", "==", estimation.id)
                      .get()
                      .then(query => {
                        query.forEach(doc => {
                          this.setState({
                            nutrientsTotalPayRollAlkalization:
                              this.state.nutrientsTotalPayRollAlkalization +
                              doc.data().price * doc.data().quantity
                          });
                        });
                      });
                  })
                  .then(() => {
                    fs.collection("harvestWorkers")
                      .where("idEstimation", "==", estimation.id)
                      .get()
                      .then(query => {
                        query.forEach(doc => {
                          this.setState({
                            cosechasTotalPayRollWorkers:
                              this.state.cosechasTotalPayRollWorkers +
                              doc.data().dayWorked * doc.data().payDay
                          });
                        });
                      });
                  })
                  .then(() => {
                    fs.collection("harvestWorkers")
                      .where("idEstimation", "==", estimation.id)
                      .get()
                      .then(query => {
                        query.forEach(doc => {
                          this.setState({
                            transporteTotalPayroll:
                              this.state.transporteTotalPayroll +
                              doc.data().transport
                          });
                        });
                      });
                  })
                  .then(() => {
                    fs.collection("Materials")
                      .where("idEstimation", "==", this.state.estimation.id)
                      .get()
                      .then(query => {
                        query.forEach(doc => {
                          this.setState({
                            materialesTotalPayRoll:
                              this.state.materialesTotalPayRoll + doc.data().price * doc.data().quantity
                          });
                        });
                      });
                  })
                  .then(() => {
                    fs.collection("seedWorkers")
                      .where("idEstimation", "==", estimation.id)
                      .get()
                      .then(query => {
                        query.forEach(doc => {
                          this.setState({
                            workersTotalPayRoll:
                              this.state.workersTotalPayRoll +
                              doc.data().dayWorked * doc.data().payDay
                          });
                        });
                      });
                  })
                  .then(() => {
                    fs.collection("seedChapulin")
                      .where("idEstimation", "==", estimation.id)
                      .get()
                      .then(query => {
                        query.forEach(doc => {
                          this.setState({
                            chapulinTotalPayRoll:
                              this.state.chapulinTotalPayRoll +
                              doc.data().payForHour * doc.data().totalHours
                          });
                        });
                      })
                  })
                  .then(() => {
                    fs.collection("seed")
                      .where("idEstimation", "==", estimation.id)
                      .get()
                      .then(query => {
                        if (query.size != 0) {
                          query.forEach(doc => {
                            this.setState({
                              seed: doc
                            });
                          });
                        } else {
                          this.setState({
                            seedFlag: true
                          });
                        }
                      })
                      .then(() => {
                        this.setState({
                          Loaded: true
                        });
                      });
                  });
              });
          });
      });
  }

  render() {
    const {
      Loaded,
      estimation,
      totalPayRoll,
      totalPayRollPlow,
      totalpayRollChapulin,
      nutrientsTotalPayRollWorkers,
      nutrientsTotalPayRollAlkalization,
      workersTotalPayRoll,
      chapulinTotalPayRoll,
      cosechasTotalPayRollWorkers,
      transporteTotalPayroll,
      materialesTotalPayRoll,
      seed
    } = this.state;
    this.state.costosTotales = totalPayRollPlow +
      totalPayRoll +
      totalpayRollChapulin +
      nutrientsTotalPayRollWorkers +
      nutrientsTotalPayRollAlkalization +
      workersTotalPayRoll +
      chapulinTotalPayRoll +
      cosechasTotalPayRollWorkers +
      materialesTotalPayRoll +
      transporteTotalPayroll;
    this.state.sales = this.totalEstimation(estimation);
    this.state.netSales = this.totalEstimation(estimation);

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
        <Container>
          <Header
            style={{
              height: 70,
              borderBottomColor: "#fff",
              backgroundColor: "#077A65",
              textAlign: "center"
            }}
          >
            <Left>
              <Icon
                type="MaterialIcons"
                name="arrow-back"
                style={{
                  fontSize: 40,
                  marginLeft: 10,
                  color: "#fff"
                }}
                onPress={() => this.props.navigation.navigate("Labores")}
              />
            </Left>
            <Body>
              <Title style={{ color: "#fff" }}>Balance</Title>
            </Body>
            <Right />
          </Header>
          <Label style={{ fontSize: 18, fontWeight: 'bold', textAlign: "center", marginTop: 4 }}>
            Balance General
          </Label>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View
              style={{
                flex: 50,
                marginRight: "5%",
                marginLeft: "5%",
                marginTop: 10
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 10
                }}
              >
                <Label style={{ fontSize: 18, fontWeight: 'bold' }}>Estimación {estimation.data().Especie} </Label>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <Label style={{ fontSize: 17 }}>Ventas</Label>
                <Text style={{ marginRight: 20 }}>{this.state.sales}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  borderTopWidth: 1,
                  borderTopColor: "black",
                  backgroundColor: "#d3d3d3"
                }}
              >
                <Label style={{ fontSize: 17 }}>Ventas Netas</Label>
                <Text style={{ marginRight: 20 }}>
                  {"L. " + this.state.netSales}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 15
                }}
              >
                <Label style={{ fontSize: 18, fontWeight: 'bold' }}>Costo de ventas</Label>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 2
                }}
              >
                <Label style={{ fontSize: 17, fontWeight: 'bold' }}>Labor Suelo</Label>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Label style={{ fontSize: 17 }}>Mano de obra suelo</Label>
                <Text style={{ marginRight: 20 }}>{totalPayRoll.toFixed(2)}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <Label style={{ fontSize: 17 }}>Mano de obra arado</Label>
                <Text style={{ marginRight: 20 }}>{totalPayRollPlow.toFixed(2)}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <Label style={{ fontSize: 17 }}>Mano de obra chapulín</Label>
                <Text style={{ marginRight: 20 }}>{totalpayRollChapulin.toFixed(2)}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <Label style={{ fontSize: 17 }}>Mano de obra nutrientes</Label>
                <Text style={{ marginRight: 20 }}>
                  {nutrientsTotalPayRollWorkers.toFixed(2)}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <Label style={{ fontSize: 17 }}>Costo alcanización</Label>
                <Text style={{ marginRight: 20 }}>
                  {nutrientsTotalPayRollAlkalization.toFixed(2)}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <Label style={{ fontSize: 17, fontWeight: 'bold' }}>Labor Siembra</Label>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <Label style={{ fontSize: 17 }}>Mano de obra artesanal</Label>
                <Text style={{ marginRight: 20 }}>{workersTotalPayRoll.toFixed(2)}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <Label style={{ fontSize: 17 }}>
                  Costo uso chapulín
                </Label>
                <Text style={{ marginRight: 20 }}>{chapulinTotalPayRoll.toFixed(2)}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <Label style={{ fontSize: 17 }}>
                  Costo de semillas
                </Label>
                <Text style={{ marginRight: 20 }}>{this.totalGlobalSeeds().toFixed(2)}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <Label style={{ fontSize: 17, fontWeight: 'bold' }}>Labor Cosecha</Label>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <Label style={{ fontSize: 17 }}>Mano de obra extracción</Label>
                <Text style={{ marginRight: 20 }}>{this.state.cosechasTotalPayRollWorkers.toFixed(2)}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <Label style={{ fontSize: 17 }}>Costo de materiales</Label>
                <Text style={{ marginRight: 20 }}>{this.state.materialesTotalPayRoll.toFixed(2)}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <Label style={{ fontSize: 17 }}>Costo de transporte</Label>
                <Text style={{ marginRight: 20 }}>{this.state.transporteTotalPayroll.toFixed(2)}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  borderTopWidth: 1,
                  borderTopColor: "black",
                  backgroundColor: "#d3d3d3"
                }}
              >
                <Label style={{ fontSize: 17 }}>Costos</Label>
                <Text style={{ marginRight: 20 }}>
                  {"L. " + parseFloat(this.state.costosTotales + (this.totalGlobalSeeds())).toFixed(2)}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 25,
                  backgroundColor: "#d3d3d3",
                  borderTopWidth: 1,
                  borderTopColor: "black"
                }}
              >
                <Label style={{ fontSize: 17 }}>Utilidad Bruta</Label>
                <Text style={{ marginRight: 20 }}>
                  {"L. " + parseFloat(this.state.netSales - (this.state.costosTotales + this.totalGlobalSeeds()).toFixed(2))}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 20,
                  backgroundColor: "#d3d3d3",
                  borderTopWidth: 1,
                  borderTopColor: "black"
                }}
              >
                <Label style={{ fontSize: 17, backgroundColor: "#d3d3d3" }}>
                  Utilidad Neta
                </Label>
                <Text style={{ marginRight: 20 }}>
                  {"L. " + parseFloat(this.state.netSales - (this.state.costosTotales + this.totalGlobalSeeds()).toFixed(2))}
                </Text>
              </View>
            </View>
          </View>
        </Container>
      );
    }
  }
}

