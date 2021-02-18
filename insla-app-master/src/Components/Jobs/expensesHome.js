import React, { Component } from "react";
import { View, Text, Alert, StyleSheet, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
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
  Thumbnail
} from "native-base";

export default class expensesHome extends Component {
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
      listMaterials: [],
      Loaded: false,
      totalCost: 0
    };
  }

  componentDidMount() {
    fs.collection("harvestWorkers")
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
        fs.collection("harvestMaterials")
          .where("idEstimation", "==", this.state.estimation.id)
          .get()
          .then(query => {
            query.forEach(doc => {
              this.setState({
                listMaterials: [...this.state.listMaterials, doc]
              });
            });
          });
        this.setState({
          Loaded: true
        });
      });
    var materialTemp = 0;
    fs.collection("Materials")
      .where("idEstimation", "==", this.state.estimation.id)
      .get()
      .then(query => {
        let values = []
        query.forEach(doc => {
          values.push(doc.data());
          //materialTemp += (doc.data().price * doc.data().quantity)
        });
        this.setState({
          listMateriales: values,
          //totalCost: materialTemp
        });
      });
  }

  savew = id => {
    fs.collection("harvestWorkers")
      .doc(id)
      .get()
      .then(doc => {
        this.setState({
          listWorkers: [...this.state.listWorkers, doc]
        });
      });
  };
  savem = id => {
    fs.collection("harvestMaterials")
      .doc(id)
      .get()
      .then(doc => {
        this.setState({
          listMaterials: [...this.state.listMaterials, doc]
        });
      });
  };
  updatew = (id, index) => {
    this.setState({
     listWorkers: this.state.listWorkers.filter((e, i) => {
        return i !== index;
      })
    });

    fs.collection("harvestWorkers")
      .doc(id)
      .get()
      .then(doc => {
        this.setState({
          listWorkers: [...this.state.listWorkers, doc]
        });
      });
  };

  deleteHarvest = (doc, index) => {
    Alert.alert(
      "Eliminar Cosecha",
      "¿Esta seguro que desea eliminar esta mano de obra?",
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
            fs.collection("harvestWorkers")
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
  deleteMaterial = (doc, index) => {
    Alert.alert(
      "Eliminar Material",
      "¿Esta seguro que desea eliminar este material?",
      [
        {
          text: "Cancelar",
          style: "cancelar"
        },
        {
          text: "Aceptar",
          style: "aceptar",
          onPress: () => {
            fs.collection("harvestMaterials")
              .doc(doc.id)
              .delete()
              .then(() => {
                this.setState({
                  listMaterials: this.state.listMaterials.filter((e, i) => {
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

      const showHarvest = this.state.listWorkers.map((doc, index) => {
        return (
          <ListItem avatar key={index} style={{fontSize: 300}}>
            <Left>
              <SvgUri width="40" height="40" source={require("../../../assets/icons/employee.svg")}paddin/>
            </Left>
            <Body>
              <Text style={{fontWeight: "bold"}}>{doc.data().name + " " + doc.data().lastName}</Text>
              <Text note>{"Actividad:" + doc.data().description}</Text>
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
                  this.props.navigation.navigate("updateHarvest", {
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
                  this.deleteHarvest(doc, index);
                }}
              />
            </Right>
          </ListItem>
        );
      });

      const showMaterial = this.state.listMaterials.map((doc, index) => {
        return (
          <ListItem avatar key={index} style={{fontSize: 300}}>
            <Left>
              <SvgUri width="40" height="40" source={require("../../../assets/icons/tools.svg")}/>
            </Left>
            <Body>
              <Text style={{fontWeight: "bold"}}>{doc.data().name}</Text>
              <Text note>{"Cantidad: " + doc.data().quantity}</Text>
              <Text note>{"Descripcion: " + doc.data().description}</Text>
            </Body>
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
                  this.deleteMaterial(doc, index);
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
              <MaterialIcons
                name="arrow-back"
                style={styles.iconStyle}
                onPress={() => this.props.navigation.navigate("harvestHome")}
              />
            </Left>
            <Body>
              <Title style={styles.titleStyle}>COSECHA</Title>
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
                <ScrollView>{showHarvest}</ScrollView>
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
                  this.props.navigation.navigate("employeesCosechas", {estimation:estimation,
                    save: this.savew}) 
                }
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
                <ScrollView>{showMaterial}</ScrollView>
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
                  this.props.navigation.navigate("materialsCosechas", {estimation:estimation,
                    save: this.savem}) 
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