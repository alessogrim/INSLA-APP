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
import fruitsImage from "../../../assets/productions.jpg";

export default class ChickenFarming extends Component {
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
      active: true,
      text: "",
      farm: this.props.navigation.state.params,
      productions: [],
      Loaded: false,
      initialStage: false,
      grothStage: false,
      finalStage: false
    };
  }

  componentDidMount() {
    const { farm } = this.state;
    fs.collection("productions")
      .where("idFarm", "==", farm.id)
      .get()
      .then(query => {
        query.forEach(doc => {
          this.setState({
            productions: [...this.state.productions, doc]
          });
        });
      })
      .then(() => {
        this.setState({
          Loaded: true
        });
      });
  }
  initialStage = () => {
    this.setState({
      initialStage: true
    });
  };

  delete = (doc, index) => {
    Alert.alert(
      "Borrar",
      "¿Esta seguro que desea borrar esta producción?",
      [
        {
          text: "Cancelar",

          style: "Cancelar"
        },
        {
          text: "Aceptar",
          onPress: () => {
            fs.collection("productions")
              .doc(doc.id)
              .delete()
              .then(() => {
                this.setState({
                  productions: this.state.productions.filter((e, i) => {
                    return i !== index;
                  })
                });
              })
              .then(() => {
                fs.collection("corrales")
                  .doc(doc.data().idCorral)
                  .update({
                    taken: false
                  });
              });
          }
        }
      ],
      { cancelable: false }
    );
  };

  update = (id, index) => {
    this.setState({
      productions: this.state.productions.filter((e, i) => {
        return i !== index;
      })
    });

    fs.collection("productions")
      .doc(id)
      .get()
      .then(doc => {
        this.setState({
          productions: [...this.state.productions, doc]
        });
      });
  };

  save = id => {
    fs.collection("productions")
      .doc(id)
      .get()
      .then(doc => {
        this.setState({
          productions: [...this.state.productions, doc]
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
      //-----------------------initial map producciones de pollos
      const productions = this.state.productions.map((doc, index) => {
        return (
          <Card style={{ margin: 10 }} key={index}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("Stages", {
                  farm: this.state.farm,
                  production: doc,
                  update: this.update,
                  index: index
                });
              }}
            >
              <CardItem header>
                <Left>
                  <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                    {" "}
                    {"Nombre: "}
                    <Text style={{ color: "red", fontSize: 18 }}>
                      {doc.data().name}
                    </Text>
                  </Text>
                </Left>
              </CardItem>
              <CardItem cardBody style={{ flex: 1, height: 270 }}>
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
                    Total Animales: {"\n"}
                    <Text
                      style={{
                        fontSize: 25,
                        fontWeight: "600",
                        marginLeft: 20
                      }}
                    >
                      {doc.data().totalChickens}
                    </Text>
                  </Text>
                  <Text
                    style={{
                      marginLeft: 20,
                      fontSize: 15,
                      color: "#CDCDCDCD"
                    }}
                  >
                    Etapas
                  </Text>
                  <ListItem style={{ width: "80%", margin: 0 }}>
                    <CheckBox checked={doc.data().initialStage} />
                    <Body>
                      <Text style={{ color: "green" }}>Inicial</Text>
                    </Body>
                  </ListItem>

                  <ListItem style={{ width: "80%" }}>
                    <CheckBox checked={doc.data().growthStage} />
                    <Body>
                      <Text style={{ color: "green" }}>Crecimiento</Text>
                    </Body>
                  </ListItem>

                  <ListItem style={{ width: "80%" }}>
                    <CheckBox checked={doc.data().finalStage} />
                    <Body>
                      <Text style={{ color: "green" }}>Final</Text>
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
                  onPress={() => {
                    this.delete(doc, index);
                  }}
                />
                <Icon
                  type="MaterialIcons"
                  name="edit"
                  onPress={() => {
                    this.props.navigation.navigate("updateProduction", {
                      item: doc,
                      index: index,
                      update: this.update
                    });
                  }}
                />
                <Icon
                  type="MaterialIcons"
                  name="library-books"
                  style={{ margin: 15 }}
                  onPress={() => {
                    this.props.navigation.navigate("productionDetails", doc);
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
                onPress={() => this.props.navigation.goBack()}
              />
            </Left>
            <Body>
              <Title style={{ color: "#fff", fontSize: 14 }}>
                PRODUCCIONES
              </Title>
            </Body>
            <Right />
          </Header>
          <Container>
            <ScrollView>{productions}</ScrollView>
          </Container>

          <Fab
            active={this.state.active}
            direction="up"
            style={{ backgroundColor: "#077A65", padding: 0, margin: 0 }}
            position="bottomRight"
            onPress={() => this.setState({ active: !this.state.active })}
            onPress={() => {
              this.props.navigation.navigate("corralesList", {
                farm: this.state.farm,
                save: this.save
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
