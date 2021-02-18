import React, { Component } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import {
  Header,
  Left,
  Right,
  Body,
  Spinner,
  Title,
  Icon,
  Container,
  Button
} from "native-base";
import { fs, firebase } from "../Firebase/config";
import SvgUri from "react-native-svg-uri";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class RawMaterial extends Component {
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
      farm: this.props.navigation.state.params.farm,
      production: this.props.navigation.state.params.production,
      totalChickens: 0,
      deaths: 0,
      save: false,
      preloader: false,
      maxCapacity: 0,
      rawMaterial: 0,
      productions: {}
    };
  }
  async componentDidMount() {
    const production = await fs
      .collection("productions")
      .doc(this.state.production.id)
      .get();
    this.setState({
      productions: production,
      deaths: production.data().deaths,
      totalChickens: production.data().totalChickens
    });

    fs.collection("corrales")
      .doc(this.state.production.data().idCorral)
      .get()
      .then(corral => {
        this.setState({
          maxCapacity: corral.data().capacity
        });
      })
      .then(() => {
        this.setState({
          Loaded: true
        });
      });
  }

  save = () => {
    if (this.state.totalChickens != 0) {
      this.setState({
        save: true,
        preloader: true
      });
      fs.collection("productions")
        .doc(this.state.production.id)
        .update({
          deaths: this.state.deaths,
          totalChickens: this.state.totalChickens
        })
        .then(() => {
          this.props.navigation.state.params.update(
            this.state.production.id,
            this.props.navigation.state.params.index
          );
          this.props.navigation.goBack();
        });
    } else {
      Alert.alert(
        "Guardar materria prima",
        "La materia prima no puede ser Cero",
        [
          {
            text: "Aceptar",
            onPress: () => {
              this.setState({
                preloader: false,
                save: false
              });
            }
          }
        ]
      );
    }
  };

  render() {
    const { Loaded, farm, production, maxCapacity } = this.state;
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
              backgroundColor: "#077A65"
            }}
          >
            <Left>
              <Icon
                type="MaterialIcons"
                name="arrow-back"
                style={{ color: "#fff", fontSize: 40 }}
                onPress={() => this.props.navigation.goBack()}
              />
            </Left>
            <Body>
              <Title style={{ color: "#fff", fontSize: 19 }}>MATERIA</Title>
            </Body>
            <Right />
          </Header>
          <View style={{ display: "flex", alignItems: "center" }}>
            <Text
              style={{
                marginTop: 20,
                color: "#077A65",
                fontWeight: "600",
                fontSize: 20
              }}
            >
              Materia prima disponible
            </Text>
            <Text
              style={{
                color: "red",
                fontWeight: "600",
                fontSize: 25
              }}
            >
              {this.state.totalChickens + " Pollos"}
            </Text>
            <Text
              style={{
                marginTop: 20,
                color: "#077A65",
                fontWeight: "600",
                fontSize: 20
              }}
            >
              Capacidad maxima del corral:
            </Text>
            <Text
              style={{
                color: "red",
                fontWeight: "600",
                fontSize: 25
              }}
            >
              {this.state.maxCapacity + " Pollos"}
            </Text>

            {/* -------------registrar muertes--------------- */}
            <Text
              style={{
                marginTop: 50,
                color: "red",
                fontWeight: "600",
                fontSize: 25
              }}
            >
              REGISTRAR MUERTES
            </Text>
            <View
              style={{
                marginTop: 20,
                display: "flex",
                flexDirection: "row",
                alignItems: "center"
              }}
            >
              {/**CONTENEDOR DEL CIRCULO */}
              <View
                style={{
                  padding: 5,
                  backgroundColor: "#077A65",
                  borderRadius: 30
                }}
              >
                <Icon
                  type="MaterialIcons"
                  name="remove"
                  style={{
                    fontSize: 40,
                    color: "#fff"
                  }}
                  onPress={() => {
                    if (
                      this.state.deaths != 0 &&
                      this.state.deaths <= this.state.totalChickens
                    ) {
                      this.setState({
                        deaths: this.state.deaths - 1,
                        totalChickens: this.state.totalChickens + 1
                      });
                    }
                  }}
                />
              </View>
              <Text
                style={{
                  marginRight: 20,
                  marginLeft: 20,
                  color: "red",
                  fontWeight: "600",
                  fontSize: 40
                }}
              >
                {this.state.deaths}
              </Text>
              <View
                style={{
                  padding: 5,
                  backgroundColor: "#077A65",
                  borderRadius: 30
                }}
              >
                <Icon
                  type="MaterialIcons"
                  name="add"
                  style={{
                    fontSize: 40,
                    color: "#fff"
                  }}
                  onPress={() => {
                    this.setState({
                      totalChickens: this.state.totalChickens - 1,
                      deaths: this.state.deaths + 1
                    });
                  }}
                />
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
            <View
              style={{
                marginTop: "10%",
                marginBottom: "10%",
                width: "60%"
              }}
            >
              <Button
                style={style.addButton}
                full
                rounded
                success
                disabled={this.state.save}
                onPress={() => this.save()}
              >
                <Text
                  style={{ color: "white", fontSize: 20, fontWeight: "500" }}
                >
                  GUARDAR
                </Text>
              </Button>
            </View>
          </View>
        </Container>
      );
    }
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column"
  },
  addButton: {
    backgroundColor: "#077A65"
  },
  fields: {
    margin: "5%",
    width: "50%",
    flex: 50
  },
  errorValitation: {
    borderColor: "red"
  }
});
