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
import { NavigationActions } from "react-navigation";
import { fs, firebase } from "../Firebase/config";
import SvgUri from "react-native-svg-uri";
export default class Insumos extends Component {
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
      dbinsumos: [],
      text: ""
    };
  }

  goToAddInsumos() {
    const navigateAction = NavigationActions.navigate({
      routeName: "addInsumos"
    });

    this.props.navigation.dispatch(navigateAction);
  }
  componentDidMount() {
    fs.collection("insumos")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.setState({
            dbinsumos: [...this.state.dbinsumos, doc]
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
    fs.collection("insumos")
      .doc(id)
      .get()
      .then(doc => {
        this.setState({
          dbinsumos: [...this.state.dbinsumos, doc]
        });
      });
  };

  deleteInsumos = obj => {
    Alert.alert(
      "Borrar insumo",
      "¿Esta seguro que desea borrar esta constante de insumos?",
      [
        {
          text: "Cancelar",

          style: "Cancelar"
        },
        {
          text: "Aceptar",
          onPress: () => {
            fs.collection("insumos")
              .doc(obj.id)
              .delete()
              .then(() => {
                this.setState({
                  dbinsumos: []
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
      dbinsumos: this.state.dbinsumos.filter((e, i) => {
        return i !== index;
      })
    });

    fs.collection("insumos")
      .doc(id)
      .get()
      .then(doc => {
        this.setState({
          dbinsumos: [...this.state.dbinsumos, doc]
        });
      });
  };
  render() {
    const TabInsumos = this.state.dbinsumos.map((doc, index) => {
      return (
        <ListItem avatar key={index} style={{ fontSize: 300 }}>
          <Left>
            <SvgUri
              width="40"
              height="40"
              source={require("../../../assets/icons/fertilizante.svg")}
              paddin
            />
          </Left>
          <Body>
            <Text> Nombre insumo: {doc.data().Nombre}</Text>
            <Text> Código: {doc.data().Codigo}</Text>
            <Text note> Presentacion: {doc.data().Presentacion}</Text>
            <Text note> Precio: {doc.data().Precio}</Text>
          </Body>
          <Right>
            <Row>
              <Icon
                type="MaterialIcons"
                name="edit"
                style={{ color: "blue", marginRight: 15, fontSize: 25 }}
                onPress={() => {
                  this.props.navigation.navigate("updateInsumos", {
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
                onPress={() => this.deleteInsumos(doc)}
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
              onPress={() =>
                this.props.navigation.navigate("administrationHome")
              }
            />
          </Left>
          <Body>
            <Title style={styles.titleStyle}>INSUMOS</Title>
          </Body>
          <Right />
        </Header>
        <Container>
          <ScrollView>{TabInsumos}</ScrollView>
        </Container>
        <Fab
          active={this.state.active}
          direction="up"
          containerStyle={{}}
          style={{ backgroundColor: "#077A65", padding: 0, margin: 0 }}
          position="bottomRight"
          onPress={() =>
            this.props.navigation.navigate("addInsumos", { save: this.save })
          }
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
