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

export default class expenseReport extends Component {
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
      listLabores: [],
      listMateriales: [],
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
      totalCost: 0,
      materialTemp: 0,
      transport: 0,
      Loaded: false
    };
  }

  componentDidMount() {
    fs.collection("harvestWorkers")
      .where("idEstimation", "==", this.state.estimation.id)
      .get()
      .then(query => {
        query.forEach(doc => {
          this.setState({
            listLabores: [...this.state.listLabores, doc],
            totalPayRoll:
              this.state.totalPayRoll + doc.data().transport + (doc.data().payDay * doc.data().dayWorked)
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
                listMateriales: [...this.state.listMateriales, doc],
                totalCost:
                  this.state.totalCost + (doc.data().price * doc.data().quantity)
                });
            });
          });
        this.setState({
          Loaded: true
        });
      });
  }
  render() {
    const {
      Loaded,
      totalPayRoll,
      totalCost,
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
      const showLabores = this.state.listLabores.map((doc, index) => {
        return (
          <Text key={index} style={{ fontSize: 17 }}>
            {"Transporte:"+doc.data().transport+"\n"}
            {"Dias:"+doc.data().dayWorked+"\n"}
            {"Pago por dia:"}
            <Text style={{ fontSize: 17, color: "black" }}>
              L. {doc.data().payDay+"\n"}
            </Text>
            <Text style={{ fontSize: 17, marginLeft: "5%" }}>
              Costo :{" "}
              <Text style={{ fontSize: 17, color: "red", fontWeight: "bold" }}>
                L. {(doc.data().payDay*doc.data().dayWorked)}
              </Text>
            </Text>
          </Text>
        );
      });

      const showMateriales = this.state.listMateriales.map(
        (doc, index) => {
          return (
            <Text key={index} style={{ fontSize: 17 }}>
              {index + 1 + ". "}
              {"Material: "+doc.data().material+"\n"}
              {"ID: "+ doc.data().idGlobal+"\n"}
              {"Cantidad: "+doc.data().quantity+"\n"}
              {"Precio: "}
              <Text style={{ fontSize: 17, color: "red" }}>
                L. {doc.data().price}
              </Text>
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
            COSTOS COSECHA
          </Text>
          <Card style={styles.cardStyle}>
            <Text style={styles.especie}>Mano de obra Cosecha</Text>
            <CardItem>
              <Body>
                {showLabores}
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
            <Text style={styles.especie}>Costos Materiales</Text>
            <CardItem>
              <Body>
                {showMateriales}
              </Body>
            </CardItem>
            <CardItem footer>
              <Text style={{ fontSize: 25 }}>
                Costo Total: L.{" "}
                <Text style={{ color: "red", fontSize: 25 }}>
                  {totalCost}
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
                  {totalCost +
                    totalPayRoll}
                </Text>
              </Body>
            </CardItem>
          </Card>

          <Button
            success
            onPress={() => {
              this.props.navigation.navigate("harvestHome");
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

