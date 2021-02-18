import React, { Component } from "react";
import {
  Container,
  Form,
  Body,
  Header,
  Icon,
  Text,
  Button,
  Left,
  Title,
  Input,
  Item,
  Label,
  Right,
  Spinner
} from "native-base";

import { StyleSheet, View, Alert, ScrollView } from "react-native";
import { fs, firebase } from "../Firebase/config";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
export default class updateCellar extends Component {
  //navigation option
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

  // constructor
  constructor(props) {
    super(props);

    let estimation = this.props.navigation.state.params.data();
    let id = estimation.id.split("-");

    this.state = {
      id: "PRC-" + id[1],
      nombre: estimation.Tipo,
      existencia: "",
      index: "",
      idEstimacion: this.props.navigation.state.params.id,
      save: false,
      prelaoder: false,
      Loaded: false,
      //errors
      eexistencia: false,

      //icons
      iexistencia: "checkmark-circle",

      //success
      sexistencia: true
    };
  }

  componentDidMount() {
    let estimation = this.props.navigation.state.params;
    let id = estimation.data().id.split("-");
    fs.collection("Cellar")
      .where("idEstimation", "==", estimation.id)
      .get()
      .then(query => {
        query.forEach(doc => {
          this.setState({
            cellar: doc,
            existencia: doc.data().existencia,
            id: doc.data().id || "PRC-" + id[1]
          });
        });
      })
      .then(() => {
        this.setState({
          Loaded: true
        });
      });
  }

  validate = (data, type) => {
    const regexexistencia = /\d{1,4}/;
    if (type === "existencia") {
      if (regexexistencia.test(data)) {
        this.setState({
          existencia: data,
          sexistencia: true,
          eexistencia: false,
          iexistencia: "checkmark-circle"
        });
      } else {
        this.setState({
          existencia: data,
          sexistencia: false,
          eexistencia: true,
          iexistencia: "close-circle"
        });
      }
    }
  };

  async update() {
    let estimation = this.props.navigation.state.params;
    const {
      id,
      nombre,
      existencia,
      cellar,
      idFarm,
      snombre,
      sexistencia,
      item,
      index
    } = this.state;

    if (sexistencia) {
      this.setState({
        preloader: true,
        save: true
      });
      if (cellar) {
        fs.collection("Cellar")
          .doc(cellar.id)
          .update({
            existencia: parseInt(existencia)
          })
          .then(() => {
            this.props.navigation.navigate("harvestHome", estimation);
          });
      } else {
        const farm = await fs
          .collection("farms")
          .doc(estimation.data().idFarm)
          .get();
        fs.collection("Cellar")
          .add({
            id,
            nombre,
            especie: estimation.data().Especie,
            idEstimation: estimation.id,
            idFarm: estimation.data().idFarm,
            existencia: parseInt(existencia),
            farmName: farm.data().name
          })
          .then(() => {
            this.props.navigation.navigate("harvestHome", estimation);
          });
      }
    } else {
    }
  }

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
      return (
        <Container>
          <Header
            style={{
              height: 70,
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
                  fontSize: 40,
                  color: "#fff",
                  padding: 5
                }}
                onPress={() => {
                  let estimation = this.props.navigation.state.params;
                  this.props.navigation.navigate("harvestHome", estimation);
                }}
              />
            </Left>
            <Body>
              <Title style={{ color: "#fff", fontSize: 20 }}>PRODUCTO</Title>
            </Body>
            <Right />
          </Header>

          <ScrollView
            style={{
              flex: 1
            }}
          >
            <KeyboardAwareScrollView
              resetScrollToCoords={{ x: 0, y: 0 }}
              keyboardOpeningTime={250}
              ScroolEnable={false}
            >
              <Form style={style.container}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    width: "100%",
                    alignItems: "center"
                  }}
                >
                  <Item floatingLabel style={{ width: "90%", height: 60 }}>
                    <Icon type="MaterialIcons" name="priority-high" />
                    <Label>ID</Label>
                    <Input
                      value={this.state.id.toString()}
                      disabled={true}
                      maxLength={4}
                      keyboardType="number-pad"
                      style={{
                        fontSize: 18,
                        alignSelf: "flex-start"
                      }}
                      value={"" + this.state.id}
                    />
                  </Item>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    width: "100%",
                    alignItems: "center"
                  }}
                >
                  <Item
                    floatingLabel
                    style={{ width: "90%", height: 60 }}
                    error={this.state.enombre}
                    success={this.state.snombre}
                  >
                    <Icon type="MaterialIcons" name="shopping-basket" />
                    <Label>Nombre Producto</Label>
                    <Input
                      disabled={true}
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      value={"" + this.state.nombre}
                    />
                    <Icon name={this.state.inombre} />
                  </Item>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    width: "100%",
                    alignItems: "center"
                  }}
                >
                  <Item
                    floatingLabel
                    style={{ width: "90%", height: 60 }}
                    error={this.state.eexistencia}
                    success={this.state.sexistencia}
                  >
                    <Icon type="MaterialIcons" name="line-style" />
                    <Label>Cantidad (en quintales)</Label>
                    <Input
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      keyboardType="numeric"
                      value={this.state.existencia.toString()}
                      onChangeText={existencia =>
                        this.validate(existencia, "existencia")
                      }
                    />
                    <Icon name={this.state.iexistencia} />
                  </Item>
                </View>
                <View
                  style={{
                    marginTop: "10%",
                    marginBottom: "10%",
                    width: "60%"
                  }}
                >
                  <Button
                    style={style.addButton}
                    full
                    rounded
                    success
                    save={this.state.save}
                    onPress={this.update.bind(this)}
                  >
                    <Text style={{ color: "white" }}>ACTUALIZAR</Text>
                  </Button>
                </View>
              </Form>
            </KeyboardAwareScrollView>
          </ScrollView>
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
        </Container>
      );
    }
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column"
  },
  addButton: {
    backgroundColor: "#077A65"
  },
  fields: {
    margin: "5%",
    width: "50%",
    flex: 50
  },
  errorValitation: {
    borderColor: "red"
  }
});
