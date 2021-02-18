import React, { Component } from "react";
import { View, StyleSheet, Image, ScrollView, Alert } from "react-native";
import {
  Header,
  Left,
  Text,
  Body,
  Icon,
  Fab,
  Spinner,
  Title,
  Right,
  Card,
  CardItem,
  ListItem,
  CheckBox,
  Container
} from "native-base";
import { firebase, fs } from "../Firebase/config";
import { TouchableOpacity } from "react-native-gesture-handler";
import fruitsImage from "../../../assets/production/frutas.png";

export default class Estimations extends Component {
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
      id: "",
      active: true,
      text: "",
      farm: this.props.navigation.state.params,
      estimations: [],
      Loaded: false,
      counterId: 0
    };
  }

  componentDidMount() {
    const { farm } = this.state;
    fs.collection("Estimations")
      .where("idFarm", "==", farm.id)
      .get()
      .then(query => {
        query.forEach(doc => {
          let id = doc.data().id.substr(4);
          if (parseInt(id) > this.state.counterId) {
            this.setState({
              counterId: parseInt(id)
            });
          }
          this.setState({
            estimations: [...this.state.estimations, doc]
          });
        });
      })
      .then(() => {
        this.setState({
          counterId: this.state.counterId + 1
        });
      })
      .then(() => {
        this.setState({
          id: "EST-" + this.state.counterId,
          Loaded: true
        });
      });
  }

  // eliminar una estimacion
  removeFarm = (doc, index) => {
    Alert.alert(
      "Borrar Finca",
      "¿Esta seguro que desea borrar esta Finca?",
      [
        {
          text: "Cancelar",
          style: "Cancelar"
        },
        {
          text: "Aceptar",
          onPress: () => {
            fs.collection("Estimations")
              .doc(doc.id)
              .delete()
              .then(() =>
                this.setState({
                  estimations: this.state.estimations.filter((e, i) => {
                    return i !== index;
                  })
                })
              );
          }
        }
      ],
      { cancelable: false }
    );
  };

  save = id => {
    fs.collection("Estimations")
      .doc(id)
      .get()
      .then(doc => {
        this.setState({
          estimations: [...this.state.estimations, doc]
        });
      })
      .then(() => {
        let id = parseInt(this.state.id.substr(4));
        this.setState({
          counterId: this.state.counterId + 1
        });
      })
      .then({
        id: "EST-" + this.state.counterId
      });
  };

  //calcular el total de plantas

  plantas = doc => {
    return doc.data().Area / doc.data().Distancia / doc.data().Surco;
  };

  //actualizar el estado del check de suelo
  updateSuelo = id => {
    fs.collection("Estimations")
      .doc(id)
      .update({
        soilCheck: true
      });
  };

  //actualizar el estado del check siembra
  updateSiembra = id => {
    fs.collection("Estimations")
      .doc(id)
      .update({
        seedCheck: true
      });
  };

  // actualizar el estado del check cosecha
  updateCosecha = id => {
    fs.collection("Estimations")
      .doc(id)
      .update({
        harvestCheck: true
      });
  };

  //Total de quintales
  quintales = doc => {
    return (doc.data().weightPlant * this.plantas(doc)) / 100;
  };

  // total estimado
  total = doc => {
    return this.quintales(doc) * doc.data().estimatedPrice * 100;
  };

  update = (id, index) => {
    this.setState({
      estimations: this.state.estimations.filter((e, i) => {
        return i !== index;
      })
    });

    fs.collection("Estimations")
      .doc(id)
      .get()
      .then(doc => {
        this.setState({
          estimations: [...this.state.estimations, doc]
        });
      });
  };

  render() {
    const { Loaded } = this.state;

    if (!Loaded) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Spinner color="green" />
        </View>
      );
    } else {
      //-----------------------initial map estimations
      const showEstimations = this.state.estimations.map((doc, index) => {
        return (
          <Card style={{ margin: 10 }} key={index}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("Labores", {
                  estimation: doc,
                  update: this.update,
                  index: index
                });
              }}
            >
              <CardItem header>
                <Left>
                  <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                    {" "}
                    {doc.data().Tipo + ": "}
                    <Text style={{ color: "red", fontSize: 18 }}>
                      {doc.data().Especie}
                    </Text>
                  </Text>
                </Left>
              </CardItem>
              <CardItem cardBody style={{ flex: 1, height: 350 }}>
                <View style={{ flex: 60 }}>
                  <Text
                    style={{
                      color: "red",
                      marginLeft: 10,
                      fontWeight: "bold"
                    }}
                  >
                    ID:{"\n "}
                    <Text
                      style={{
                        fontSize: 25,
                        fontWeight: "500",
                        marginLeft: 20
                      }}
                    >
                      {doc.data().id}
                    </Text>
                  </Text>
                  <Text
                    style={{
                      color: "red",
                      marginLeft: 10,
                      fontWeight: "bold"
                    }}
                  >
                    Total plantas:{"\n "}
                    <Text
                      style={{
                        fontSize: 25,
                        fontWeight: "500",
                        marginLeft: 20
                      }}
                    >
                      {this.plantas(doc).toFixed(0)}
                    </Text>
                  </Text>
                  <Text
                    style={{
                      color: "red",
                      marginLeft: 10,
                      fontWeight: "bold"
                    }}
                  >
                    Total quintales:{"\n"}
                    <Text
                      style={{
                        fontSize: 25,
                        fontWeight: "500",
                        marginLeft: 20
                      }}
                    >
                      {this.quintales(doc).toFixed(2)}
                    </Text>
                  </Text>
                  <Text
                    style={{
                      color: "red",
                      marginLeft: 10,
                      fontWeight: "bold"
                    }}
                  >
                    Total L. {"\n"}
                    <Text
                      style={{
                        fontSize: 25,
                        fontWeight: "600",
                        marginLeft: 20
                      }}
                    >
                      {this.total(doc).toFixed(2)}
                    </Text>
                  </Text>
                  <Text
                    style={{
                      marginLeft: 20,
                      fontSize: 15,
                      color: "#CDCDCDCD"
                    }}
                  >
                    {doc.data().location}
                  </Text>
                  <ListItem style={{ width: "80%", margin: 0 }}>
                    <CheckBox checked={doc.data().soilCheck} />
                    <Body>
                      <Text style={{ color: "green" }}>Suelo</Text>
                    </Body>
                  </ListItem>

                  <ListItem style={{ width: "80%" }}>
                    <CheckBox checked={doc.data().seedCheck} />
                    <Body>
                      <Text style={{ color: "green" }}>Siembra</Text>
                    </Body>
                  </ListItem>

                  <ListItem style={{ width: "80%" }}>
                    <CheckBox checked={doc.data().harvestCheck} />
                    <Body>
                      <Text style={{ color: "green" }}>Cosecha</Text>
                    </Body>
                  </ListItem>
                </View>
                <View
                  style={{
                    flex: 40,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Image
                    source={fruitsImage}
                    style={{
                      marginRight: 15,
                      borderRadius: 75,
                      width: 150,
                      height: 150
                    }}
                  />
                </View>
              </CardItem>
            </TouchableOpacity>
            <CardItem footer>
              <Left>
                <Icon
                  type="MaterialIcons"
                  name="delete"
                  style={{ marginRight: 15, color: "red" }}
                  onPress={() => this.removeFarm(doc, index)}
                />
                <Icon
                  type="MaterialIcons"
                  name="edit"
                  onPress={() => {
                    doc.data().soilCheck
                      ? Alert.alert(
                          "Actualizar estimacón",
                          "Las estimaciones que tienen asignadas labores no pueden ser actualizadas"
                        )
                      : this.props.navigation.navigate("updateEstimations", {
                          estimation: doc,
                          update: this.update,
                          farm: this.state.farm
                        });
                  }}
                />
                <Icon
                  type="MaterialIcons"
                  name="library-books"
                  style={{ margin: 15 }}
                  onPress={() => {
                    this.props.navigation.navigate("cardDetails", doc);
                  }}
                />
              </Left>
            </CardItem>
          </Card>
        );
      });

      //------------------- end map on estimations

      return (
        <View style={styles.container}>
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
                onPress={() => this.props.navigation.navigate("rubro")}
              />
            </Left>
            <Body>
              <Title style={{ color: "#fff", fontSize: 15 }}>
                ESTIMACIONES
              </Title>
            </Body>
            <Right />
          </Header>
          <Container>
            <ScrollView>{showEstimations}</ScrollView>
          </Container>

          <Fab
            active={this.state.active}
            direction="up"
            style={{ backgroundColor: "#077A65", padding: 0, margin: 0 }}
            position="bottomRight"
            onPress={() => this.setState({ active: !this.state.active })}
            onPress={() => {
              this.props.navigation.navigate("addEstimations", {
                farm: this.state.farm,
                save: this.save,
                id: this.state.id
              });
            }}
          >
            <Icon type="FontAwesome5" name="plus" />
          </Fab>
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
