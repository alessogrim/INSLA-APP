import React, { Component } from "react";
import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Text,
  Body,
  Spinner,
  Left,
  Right,
  Icon,
  Title
} from "native-base";
import { StyleSheet, View } from "react-native";
import { fs, firebase } from "../Firebase/config";

export default class ProductionDetails extends Component {
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

  componentDidMount() {
    const { production } = this.state;
    fs.collection("corrales")
      .doc(production.data().idCorral)
      .get()
      .then(doc => {
        this.setState({
          corral: doc
        });
      })
      .then(() => {
        this.setState({
          Loaded: true
        });
      });
  }

  constructor(props) {
    super(props);
    this.state = {
      production: this.props.navigation.state.params,
      corral: {},
      Loaded: false
    };
  }
  render() {
    const { Loaded, corral, production } = this.state;
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
              height: 80,
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
                  fontSize: 38,
                  marginLeft: 10,
                  color: "#fff"
                }}
                onPress={() => this.props.navigation.goBack()}
              />
            </Left>
            <Body>
              <Title style={{ color: "#fff", fontSize: 18 }}>DETALLES</Title>
            </Body>
            <Right />
          </Header>
          <Content padder>
            <Card>
              <CardItem header bordered>
                <Text style={{ fontSize: 17 }}>
                  Corral asignado:{" "}
                  <Text
                    style={{ fontSize: 17, textAlign: "center", width: "100%" }}
                  >
                    {corral.data().name}
                  </Text>
                </Text>
              </CardItem>
              <CardItem bordered>
                <Body>
                  <Text style={{ fontWeight: "500" }}>
                    Capacidad:{" "}
                    <Text style={{ color: "red" }}>
                      {corral.data().capacity + " animales"}
                    </Text>{" "}
                  </Text>
                  <Text style={{ fontWeight: "500" }}>
                    Area:{" "}
                    <Text style={{ color: "red" }}>
                      {corral.data().area + " metros cuadrados"}
                    </Text>{" "}
                  </Text>
                </Body>
              </CardItem>
              <CardItem header bordered>
                <Text style={{ fontSize: 17 }}>
                  Procción:{" "}
                  <Text
                    style={{ fontSize: 17, textAlign: "center", width: "100%" }}
                  >
                    {" "}
                    {production.data().name}
                  </Text>
                </Text>
              </CardItem>
              <CardItem bordered>
                <Body>
                  <Text style={{ fontWeight: "500" }}>
                    Total pollos:{" "}
                    <Text style={{ color: "red" }}>
                      {production.data().totalChickens + " pollos"}
                    </Text>{" "}
                  </Text>
                  <Text style={{ fontWeight: "500" }}>
                    Cantidad de muertes:{" "}
                    <Text style={{ color: "red" }}>
                      {production.data().deaths + " pollos"}
                    </Text>{" "}
                  </Text>
                </Body>
              </CardItem>
              <CardItem header bordered>
                <Text style={{ fontSize: 17, fontWeight: "500" }}>ETAPAS</Text>
              </CardItem>
              <CardItem bordered style={{ paddingBottom: 30 }}>
                <Body>
                  <Text style={{ fontWeight: "500" }}>
                    Inicial:{" "}
                    <Text style={{ color: "red" }}>
                      {production.data().initialStage
                        ? "Terminada"
                        : "En proceso"}
                    </Text>{" "}
                  </Text>
                  <Text style={{ fontWeight: "500" }}>
                    Crecimiento:{" "}
                    <Text style={{ color: "red" }}>
                      {production.data().growthStage
                        ? "Terminada"
                        : "En proceso"}
                    </Text>{" "}
                  </Text>
                  <Text style={{ fontWeight: "500" }}>
                    Final:{" "}
                    <Text style={{ color: "red" }}>
                      {production.data().finalStage
                        ? "Terminada"
                        : "En proceso"}
                    </Text>{" "}
                  </Text>
                </Body>
              </CardItem>
            </Card>
          </Content>
        </Container>
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
