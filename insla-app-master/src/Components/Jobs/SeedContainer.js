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
  Spinner,
  Fab,
  Tab,
  Tabs,
  Card,
  CardItem,
  Container,
  Icon,
  ListItem
} from "native-base";

export default class SeedContainer extends Component {
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
      listWorkersSeed: [],
      listChapulinSeed: [],
      Loaded: false
    };
  }
  componentDidMount() {
    const { estimation } = this.state;
    fs.collection("seedWorkers")
      .where("idEstimation", "==", estimation.id)
      .get()
      .then(query => {
        query.forEach(doc => {
          this.setState({
            listWorkersSeed: [...this.state.listWorkersSeed, doc]
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
                listChapulinSeed: [...this.state.listChapulinSeed, doc]
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

  deleWorkersSeed = (doc, index) => {
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
              status:false
            })
            fs.collection("seedWorkers")
              .doc(doc.id)
              .delete()
              .then(() => {
                this.setState({
                  listWorkersSeed: this.state.listWorkersSeed.filter((e, i) => {
                    return i !== index;
                  })
                });
              });
          }
        }
      ]
    );
  };

  savew = id => {
    fs.collection("seedWorkers")
      .doc(id)
      .get()
      .then(doc => {
        this.setState({
          listWorkersSeed: [...this.state.listWorkersSeed, doc]
        });
      });
  };

  updatew = (id, index) => {
    this.setState({
     listWorkersSeed: this.state.listWorkersSeed.filter((e, i) => {
        return i !== index;
      })
    });

    fs.collection("seedWorkers")
      .doc(id)
      .get()
      .then(doc => {
        this.setState({
          listWorkersSeed: [...this.state.listWorkersSeed, doc]
        });
      });
  };

  savec = id => {
    fs.collection("seedChapulin")
      .doc(id)
      .get()
      .then(doc => {
        this.setState({
          listChapulinSeed: [...this.state.listChapulinSeed, doc]
        });
      });
  };

  updatec = (id, index) => {
    this.setState({
     listChapulinSeed: this.state.listChapulinSeed.filter((e, i) => {
        return i !== index;
      })
    });

    fs.collection("seedChapulin")
      .doc(id)
      .get()
      .then(doc => {
        this.setState({
          listChapulinSeed: [...this.state.listChapulinSeed, doc]
        });
      });
  };

  deleChapulinSeed = (doc, index) => {
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
              status:false
            })
            fs.collection("seedChapulin")
              .doc(doc.id)
              .delete()
              .then(() => {
                this.setState({
                  listChapulinSeed: this.state.listChapulinSeed.filter((e, i) => {
                    return i !== index;
                  })
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
      const showEmployeesSeed = this.state.listWorkersSeed.map((doc, index) => {
        return (
          <ListItem avatar key={index} style={{fontSize: 300}}>
            <Left>
              <SvgUri width="40" height="40" source={require("../../../assets/icons/employee.svg")}paddin/>
            </Left>
            <Body>
              <Text style={{fontWeight: "bold"}}>{doc.data().name + " " + doc.data().lastName}</Text>
              <Text note>{"Actividad: " + doc.data().description}</Text>
              <Text note>{"Costo Total: L. " + doc.data().dayWorked * doc.data().payDay}</Text>
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
                  this.props.navigation.navigate("updateWorkerSeed", {
                    item: doc,
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
                  this.deleWorkersSeed(doc, index);
                }}
              />
            </Right>
          </ListItem>
        );
      });

      const showChapulinSeed = this.state.listChapulinSeed.map((doc, index) => {
        return (
          <ListItem avatar key={index} style={{fontSize: 300}}>
            <Left>
              <SvgUri width="40" height="40" source={require("../../../assets/icons/tractor.svg")}paddin/>
            </Left>
            <Body>
              <Text style={{fontWeight: "bold"}}>{doc.data().name + " " + doc.data().lastName}</Text>
              <Text note>{"Actividad: " + doc.data().description}</Text>
              <Text note>{"Costo Total: L. " + doc.data().totalHours * doc.data().payForHour}</Text>
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
                  this.props.navigation.navigate("updateChapulinSeed", {
                    item: doc,
                    index: index,
                    update: this.updatec
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
                  this.deleChapulinSeed(doc, index);
                }}
              />
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
                onPress={() => this.props.navigation.navigate("seedHome")}
              />
            </Left>
            <Body>
              <Title style={styles.titleStyle}>SEMILLAS</Title>
            </Body>
            <Right></Right>
          </Header>

          <Tabs>
            <Tab
              style={{
                height: "100%"
              }}
              heading="ARTESANAL"
              activeTextStyle={{ color: "#077A65" }}
            >
              <Container
                style={{
                  marginLeft: 3,
                  marginRight: 3
                }}
              >
                <ScrollView>{showEmployeesSeed}</ScrollView>
              </Container>
              <Fab
                onPress={() =>
                  this.props.navigation.navigate("employeesSemillas", {estimation:estimation,
                    save: this.savew}) 
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
              heading="CHAPULÍN"
              activeTextStyle={{ color: "#077A65" }}
            >
              <Container
                style={{
                  marginLeft: 3,
                  marginRight: 3
                }}
              >
                <ScrollView>{showChapulinSeed}</ScrollView>
              </Container>
              <Fab
                onPress={() =>
                  this.props.navigation.navigate("employeesChapulinSeed", {estimation:estimation,
                    save: this.savec}) 
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
