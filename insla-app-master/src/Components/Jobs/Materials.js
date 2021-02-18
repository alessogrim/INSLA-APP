import React, { Component } from "react";
import { View, Text, Alert, StyleSheet, ScrollView } from "react-native";
import { fs, firebase } from "../Firebase/config";

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
  Container
} from "native-base";

export default class Materials extends Component {
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
      listMaterials: [],
      Loaded: false
    };
  }

  componentDidMount() {
    fs.collection("Materials")
      .where("idEstimation", "==", this.state.estimation.id)
      .get()
      .then(query => {
        query.forEach(doc => {
          this.setState({
            listMaterials: [...this.state.listMaterials, doc]
          });
        });
        this.setState({
          Loaded: true
        });
      });
  }
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
            fs.collection("Materials")
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
      const showMaterial = this.state.listMaterials.map((doc, index) => {
        return (
          <Card key={index}>
            <CardItem header>
              <CardItem>
                <Left>
                  <Text style={{ fontSize: 22, fontWeight: "bold" }}>
                    {"Material: " + doc.data().material}
                  </Text>
                </Left>
              </CardItem>
              <CardItem>
                <Left>
                  <Text style={{ fontSize: 22, fontWeight: "bold" }}>
                    {"Cantidad: " + doc.data().quantity}
                  </Text>
                </Left>
              </CardItem>
              <CardItem>
                <Left>
                  <Text style={{ fontSize: 22, fontWeight: "bold" }}>
                    {"Precio: " + doc.data().price}
                  </Text>
                </Left>
              </CardItem>
              <Icon
                type="MaterialIcons"
                name="edit"
                onPress={() => {
                  let value = {
                    doc,
                    estimation,
                    action: "edit"
                  };
                  this.props.navigation.navigate("addMaterial", value);
                }}
                style={{ color: "#000", marginRight: 10 }}
              />
              <Icon
                type="MaterialIcons"
                name="delete"
                style={{ color: "red" }}
                onPress={() => this.deleteMaterial(doc, index)}
              />
            </CardItem>
            <CardItem cardBody style={{ flex: 1, height: 45 }}>
              <Text
                style={{
                  fontSize: 35,
                  fontWeight: "500",
                  marginLeft: 20
                }}
              >
                Costo Total: L.{" "}
                <Text style={{ color: "red" }}>
                  {doc.data().quantity * doc.data().price}
                </Text>
              </Text>
            </CardItem>
          </Card>
        );
      });

      return (
        <View style={styles.container}>
          <Header style={styles.headerStyle}>
            <Left>
              <MaterialIcons
                name="arrow-back"
                style={styles.iconStyle}
                onPress={() =>
                  this.props.navigation.navigate("expensesHome", estimation)
                }
              />
            </Left>
            <Body>
              <Title style={styles.titleStyle}>MATERIALES</Title>
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
                  this.props.navigation.navigate("addMaterial", estimation)
                }
              >
                <Icon type="FontAwesome5" name="plus" />
              </Fab>
            </Tab>
            <Tab heading="MATERIALES" activeTextStyle={{ color: "#077A65" }}>
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
                  disabled={this.state.addMore}
                  onPress={() =>
                    this.props.navigation.navigate("addMaterial", estimation)
                  }
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
