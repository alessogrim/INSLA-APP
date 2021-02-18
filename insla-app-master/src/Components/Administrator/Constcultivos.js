import React, { Component } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
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
  Spinner,
  ListItem,
  Row
} from "native-base";
import { NavigationActions } from "react-navigation";
import { fs, firebase } from "../Firebase/config";
import SvgUri from "react-native-svg-uri";

export default class ConsCultivos extends Component {
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
      dbconst: [],
      text: "",
      Loaded: false
    };
  }

  componentDidMount() {
    fs.collection("const")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.setState({
            dbconst: [...this.state.dbconst, doc]
          });
        });
      });
    this.setState({
      Loaded: true
    });
  }

  deletecultivos = obj => {
    Alert.alert(
      "Borrar cultivos",
      "¿Esta seguro que desea borrar esta constante de cultivos?",
      [
        {
          text: "Cancelar",

          style: "Cancelar"
        },
        {
          text: "Aceptar",
          onPress: () => {
            fs.collection("const")
              .doc(obj.id)
              .delete()
              .then(() => {
                this.setState({
                  dbconst: []
                });
              });
          }
        }
      ],
      { cancelable: false }
    );
  };

  save = id => {
    fs.collection("const")
      .doc(id)
      .get()
      .then(doc => {
        this.setState({
          dbconst: [...this.state.dbconst, doc]
        });
      });
  };

  goToaddCultivos() {
    const navigateAction = NavigationActions.navigate({
      routeName: "addConstCultivos"
    });
    this.props.navigation.dispatch(navigateAction);
  }
  update = (id, index) => {
    this.setState({
      dbconst: this.state.dbconst.filter((e, i) => {
        return i !== index;
      })
    });

    fs.collection("const")
      .doc(id)
      .get()
      .then(doc => {
        this.setState({
          dbconst: [...this.state.dbconst, doc]
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
      const TabCultivos = this.state.dbconst.map((doc, index) => {
        return (
          <ListItem avatar key={index} style={{ fontSize: 300 }}>
            <Left>
              <SvgUri
                width="40"
                height="40"
                source={require("../../../assets/icons/vegetal.svg")}
                paddin
              />
            </Left>
            <Body>
              <Text> Especie: {doc.data().Especie}</Text>
              <Text> Código: {doc.data().Codigo}</Text>
              <Text note> Variedad: {doc.data().Variedad}</Text>
              <Text note> Tipo: {doc.data().Tipo}</Text>
            </Body>
            <Right>
              <Row>
                <Icon
                  type="MaterialIcons"
                  name="edit"
                  style={{ color: "black", fontSize: 30 }}
                  onPress={() => {
                    this.props.navigation.navigate("updateConstCultivos", {
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
                  onPress={() => this.deletecultivos(doc)}
                />
              </Row>
            </Right>
          </ListItem>
        );
      });
      return (
        <View style={styles.container}>
          <Header
            style={{
              height: 80,
              borderBottomColor: "#fff",
              backgroundColor: "#077A65"
              //textAlign: "center"
            }}
          >
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
              <Title style={{ color: "#fff", fontSize: 18 }}>CULTIVOS</Title>
            </Body>
            <Right />
          </Header>
          <Container>
            <ScrollView>{TabCultivos}</ScrollView>
          </Container>
          <Fab
            navigation={this.props.navigation}
            active={this.state.active}
            direction="up"
            style={{ backgroundColor: "#077A65", padding: 0, margin: 0 }}
            position="bottomRight"
            onPress={() => this.setState({ active: !this.state.active })}
            onPress={() =>
              this.props.navigation.navigate("addConstCultivos", {
                save: this.save
              })
            }
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
