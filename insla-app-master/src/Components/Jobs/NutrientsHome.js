import React, { Component } from "react";
import { View, Text, Alert, StyleSheet, ScrollView } from "react-native";
import { fs, firebase } from "../Firebase/config";

import SvgUri from "react-native-svg-uri";

import {
  Header,
  Left,
  Body,
  Right,
  Title,
  Form,
  Icon,
  Button,
  Label,
  Item,
  Input,
  Spinner,
  Fab,
  Tab,
  Tabs,
  Card,
  CardItem,
  Container,
  ListItem,
  List,
  Thumbnail,
  Row
} from "native-base";

export default class NutrientsHome extends Component {
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
      listWorkersNutrients: [],
      listAlkalization: [],
      listAcidification: [],
      listMicroMacroNutrients: [],
      Loaded: false,
      preloader: false
    };
  }
  componentDidMount() {
    fs.collection("soilNutrients")
      .where("idEstimation", "==", this.state.estimation.id)
      .get()
      .then(query => {
        query.forEach(doc => {
          this.setState({
            listWorkersNutrients: [...this.state.listWorkersNutrients, doc]
          });
        });
      })
      .then(() => {
        fs.collection("soilAlkalization")
          .where("idEstimation", "==", this.state.estimation.id)
          .get()
          .then(query => {
            query.forEach(doc => {
              this.setState({
                listAlkalization: [...this.state.listAlkalization, doc]
              });
            });
          })
          .then(() => {
            fs.collection("soilAcidification")
              .where("idEstimation", "==", this.state.estimation.id)
              .get()
              .then(query => {
                query.forEach(doc => {
                  this.setState({
                    listAcidification: [...this.state.listAcidification, doc]
                  });
                });
              })
              .then(() => {
                fs.collection("soilMicroMacroNutrients")
                  .where("idEstimation", "==", this.state.estimation.id)
                  .get()
                  .then(query => {
                    query.forEach(doc => {
                      this.setState({
                        listMicroMacroNutrients: [
                          ...this.state.listMicroMacroNutrients,
                          doc
                        ]
                      });
                    });
                  });
                this.setState({
                  Loaded: true
                });
              });
          });
        this.setState({
          Loaded: true
        });
      });
  }
  savew = id => {
    fs.collection("soilNutrients")
      .doc(id)
      .get()
      .then(doc => {
        this.setState({
          listWorkersNutrients: [...this.state.listWorkersNutrients, doc]
        });
      });
  };
  saven = id => {
    fs.collection("soilAlkalization")
      .doc(id)
      .get()
      .then(doc => {
        this.setState({
          listAlkalization: [...this.state.listAlkalization, doc]
        });
      });
  };
  updatew = (id, index) => {
    this.setState({
      listWorkersNutrients: this.state.listWorkersNutrients.filter((e, i) => {
        return i !== index;
      })
    });
    

    fs.collection("soilNutrients")
      .doc(id)
      .get()
      .then(doc => {
        this.setState({
          listWorkersNutrients: [...this.state.listWorkersNutrients, doc]
        });
      });
  };
  updaten = (id, index) => {
    this.setState({
      listAlkalization: this.state.listAlkalization.filter((e, i) => {
        return i !== index;
      })
    });
  };


  deleworkerNutrients = (doc, index) => {
    Alert.alert(
      "Eliminar empleado",
      "¿Esta seguro que desea eliminar este empleado?",
      [
        {
          text: "Cancelar",
          style: "cancelar"
        },
        {
          text: "Aceptar",
          style: "aceptar",
          onPress: () => {
            fs.collection("soilNutrients")
              .doc(doc.id)
              .delete()
              .then(() => {
                this.setState({
                  listWorkersNutrients: this.state.listWorkersNutrients.filter(
                    (e, i) => {
                      return i !== index;
                    }
                  )
                });
              });
          }
        }
      ]
    );
  };

  deleteAlkalization = (doc, index) => {
    Alert.alert(
      "Eliminar Alcalinización",
      "¿Esta seguro que desea eliminar este proceso?",
      [
        {
          text: "Cancelar",
          style: "cancelar"
        },
        {
          text: "Aceptar",
          style: "aceptar",
          onPress: () => {
            fs.collection("soilAlkalization")
              .doc(doc.id)
              .delete()
              .then(() => {
                this.setState({
                  listAlkalization: this.state.listAlkalization.filter(
                    (e, i) => {
                      return i !== index;
                    }
                  )
                });
              });
          }
        }
      ]
    );
  };

  deleteAcidification = (doc, index) => {
    Alert.alert(
      "Eliminar Acidificación",
      "¿Esta seguro que desea eliminar este proceso?",
      [
        {
          text: "Cancelar",
          style: "cancelar"
        },
        {
          text: "Aceptar",
          style: "aceptar",
          onPress: () => {
            fs.collection("soilAcidification")
              .doc(doc.id)
              .delete()
              .then(() => {
                this.setState({
                  listAcidification: this.state.listAcidification.filter(
                    (e, i) => {
                      return i !== index;
                    }
                  )
                });
              });
          }
        }
      ]
    );
  };

  deleteMicroMacroNutrients = (doc, index) => {
    Alert.alert(
      "Eliminar Acidificación",
      "¿Esta seguro que desea eliminar este proceso?",
      [
        {
          text: "Cancelar",
          style: "cancelar"
        },
        {
          text: "Aceptar",
          style: "aceptar",
          onPress: () => {
            fs.collection("soilMicroMacroNutrients")
              .doc(doc.id)
              .delete()
              .then(() => {
                this.setState({
                  listMicroMacroNutrients: this.state.listMicroMacroNutrients.filter(
                    (e, i) => {
                      return i !== index;
                    }
                  )
                });
              });
          }
        }
      ]
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

  render() {
    const { Loaded, estimation } = this.state;

    if (!Loaded) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Spinner color="green" />
        </View>
      );
    } else {
      const showAlkalization = this.state.listAlkalization.map((doc, index) => {
        return (
          <ListItem key={index}>
            <Body>
              <Text note>
                Cantidad de cal: {doc.data().quantity + " Kg/m2 - "}
              </Text>
              <Text note>
                Total:{" "}
                {"L." +
                  this.getAreaOnMeters() *
                    doc.data().price *
                    doc.data().quantity}
              </Text>
            </Body>
            <Right
                style={{
                  display: "flex",
                  justifyContent: "center"
                }}
              >
                <Icon
                  type="MaterialIcons"
                  name="edit"
                  style={{ color: "black", fontSize: 30 }}
                  onPress={() => {
                    this.props.navigation.navigate("addAlkanization", {
                      doc: doc,
                      action: "edit",
                      estimation: this.state.estimation,
                      index: index,
                      update: this.updaten
                    });
                  }}
                />
              </Right>
            <Right
              style={{
                display: "flex",
                justifyContent: "center"
              }}
            >
              <Icon
                type="MaterialIcons"
                name="delete"
                style={{ color: "red", fontSize: 25 }}
                onPress={() => {
                  this.deleteAlkalization(doc, index);
                }}
              />
            </Right>
          </ListItem>
        );
      });
      const showEmployeesNutrients = this.state.listWorkersNutrients.map(
        (doc, index) => {
          return (
            <ListItem avatar key={index}>
              <Left>
                <Thumbnail
                  source={require("../../../assets/perfilEmpleado.png")}
                />
              </Left>
              <Body>
                <Text>{doc.data().name + " " + doc.data().lastName}</Text>
                <Text note>
                  {doc.data().id.substr(0, 4) +
                    "-" +
                    doc.data().id.substr(4, 4) +
                    "-" +
                    doc.data().id.substr(8, 13)}
                </Text>
                <Text note>
                  {""}Total: L.{doc.data().payDay * doc.data().dayWorked}
                </Text>
              </Body>
              <Right
                style={{
                  display: "flex",
                  justifyContent: "center"
                }}
              >
                <Icon
                  type="MaterialIcons"
                  name="edit"
                  style={{ color: "black", fontSize: 30 }}
                  onPress={() => {
                    this.props.navigation.navigate("UpdateWorkerNutrients", {
                      empleado: doc,
                      item: doc,
                      estimacion: this.state.estimation,
                      index: index,
                      update: this.updatew
                    });
                  }}
                />
              </Right>
              <Right
                style={{
                  display: "flex",
                  justifyContent: "center"
                }}
              >
                <Icon
                  type="MaterialIcons"
                  name="delete"
                  style={{ color: "red", fontSize: 30 }}
                  onPress={() => {
                    this.deleworkerNutrients(doc, index);
                  }}
                />
              </Right>
            </ListItem>
          );
        }
      );

      return (
        <View style={styles.container}>
          <Header style={styles.headerStyle}>
            <Left>
              <Icon
                type="MaterialIcons"
                name="arrow-back"
                style={{
                  fontSize: 40,
                  color: "#fff",
                  padding: 5
                }}
                onPress={() => this.props.navigation.navigate("soilHome")}
              />
            </Left>
            <Body>
              <Title style={styles.titleStyle}>NUTRIENTES</Title>
            </Body>
            <Right></Right>
          </Header>

          <Tabs>
            <Tab
              style={{
                height: "100%"
              }}
              heading="MANO OBRA"
              activeTextStyle={{ color: "#077A65" }}
            >
              <Container
                style={{
                  flex: 3,
                  marginRight: 3
                }}
              >
                <List>{showEmployeesNutrients}</List>
              </Container>
              <Fab
                onPress={() =>
                  this.props.navigation.navigate("employeesNutrientes", {
                    estimation: this.state.estimation,
                    save: this.savew
                  })
                }
                direction="up"
                style={{
                  backgroundColor: "#077A65",
                  padding: 0,
                  margin: 0,
                  position: "absolute"
                }}
                position="bottomRight"
              >
                <Icon type="FontAwesome5" name="plus" />
              </Fab>
            </Tab>
            <Tab
              style={{
                height: "100%"
              }}
              heading="PH ALTO"
              activeTextStyle={{ color: "#077A65" }}
            >
              <Container
                style={{
                  marginLeft: 3,
                  marginRight: 3
                }}
              >
                <ScrollView>
                  <Card>
                    <CardItem header>
                      <Text
                        style={{
                          width: "100%",
                          fontSize: 20,
                          fontWeight: "bold",
                          textAlign: "center"
                        }}
                      >
                        ALCALINIZACIÓN
                      </Text>
                    </CardItem>
                    <CardItem body>
                      <Text>
                        Consiste en agregar Cal al suelo para nivelar el PH del
                        mismo
                      </Text>
                    </CardItem>
                  </Card>
                  <List>{showAlkalization}</List>
                </ScrollView>
              </Container>
              <Fab
                onPress={() =>
                  this.props.navigation.navigate("addAlkanization", {
                    save: this.saven,
                    action: "",
                    estimation: this.state.estimation,

                  })
                }
                direction="up"
                style={{
                  backgroundColor: "#077A65",
                  padding: 0,
                  margin: 0,
                  position: "absolute"
                }}
                position="bottomRight"
              >
                <Icon type="FontAwesome5" name="plus" />
              </Fab>
            </Tab>
          </Tabs>
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
  titleStyle: {
    color: "#fff"
  },
  container: {
    flexDirection: "column",
    height: "100%"
  },
  headerStyle: {
    borderBottomColor: "#fff",
    backgroundColor: "#077A65",
    height: 80
  },
  iconStyle: {
    fontSize: 40,
    color: "#fff"
  },

  buttonStyle: {
    backgroundColor: "#077A65",
    marginTop: 30,
    marginLeft: 10,
    marginRight: 10,
    width: "70%"
  },
  labelStyle: {
    marginTop: 8,
    marginLeft: 10,
    marginRight: 10
  },
  itemStyle: {
    height: 50,
    //marginLeft: 10,
    //marginRight: 10,
    top: -10,
    borderWidth: 1,
    borderColor: "#077A65",
    //backgroundColor: "#7fff00",
    width: "25%"
  }
});
