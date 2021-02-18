import React, { Component } from "react";
import {
  Container,
  Body,
  Text,
  Button,
  Card,
  CardItem,
  Icon,
  Spinner
} from "native-base";
import { StyleSheet, ScrollView, View, Alert } from "react-native";

export default class CardDetails extends Component {
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
      Loaded: false
    };
  }

  plantas = doc => {
    return doc.data().Area / doc.data().Distancia / doc.data().Surco;
  };
  //Total de quintales
  quintales = doc => {
    return (doc.data().weightPlant * this.plantas(doc)) / 100;
  };

  // total estimado
  total = doc => {
    return this.quintales(doc) * doc.data().estimatedPrice * 100;
  };

  render() {
    const { Loaded, estimation } = this.state;
    return (
      <ScrollView style={styles.container}>
        <Card style={styles.cardStyle}>
          <CardItem header>
            <Text style={styles.especie}>
              ESTIMACIÓN DE {estimation.data().Tipo.toUpperCase()}
            </Text>
          </CardItem>
          <CardItem>
            <Body>
              <Text style={styles.area}>ÁREA A SEMBRAR:</Text>
              <Text style={styles.dataArea}>
                {estimation.data().Area} {estimation.data().Medidas}
              </Text>
              <Text style={styles.area}>TOTAL PLANTAS: </Text>
              <Text style={styles.dataArea}>{this.plantas(estimation)}</Text>
              <Text style={styles.area}>TOTAL QUINTALES:</Text>
              <Text style={styles.dataArea}>{this.quintales(estimation)}</Text>
              <Text style={styles.area}>GANANCIA TOTAL ESTIMADA: </Text>
              <Text style={styles.dataArea}>L. {this.total(estimation)}</Text>
              <Text style={styles.labels}>
                Tipo de Cultivo :{"  "}
                <Text style={styles.data}>{estimation.data().Tipo}</Text>
              </Text>
              <Text style={styles.labels}>
                Especie :{"  "}
                <Text style={styles.data}>{estimation.data().Especie}</Text>
              </Text>
              <Text style={styles.labels}>
                Nombre Científico:{"  "}
                <Text style={styles.data}>{estimation.data().nCientifico}</Text>
              </Text>
              <Text style={styles.labels}>
                Variedad :{"  "}
                <Text style={styles.data}>{estimation.data().Variedad}</Text>
              </Text>
              <Text style={styles.labels}>
                Ubicación siembra:{"  "}
                <Text style={styles.data}>{estimation.data().location} </Text>
              </Text>
              <Text style={styles.labels}>
                Propagación:{"  "}
                <Text style={styles.data}>{estimation.data().Propagacion}</Text>
              </Text>
              <Text style={styles.labels}>
                Ciclo de Producción:{"  "}
                <Text style={styles.data}>{estimation.data().Ciclo}</Text>
              </Text>
              <Text style={styles.labels}>
                PH de suelo ideal:{"  "}
                <Text style={styles.data}>{estimation.data().PH}</Text>
              </Text>
              <Text style={styles.labels}>
                Tipo de riego:{"  "}
                <Text style={styles.data}>{estimation.data().Riego}</Text>
              </Text>
              <Text style={styles.labels}>
                Altitud:{"  "}
                <Text style={styles.data}>
                  {estimation.data().Altitud} Metros
                </Text>
              </Text>
              <Text style={styles.labels}>
                Altura de planta:{"  "}
                <Text style={styles.data}>
                  {estimation.data().Altura} Metros
                </Text>
              </Text>
              <Text style={styles.labels}>
                Distancia entre semilla:{"  "}
                <Text style={styles.data}>
                  {estimation.data().Distancia} metros
                </Text>
              </Text>
              <Text style={styles.labels}>
                Espacio entre surco:{"  "}
                <Text style={styles.data}>
                  {estimation.data().Surco} metros
                </Text>
              </Text>
              <Text style={styles.labels}>
                peso planta:{"  "}
                <Text style={styles.data}>
                  {estimation.data().weightPlant} g.
                </Text>
              </Text>
              <Text style={styles.labels}>
                Precio estimado:{"  "}
                <Text style={styles.data}>
                  {"L. " + estimation.data().estimatedPrice} {"\n"}
                </Text>
              </Text>
            </Body>
          </CardItem>
          <CardItem footer>
            <Button
              success
              onPress={() => {
                this.props.navigation.navigate("Estimaciones");
              }}
              style={{ width: "100%" }}
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
          </CardItem>
        </Card>
      </ScrollView>
    );
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
  cardStyle: {},
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
    fontSize: 15,
    color: "#000",
    width: "100%",
    textAlign: "center"
  },
  dataArea: {
    fontWeight: "600",
    fontSize: 25,
    color: "red",
    width: "100%",
    textAlign: "center",
    marginBottom: "3%"
  }
});
