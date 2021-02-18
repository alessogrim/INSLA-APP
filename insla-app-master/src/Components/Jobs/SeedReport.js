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

export default class SeedReport extends Component {
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
      payRollWorkersSeed: [],
      payRollChapulinSeed: [],
      workersTotalPayRoll: 0,
      chapulinTotalPayRoll: 0,
      seed: {},
      Loaded: false,
      seedFlag: false
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
    fs.collection("seedWorkers")
      .where("idEstimation", "==", estimation.id)
      .get()
      .then(query => {
        query.forEach(doc => {
          this.setState({
            payRollWorkersSeed: [...this.state.payRollWorkersSeed, doc],
            workersTotalPayRoll:
              this.state.workersTotalPayRoll +
              doc.data().dayWorked * doc.data().payDay
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
                payRollChapulinSeed: [...this.state.payRollChapulinSeed, doc],
                chapulinTotalPayRoll:
                  this.state.chapulinTotalPayRoll +
                  doc.data().payForHour * doc.data().totalHours
              });
            });
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
  }

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

  render() {
    const {
      Loaded,
      payRollChapulinSeed,
      payRollWorkersSeed,
      workersTotalPayRoll,
      chapulinTotalPayRoll,
      seed,
      estimation
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
      const showPayRollWorkers = payRollWorkersSeed.map((doc, index) => {
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

      const showPayRollChapulin = payRollChapulinSeed.map((doc, index) => {
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
      });

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
            COSTOS SIEMBRA
          </Text>
          <Card style={styles.cardStyle}>
            <Text style={styles.especie}>Mano de obra artesanal</Text>
            <CardItem>
              <Body>
                {showPayRollWorkers}
                <Text style={{ fontSize: 17, marginLeft: "5%" }}>
                  Total :{" "}
                  <Text
                    style={{ fontSize: 17, color: "red", fontWeight: "bold" }}
                  >
                    L. {workersTotalPayRoll}
                  </Text>
                </Text>
                <Text style={styles.especie}>Costo uso Chapulín</Text>
                {showPayRollChapulin}
                <Text style={{ fontSize: 17, marginLeft: "5%" }}>
                  Total :{" "}
                  <Text
                    style={{ fontSize: 17, color: "red", fontWeight: "bold" }}
                  >
                    L. {chapulinTotalPayRoll}
                  </Text>
                </Text>
              </Body>
            </CardItem>
          </Card>
          <Card style={styles.cardStyle}>
            <Text style={styles.especie}>Costo Siembra semilla</Text>
            <CardItem>
              <Body>
                <Text style={{ fontSize: 17, marginLeft: "5%" }}>
                  El área a sembrar es:{" "}
                  <Text
                    style={{ fontSize: 17, color: "red", fontWeight: "bold" }}
                  >
                    {this.getAreaOnMeters() + " "}m
                    <Text
                      style={{ fontSize: 13, color: "red", fontWeight: "bold" }}
                    >
                      2
                    </Text>
                  </Text>
                </Text>

                <Text style={{ fontSize: 17, marginLeft: "5%" }}>
                  Usted necesita:{" "}
                  <Text
                    style={{ fontSize: 17, color: "red", fontWeight: "bold" }}
                  >
                    {this.getTotalSeeds()} semillas
                  </Text>
                </Text>

                <Text style={{ fontSize: 17, marginLeft: "5%" }}>
                  El peso total es:{" "}
                  <Text
                    style={{ fontSize: 17, color: "red", fontWeight: "bold" }}
                  >
                    Lb. {this.totalPound()}
                  </Text>
                </Text>

                <Text style={{ fontSize: 25, marginLeft: "5%" }}>
                  Total :{" "}
                  <Text
                    style={{ fontSize: 25, color: "red", fontWeight: "bold" }}
                  >
                    L. {this.totalGlobalSeeds()}
                  </Text>
                </Text>
              </Body>
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
                  {workersTotalPayRoll +
                    chapulinTotalPayRoll +
                    this.totalGlobalSeeds()}
                </Text>
              </Body>
            </CardItem>
          </Card>

          <Button
            success
            onPress={() => {
              this.props.navigation.navigate("seedHome");
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
