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
  Row,
  Tab,
  Tabs,
  Card,
  CardItem,
  Container,
  Thumbnail,
  ListItem,
  List,
} from "native-base";

export default class PlowHome extends Component {
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
      listWorkers: [],
      listChapulin: [],
      Loaded: false
    };
  }
  componentDidMount() {
    fs.collection("plowWorkers")
      .where("idEstimation", "==", this.state.estimation.id)
      .get()
      .then(query => {
        query.forEach(doc => {

          this.setState({
            listWorkers: [...this.state.listWorkers, doc]
          });
        });
      })
      .then(() => {
        fs.collection("soilChapulin")
          .where("idEstimation", "==", this.state.estimation.id)
          .get()
          .then(query => {
            query.forEach(doc => {
              this.setState({
                listChapulin: [...this.state.listChapulin, doc]
              });
            });
          });
        this.setState({
          Loaded: true
        });
      });
  }


  savew = id => {
    fs.collection("plowWorkers")
      .doc(id)
      .get()
      .then(doc => {
        this.setState({
          listWorkers: [...this.state.listWorkers, doc]
        });
      });
  };


  save = id => {
    fs.collection("soilChapulin")
      .doc(id)
      .get()
      .then(doc => {
        this.setState({
          listChapulin: [...this.state.listChapulin, doc]
        });
      });
  };


  update = (id, index) => {
    this.setState({
      listChapulin: this.state.listChapulin.filter((e, i) => {
        return i !== index;
      })
    });

    fs.collection("soilChapulin")
      .doc(id)
      .get()
      .then(doc => {
        this.setState({
          listChapulin: [...this.state.listChapulin, doc]
        });
      });
  };

  updatew = (id, index) => {
    fs.collection("plowWorkers")
      .doc(id)
      .get()
      .then(doc => {
        this.setState({
          listWorkers: [...this.state.listWorkers, doc]
        });
      });
  };

  deleteWorker = (doc, index) => {
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
            fs.collection("employees")
              .doc(doc.data().idlistempleado)
              .update({
                status: false
              })
            fs.collection("plowWorkers")
              .doc(doc.id)
              .delete()
              .then(() => {
                this.setState({
                  listWorkers: this.state.listWorkers
                });
              });
          }
        }
      ]
    );
  };

  deleteChapulin = (doc, index) => {
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
            fs.collection("soilChapulin")
              .doc(doc.id)
              .delete()
              .then(() => {
                this.setState({
                  listChapulin: this.state.listChapulin.filter((e, i) => {
                    return i !== index;
                  })
                });
              });
          }
        }
      ]
    );
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
      const showChapulin = this.state.listChapulin.map((doc, index) => {
        return (
          <ListItem avatar key={index} style={{ fontSize: 300 }}>
            <Left>

              <SvgUri width="40" height="40" source={require("../../../assets/icons/tractor.svg")} paddin />
            </Left>
            <Body>
              <Text > {doc.data().name + " " + doc.data().lastName}</Text>
              <Text note>{" "} Id: {" "} {doc.data().id}</Text>
              <Text note>{" "} Total: L.{doc.data().payForHour * doc.data().totalHours}
              </Text>
            </Body>
            <Right>
              <Row>
                <Icon
                  type="MaterialIcons"
                  name="edit"
                  style={{ color: "blue", marginRight: 15, fontSize: 25 }}
                  onPress={() => {
                    this.props.navigation.navigate("updateChapulin",
                      {
                        item: doc,
                        index: index,
                        update: this.update
                      }
                    );
                  }}
                />
                <Icon
                  type="MaterialIcons"
                  name="delete"
                  style={{ color: "red", fontSize: 30 }}
                  onPress={() => this.deleteChapulin(doc, index)}
                />
              </Row>
            </Right>
          </ListItem>
        );
      });

      const showEmployees = this.state.listWorkers.map((doc, index) => {
        return (
          <ListItem avatar key={index} style={{ fontSize: 300 }}>
            <Left>
              <SvgUri width="40" height="40" source={require("../../../assets/icons/employee.svg")} paddin />
            </Left>
            <Body>
              <Text > {doc.data().name + " " + doc.data().lastName}</Text>
              <Text note>
                {doc.data().id.substr(0, 4)}-{doc.data().id.substr(4, 4)}-
                {doc.data().id.substr(8)}
              </Text>
              <Text note>Total: L.{doc.data().dayWorked * doc.data().payDay}
              </Text>
            </Body>
            <Right>
              <Row>
                <Icon
                  type="MaterialIcons"
                  name="edit"
                  style={{ color: "blue", marginRight: 15, fontSize: 25 }}
                  onPress={() => {
                    this.props.navigation.navigate("updateWorkerPlow", {
                      item: doc,
                      index: index,
                      update: this.updatew
                    });
                  }}
                />

                <Icon
                  type="MaterialIcons"
                  name="delete"
                  style={{ color: "red", fontSize: 30 }}
                  onPress={() => this.deleteWorker(doc, index)}
                />
              </Row>
            </Right>
          </ListItem>
        );
      });
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
              <Title style={styles.titleStyle}>ARADO</Title>
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
                  marginLeft: 3,
                  marginRight: 3
                }}
              >
                <ScrollView>{showEmployees}</ScrollView>
              </Container>
              <Fab
                direction="up"
                style={{
                  backgroundColor: "#077A65",
                  padding: 0,
                  margin: 0,
                  position: "absolute"
                }}
                position="bottomRight"
                onPress={() =>
                  this.props.navigation.navigate("employeesArado", {
                    estimation: estimation,
                    save: this.savew
                  })
                }
              >
                <Icon type="FontAwesome5" name="plus" />
              </Fab>
            </Tab>
            <Tab
              style={{
                height: "100%"
              }}
              heading="CHAPULÍN"
              activeTextStyle={{ color: "#077A65" }}
            >
              <Container
                style={{
                  marginLeft: 3,
                  marginRight: 3
                }}
              >
                <ScrollView>{showChapulin}</ScrollView>
              </Container>
              <Fab
                direction="up"
                style={{
                  backgroundColor: "#077A65",
                  padding: 0,
                  margin: 0,
                  position: "absolute"
                }}
                position="bottomRight"
                onPress={() =>
                  this.props.navigation.navigate("employeesChapulin", {
                    estimation: estimation,
                    save: this.save
                  })
                }
              >
                <Icon type="FontAwesome5" name="plus" />
              </Fab>
            </Tab>
          </Tabs>
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
