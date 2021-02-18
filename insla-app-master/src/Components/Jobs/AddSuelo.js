import React, { Component } from "react";
import { View, Text, Alert, StyleSheet, ScrollView } from "react-native";
import { fs, firebase } from "../Firebase/config";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import SvgUri from "react-native-svg-uri";
import {
  Header,
  Left, 
  Body,
  Right,
  Title,
  Form,
  Icon,
  Row,
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
  Thumbnail
} from "native-base";

export default class AddSuelo extends Component {
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
      listChemical: [],
      Loaded: false
    };
  }

  componentDidMount() {
    fs.collection("soilWorkers")
      .where("idEstimation", "==", this.state.estimation.id)
      .get()
      .then(query => {
        query.forEach(doc => {
          this.setState({
            listWorkers: [...this.state.listWorkers, doc]
          });
        });
        this.setState({
          Loaded: true
        });
      });
  }
  savew = id => {
    fs.collection("soilWorkers")
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
              .where("id", "==", doc.data().id)
              .get()
              .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                  fs.collection("employees")
                    .doc(doc.id)
                    .update({ status: false });
                });
              });
            fs.collection("soilWorkers")
              .doc(doc.id)
              .delete()
              .then(() => {
                this.setState({
                  listWorkers: this.state.listWorkers.filter((e, i) => {
                    return i !== index;
                  })
                });
              });
          }
        }
      ]
    );
  };
  updatew = (id, index) => {
    this.setState({
      listWorkers: this.state.listWorkers.filter((e, i) => {
        return i !== index;
      })
    });

    fs.collection("soilWorkers")
      .doc(id)
      .get()
      .then(doc => {
        this.setState({
          listWorkers: [...this.state.listWorkers, doc]
        });
      });
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
      const showEmployees = this.state.listWorkers.map((doc, index) => {
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
              <Text note>{""}Total: L.{doc.data().payDay * doc.data().dayWorked}</Text>
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
                  this.props.navigation.navigate("UpdateWorkerHarvest", {
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
                  this.deleteWorker(doc, index);
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
                onPress={() => this.props.navigation.navigate("soilHome")}
              />
            </Left>
            <Body>
              <Title style={styles.titleStyle}>MALEZA</Title>
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
                  this.props.navigation.navigate("employeesMaleza", {estimation:estimation,
                    save: this.savew}) 
                }
              >
                <Icon type="FontAwesome5" name="plus" />
              </Fab>
            </Tab>
            <Tab heading="QUIMICOS" activeTextStyle={{ color: "#077A65" }}>
              <View
                style={{
                  flex: 1,
                  position: "relative"
                }}
              >
                <Fab
                  direction="up"
                  style={{
                    backgroundColor: "#077A65",
                    padding: 0,
                    margin: 0,
                    position: "absolute"
                  }}
                  position="bottomRight"
                  onPress={() => this.props.navigation.navigate("addChemical")}
                >
                  <Icon type="FontAwesome5" name="plus" />
                </Fab>
              </View>
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
