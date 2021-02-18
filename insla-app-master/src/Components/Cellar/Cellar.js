import React, { Component } from "react";
import { View, StyleSheet, TextInput, ScrollView, Alert } from "react-native";
import {
  Header,
  Left,
  Text,
  Body,
  Icon,
  Fab,
  Title,
  Right,
  Container,
  Content,
  Card,
  CardItem,
  Thumbnail,
  Button,
  Spinner,
  Tabs,
  Tab,
  ListItem,
  Row
} from "native-base";

import { fs, firebase } from "../Firebase/config";
import SvgUri from "react-native-svg-uri";
export default class Cellar extends Component {
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
      farm: this.props.navigation.state.params.farm,
      cellar: []
    };
  }

  componentDidMount() {
    const { farm } = this.state;
    fs.collection("Cellar")
      .where("idFarm", "==", farm.id)
      .get()
      .then(query => {
        query.forEach(doc => {
          this.setState({
            cellar: [...this.state.cellar, doc]
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
    fs.collection("Cellar")
      .doc(id)
      .get()
      .then(doc => {
        this.setState({
          cellar: [...this.state.cellar, doc]
        });
      });
  };
  deleteCellar = obj => {
    Alert.alert(
      "Borrar Producto",
      "¿Esta seguro que desea borrar este producto?",
      [
        {
          text: "Cancelar",

          style: "Cancelar"
        },
        {
          text: "Aceptar",
          onPress: () => {
            fs.collection("Cellar")
              .doc(obj.id)
              .delete()
              .then(() => {
                this.setState({
                  cellar: []
                });
                this.componentDidMount();
                Alert.alert("", "Borrado", [], {
                  cancelable: true
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
      cellar: this.state.cellar.filter((e, i) => {
        return i !== index;
      })
    });

    fs.collection("Cellar")
      .doc(id)
      .get()
      .then(doc => {
        this.setState({
          cellar: [...this.state.cellar, doc]
        });
      });
  };

  render() {
    const TabCellar = this.state.cellar.map((doc, index) => {
      return (
        <ListItem avatar key={index} style={{ fontSize: 300 }}>
          <Left>
            <SvgUri
              width="40"
              height="40"
              source={require("../../../assets/icons/tienda-de-comestibles.svg")}
              paddin
            />
          </Left>
          <Body>
            <Text>Producto: {doc.data().nombre}</Text>
            <Text>Id: {doc.data().Codigo}</Text>
            <Text note> Precio: {doc.data().precio}</Text>
            <Text note> Cantidad: {doc.data().existencia}</Text>
          </Body>
          <Right>
            <Row>
              <Icon
                type="MaterialIcons"
                name="edit"
                style={{ color: "blue", marginRight: 15, fontSize: 25 }}
                onPress={() => {
                  this.props.navigation.navigate("updatecellar", {
                    item: doc,
                    index: index,
                    update: this.update
                  });
                }}
              />
              <Icon
                type="MaterialIcons"
                name="delete"
                style={{ color: "red", fontSize: 30 }}
                onPress={() => this.deleteCellar(doc)}
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
              style={styles.iconStyle}
              onPress={() => this.props.navigation.goBack()}
            />
          </Left>
          <Body>
            <Title style={styles.titleStyle}>BODEGA</Title>
          </Body>
          <Right />
        </Header>
        <Container>
          <ScrollView>{TabCellar}</ScrollView>
        </Container>
        <Fab
          active={this.state.active}
          direction="up"
          containerStyle={{}}
          style={{ backgroundColor: "#077A65", padding: 0, margin: 0 }}
          position="bottomRight"
          onPress={() => {
            this.props.navigation.navigate("addcellar", {
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
