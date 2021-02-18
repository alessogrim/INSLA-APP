import React, { Component } from "react";
import {
  Container,
  Body,
  Text,
  Button,
  Card,
  CardItem,
  Left,
  Spinner,
  Icon
} from "native-base";
import { StyleSheet, View, Alert, ScrollView } from "react-native";
import { fs, firebase } from "../Firebase/config";

export default class soilReport extends Component {
  //navigation option
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
      payRollWorkers: [],
      plowPayRollWorkers: [],
      plowPayRollChapulin: [],
      nutrientsPayRollWorkers: [],
      nutrientsPayRollAlkalization: [],
      nutrientsPayRollAcifidication: [],
      nutrientsPayRollMicroMacroNutrients: [],
      nutrientsTotalPayRollWorkers: 0,
      nutrientsTotalPayRollAlkalization: 0,
      nutrientsTotalPayRollAcidification: 0,
      nutrientsTotalPayRollMicroMacroNutrients: 0,
      nutrientsTotalPayRoll: 0,
      totalPayRoll: 0,
      totalPayRollPlow: 0,
      totalpayRollChapulin: 0,
      Loaded: false
    };
  }
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

  componentDidMount() {
    const { estimation } = this.state;
    fs.collection("soilWorkers")
      .where("idEstimation", "==", estimation.id)
      .get()
      .then(query => {
        query.forEach(doc => {
          this.setState({
            payRollWorkers: [...this.state.payRollWorkers, doc],
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
                plowPayRollWorkers: [...this.state.plowPayRollWorkers, doc],
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
                    plowPayRollChapulin: [
                      ...this.state.plowPayRollChapulin,
                      doc
                    ],
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
                        nutrientsPayRollWorkers: [
                          ...this.state.nutrientsPayRollWorkers,
                          doc
                        ],
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
                            nutrientsPayRollAlkalization: [
                              ...this.state.nutrientsPayRollAlkalization,
                              doc
                            ],
                            nutrientsTotalPayRollAlkalization:
                              this.state.nutrientsTotalPayRollAlkalization +
                              this.getAreaOnMeters() *
                                doc.data().price *
                                doc.data().quantity
                          });
                        });
                      })
                      .then(() => {
                        this.setState({ Loaded: true });
                      });
                  });
              });
          });
      });
  }
  render() {
    const {
      Loaded,
      totalPayRoll,
      totalPayRollPlow,
      totalpayRollChapulin,
      nutrientsTotalPayRollWorkers,
      nutrientsTotalPayRollAlkalization
    } = this.state;

    if (!Loaded) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Spinner color="green" />
        </View>
      );
    } else {
      const showPayRollWorkers = this.state.payRollWorkers.map((doc, index) => {
        return (
          <Text key={index} style={{ fontSize: 17 }}>
            {index + 1 + ". "}
            {doc.data().name + " " + doc.data().lastName}
            {"  "}
            <Text style={{ fontSize: 17, color: "red" }}>
              L. {doc.data().dayWorked * doc.data().payDay}
            </Text>
          </Text>
        );
      });

      const showPayRollChapulin = this.state.plowPayRollChapulin.map(
        (doc, index) => {
          return (
            <Text key={index} style={{ fontSize: 17 }}>
              {index + 1 + ". "}
              {doc.data().name + " " + doc.data().lastName}
              {"  "}
              <Text style={{ fontSize: 17, color: "red" }}>
                L. {doc.data().payForHour * doc.data().totalHours}
              </Text>
            </Text>
          );
        }
      );

      const showPlowWorkers = this.state.plowPayRollWorkers.map(
        (doc, index) => {
          return (
            <Text key={index} style={{ fontSize: 17 }}>
              {index + 1 + ". "}
              {doc.data().name + " " + doc.data().lastName}{" "}
              <Text style={{ fontSize: 17, color: "red" }}>
                L. {doc.data().dayWorked * doc.data().payDay}
              </Text>
            </Text>
          );
        }
      );

      const showPayRollNutrientsWorkers = this.state.nutrientsPayRollWorkers.map(
        (doc, index) => {
          return (
            <Text key={index} style={{ fontSize: 17 }}>
              {index + 1 + ". "}
              {doc.data().name + " " + doc.data().lastName}{" "}
              <Text style={{ fontSize: 17, color: "red" }}>
                L. {doc.data().dayWorked * doc.data().payDay}
              </Text>
            </Text>
          );
        }
      );
      const showPayRollNutrientsAlkalization = this.state.nutrientsPayRollAlkalization.map(
        (doc, index) => {
          return (
            <Text key={index} style={{ fontSize: 17, color: "red" }}>
              {index + 1 + ". "}
              L.{" "}
              {this.getAreaOnMeters() * doc.data().price * doc.data().quantity}
            </Text>
          );
        }
      );

      return (
        <ScrollView style={styles.container}>
          <Text
            style={{
              fontWeight: "600",
              fontSize: 20,
              textAlign: "center",
              color: "red",
              width: "100%"
            }}
          >
            COSTOS PREPARACIÓN DE SUELO
          </Text>
          <Card style={styles.cardStyle}>
            <Text style={styles.especie}>Mano de obra Control Maleza</Text>
            <CardItem>
              <Body>
                {showPayRollWorkers}
                <Text style={{ fontSize: 17, marginLeft: "5%" }}>
                  Total :{" "}
                  <Text
                    style={{ fontSize: 17, color: "red", fontWeight: "bold" }}
                  >
                    L. {totalPayRoll}
                  </Text>
                </Text>
                <Text style={styles.especie}>Costos químicos</Text>
              </Body>
            </CardItem>

            <CardItem footer>
              <Text style={{ fontSize: 25 }}>
                Costo total: L.{" "}
                <Text style={{ color: "red", fontSize: 25 }}>
                  {totalPayRoll}
                </Text>
              </Text>
            </CardItem>
          </Card>

          <Card style={styles.cardStyle}>
            <Text style={styles.especie}>Mano de obra Arado</Text>
            <CardItem>
              <Body>
                {showPlowWorkers}
                <Text
                  style={{ fontSize: 17, marginLeft: "5%", marginBottom: 15 }}
                >
                  Total :{" "}
                  <Text
                    style={{ fontSize: 17, color: "red", fontWeight: "bold" }}
                  >
                    L. {totalPayRollPlow}
                  </Text>
                </Text>
                <Text style={styles.especie}>Costo chapulín</Text>
                {showPayRollChapulin}
              </Body>
            </CardItem>
            <Text style={{ fontSize: 17, marginLeft: "5%" }}>
              Total :{" "}
              <Text style={{ fontSize: 17, color: "red", fontWeight: "bold" }}>
                L. {totalpayRollChapulin}
              </Text>
            </Text>
            <CardItem footer>
              <Text style={{ fontSize: 25 }}>
                Costo Total: L.{" "}
                <Text style={{ color: "red", fontSize: 25 }}>
                  {totalPayRollPlow + totalpayRollChapulin}
                </Text>
              </Text>
            </CardItem>
          </Card>

          <Card style={styles.cardStyle}>
            <Text style={styles.especie}>Mano de obra Nutrientes</Text>
            <CardItem>
              <Body>
                {showPayRollNutrientsWorkers}
                <Text
                  style={{ fontSize: 17, marginLeft: "5%", marginBottom: 15 }}
                >
                  Total :{" "}
                  <Text
                    style={{ fontSize: 17, color: "red", fontWeight: "bold" }}
                  >
                    L. {nutrientsTotalPayRollWorkers}
                  </Text>
                </Text>
                <Text style={styles.especie}>Costo Alcalinizacion</Text>
                {showPayRollNutrientsAlkalization}
              </Body>
            </CardItem>
            <Text style={{ fontSize: 17, marginLeft: "5%" }}>
              Total :{" "}
              <Text style={{ fontSize: 17, color: "red", fontWeight: "bold" }}>
                L. {nutrientsTotalPayRollAlkalization}
              </Text>
            </Text>
            <CardItem footer>
              <Text style={{ fontSize: 25 }}>
                Costo Total: L.
                <Text style={{ color: "red", fontSize: 25 }}>
                  {nutrientsTotalPayRollWorkers +
                    nutrientsTotalPayRollAlkalization}
                </Text>
              </Text>
            </CardItem>
          </Card>

          <Card style={styles.cardStyle}>
            <CardItem header>
              <Text style={styles.especie}>COSTO TOTAL:</Text>
            </CardItem>
            <CardItem>
              <Body>
                <Text
                  style={{
                    width: "100%",
                    textAlign: "center",
                    fontSize: 30,
                    fontWeight: "bold",
                    color: "red"
                  }}
                >
                  L.{" "}
                  {totalPayRollPlow +
                    totalPayRoll +
                    totalpayRollChapulin +
                    nutrientsTotalPayRollWorkers +
                    nutrientsTotalPayRollAlkalization}
                </Text>
              </Body>
            </CardItem>
          </Card>

          <Button
            success
            onPress={() => {
              this.props.navigation.navigate("soilHome");
            }}
          >
            <Text
              style={{
                width: "100%",
                textAlign: "center"
              }}
            >
              <Icon
                type="MaterialIcons"
                name="arrow-back"
                style={{ color: "#fff" }}
              />
            </Text>
          </Button>
        </ScrollView>
      );
    }
  }
}

const styles = StyleSheet.create({
  button: {
    width: 90,
    marginRight: 2,
    fontSize: 12,
    textAlign: "center"
  },
  iconStyle: {
    fontSize: 40,
    color: "#fff"
  },
  container: {
    marginLeft: "2%",
    marginRight: "2%",
    marginTop: "10%",
    flex: 1
  },
  especie: {
    fontWeight: "600",
    fontSize: 20,
    textAlign: "center",
    color: "#721A98",
    width: "100%"
  },
  data: {
    fontWeight: "500",
    fontSize: 18,
    color: "#11B000",
    width: "100%"
  },
  labels: {
    fontWeight: "600",
    fontSize: 18,
    color: "#000",
    width: "100%"
  },
  area: {
    fontWeight: "600",
    fontSize: 25,
    color: "#000",
    width: "100%"
  },
  dataArea: {
    fontWeight: "600",
    fontSize: 25,
    color: "red",
    width: "100%"
  }
});
