import React, { Component } from "react";
import { View, Text, StyleSheet, Alert, ScrollView } from "react-native";
import {
  Header,
  Left,
  Right,
  Body,
  Spinner,
  Title,
  Icon,
  Tab,
  Tabs,
  Fab,
  Container,
  ListItem,
  Thumbnail,
  Button
} from "native-base";
import { fs, firebase } from "../../Firebase/config";
import SvgUri from "react-native-svg-uri";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class FinalStage extends Component {
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
      workforce_finalStage_chicken_breeding: [],
      chicken_material_finalStage_chicken_breeding: [],
      preloader: false
    };
  }

  componentDidMount() {
    fs.collection("workforce_finalStage_chicken_breeding")
      .where("idProduction", "==", this.state.production.id)
      .get()
      .then(query => {
        query.forEach(doc => {
          this.setState({
            workforce_finalStage_chicken_breeding: [
              ...this.state.workforce_finalStage_chicken_breeding,
              doc
            ]
          });
        });
      })
      .then(() => {
        fs.collection("chicken_material_finalStage_chicken_breeding")
          .where("idProduction", "==", this.state.production.id)
          .get()
          .then(query => {
            query.forEach(doc => {
              this.setState({
                chicken_material_finalStage_chicken_breeding: [
                  ...this.state.chicken_material_finalStage_chicken_breeding,
                  doc
                ]
              });
            });
          });
      })
      .then(() => {
        this.setState({
          Loaded: true
        });
      });
  }
  save = id => {
    fs.collection("workforce_finalStage_chicken_breeding")
      .doc(id)
      .get()
      .then(doc => {
        this.setState({
          workforce_finalStage_chicken_breeding: [
            ...this.state.workforce_finalStage_chicken_breeding,
            doc
          ]
        });
      });
  };

  saveMaterials = id => {
    fs.collection("chicken_material_finalStage_chicken_breeding")
      .doc(id)
      .get()
      .then(doc => {
        this.setState({
          chicken_material_finalStage_chicken_breeding: [
            ...this.state.chicken_material_finalStage_chicken_breeding,
            doc
          ]
        });
      });
  };

  delete = (doc, index) => {
    Alert.alert(
      "Borra",
      "¿Esta seguro que desea borrar esta mano de obra?",
      [
        {
          text: "Cancelar",

          style: "Cancelar"
        },
        {
          text: "Aceptar",
          onPress: () => {
            fs.collection("workforce_finalStage_chicken_breeding")
              .doc(doc.id)
              .delete()
              .then(() => {
                this.setState({
                  workforce_finalStage_chicken_breeding: this.state.workforce_finalStage_chicken_breeding.filter(
                    (e, i) => {
                      return i !== index;
                    }
                  )
                });
              });
          }
        }
      ],
      { cancelable: false }
    );
  };

  deleteMaterials = (doc, index) => {
    Alert.alert(
      "Borrar",
      "¿Esta seguro que desea borrar este Material?",
      [
        {
          text: "Cancelar",

          style: "Cancelar"
        },
        {
          text: "Aceptar",
          onPress: () => {
            fs.collection("chicken_material_finalStage_chicken_breeding")
              .doc(doc.id)
              .delete()
              .then(() => {
                this.setState({
                  chicken_material_finalStage_chicken_breeding: this.state.chicken_material_finalStage_chicken_breeding.filter(
                    (e, i) => {
                      return i !== index;
                    }
                  )
                });
              });
          }
        }
      ],
      { cancelable: false }
    );
  };
  finalStage = () => {
    Alert.alert(
      "Terminar Etapa",
      "¿Esta seguro que desea terminar esta etapa ?",
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
            fs.collection("productions")
              .doc(this.state.production.id)
              .update({
                finalStage: true
              })
              .then(() => {
                this.props.navigation.state.params.update(
                  this.state.production.id,
                  this.props.navigation.state.params.index
                );
              })
              .then(() => {
                fs.collection("corrales")
                  .doc(this.state.production.data().idCorral)
                  .update({
                    taken: false
                  });
              })
              .then(() => {
                this.props.navigation.navigate("ChickenFarming");
              });
          }
        }
      ],
      { cancelable: false }
    );
  };

  update = (id, index) => {
    this.setState({
      workforce_finalStage_chicken_breeding: this.state.workforce_finalStage_chicken_breeding.filter(
        (e, i) => {
          return i !== index;
        }
      )
    });

    fs.collection("workforce_finalStage_chicken_breeding")
      .doc(id)
      .get()
      .then(doc => {
        this.setState({
          workforce_finalStage_chicken_breeding: [
            ...this.state.workforce_finalStage_chicken_breeding,
            doc
          ]
        });
      });
  };
  updateMaterials = (id, index) => {
    this.setState({
      chicken_material_finalStage_chicken_breeding: this.state.chicken_material_finalStage_chicken_breeding.filter(
        (e, i) => {
          return i !== index;
        }
      )
    });

    fs.collection("chicken_material_finalStage_chicken_breeding")
      .doc(id)
      .get()
      .then(doc => {
        this.setState({
          chicken_material_finalStage_chicken_breeding: [
            ...this.state.chicken_material_finalStage_chicken_breeding,
            doc
          ]
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
      const workforce_finalStage = this.state.workforce_finalStage_chicken_breeding.map(
        (doc, index) => {
          return (
            <ListItem avatar key={index}>
              <Left>
                <Thumbnail
                  source={require("../../../../assets/perfilEmpleado.png")}
                />
              </Left>
              <Body>
                <Text>{doc.data().name + " " + doc.data().lastName}</Text>
                <Text>{"Horas trabajadas: " + doc.data().hours}</Text>
                <Text note>{"Pago por Hora: " + doc.data().pay}</Text>
                <Text note>
                  {"Total: " + doc.data().pay * doc.data().hours}
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
                    this.props.navigation.navigate("updateWorkersFinalStage", {
                      worker: doc,
                      update: this.update,
                      index: index
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
                  onPress={() => this.delete(doc, index)}
                />
              </Right>
            </ListItem>
          );
        }
      );

      const material_FinalStage = this.state.chicken_material_finalStage_chicken_breeding.map(
        (doc, index) => {
          console.log(doc.data());
          return (
            <ListItem avatar key={index}>
              <Left>
                <Thumbnail
                  source={require("../../../../assets/perfilEmpleado.png")}
                />
              </Left>
              <Body>
                <Text>{doc.data().name}</Text>
                <Text note>{"Cantidad usada: "}</Text>
                <Text note style={{ color: "red", fontWeight: "500" }}>
                  {doc.data().useMaterial + " Empaques"}
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
                    this.props.navigation.navigate(
                      "updateMaterialInitialStage",
                      {
                        material: doc,
                        update: this.updateMaterials,
                        index: index
                      }
                    );
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
                  onPress={() => this.deleteMaterials(doc, index)}
                />
              </Right>
            </ListItem>
          );
        }
      );

      return (
        <View style={styles.container}>
          <Header
            style={{
              height: 80,
              width: "100%",
              borderBottomColor: "#fff",
              backgroundColor: "#077A65"
            }}
          >
            <Left>
              <Icon
                type="MaterialIcons"
                name="arrow-back"
                style={styles.iconStyle}
                onPress={() => this.props.navigation.goBack()}
              />
            </Left>
            <Body>
              <Title style={{ width: 220, color: "#fff", fontSize: 18 }}>
                ETAPA FINAL
              </Title>
            </Body>
            <Right />
          </Header>
          <Button
            danger
            bordered
            onPress={() => {
              this.finalStage();
            }}
          >
            <Text
              style={{
                width: "100%",
                textAlign: "center",
                fontSize: 20,
                color: "#077A65"
              }}
            >
              ¿Desea terminar esta etapa?
            </Text>
          </Button>
          <Tabs>
            <Tab
              style={{
                height: "100%"
              }}
              heading="MANO DE OBRA"
              activeTextStyle={{ color: "#077A65" }}
            >
              <Container
                style={{
                  marginLeft: 3,
                  marginRight: 3
                }}
              >
                <ScrollView>{workforce_finalStage}</ScrollView>
              </Container>
              <Fab
                navigation={this.props.navigation}
                onPress={() => {
                  this.props.navigation.navigate("employeesList", {
                    farm: this.state.farm,
                    screen: "addWorkerFinalStage", // pantalla adonde deberia de ir a parar cuan se seleccione un empleado
                    production: this.state.production,
                    save: this.save
                  });
                }}
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
              heading="MATERIALES"
              activeTextStyle={{ color: "#077A65" }}
            >
              <Container
                style={{
                  marginLeft: 3,
                  marginRight: 3
                }}
              >
                <ScrollView>{material_FinalStage}</ScrollView>
              </Container>
              <Fab
                navigation={this.props.navigation}
                onPress={() => {
                  this.props.navigation.navigate("materialList", {
                    farm: this.state.farm,
                    screen: "addMaterialFinalStage", // pantalla adonde deberia de ir a parar cuan se seleccione un empleado
                    production: this.state.production,
                    save: this.saveMaterials
                  });
                }}
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
  },
  buttonStyle: {
    backgroundColor: "red"
  }
});
