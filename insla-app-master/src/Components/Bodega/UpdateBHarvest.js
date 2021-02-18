import React, { Component } from "react";
import { View, StyleSheet, TextInput, ScrollView, Alert } from "react-native";
import {
  Text,
  Form,
  Content,
  Textarea,
  Header,
  Left,
  Body,
  Title,
  Right,
  Icon,
  Item,
  Label,
  Button,
  Spinner,
  Input,
  Row,
  Container
} from "native-base";
import { firebase, fs } from "../Firebase/config";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default class UpdateBHarvest extends Component {
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
      harvest: this.props.navigation.state.params.item,
      especie: this.props.navigation.state.params.item.data().especie,
      existencia: this.props.navigation.state.params.item.data().existencia,
      id: this.props.navigation.state.params.item.data().id,
      nombre: this.props.navigation.state.params.item.data().nombre,
      Loaded: true,
      index: this.props.navigation.state.params.index,
      item: this.props.navigation.state.params.item,

      //errors inputs
      eExistencia: false,

      //succes inputs
      sExistencia: true,

      //icon inputs
      iExistencia: "checkmark-circle",

      Loaded: true,
      saveState: false,
      preloader: false
    };
  }

  validate = (text, type) => {
    const regexExistencia = /\d{1,8}/;

    if (type === "existencia") {
      if (regexExistencia.test(text)) {
        this.setState({
          existencia: text,
          eExistencia: false,
          sExistencia: true,
          iExistencia: "checkmark-circle"
        });
      } else {
        this.setState({
          existencia: text,
          eExistencia: true,
          sExistencia: false,
          iExistencia: "close-circle"
        });
      }
    }
  };

  saveWorker = () => {
    const { existencia, index, harvest, sExistencia } = this.state;
    if (sExistencia) {
      this.setState({
        preloader: true,
        saveState: true
      });
      fs.collection("Cellar")
        .doc(harvest.id)
        .update({
          existencia: parseInt(existencia)
        })
        .then(() => {
          this.props.navigation.state.params.update(harvest.id, index);
          this.props.navigation.navigate("Bodega");
        });
    } else {
      Alert.alert("", "Rellene todos los campos", [], {
        cancelable: true
      });
    }
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
                onPress={() =>
                  this.props.navigation.navigate("Bodega", this.state.farm)
                }
              />
            </Left>
            <Body>
              <Title style={{ color: "#fff", fontSize: 20 }}>CULTIVO</Title>
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
                    <Icon type="MaterialIcons" name="accessibility" />
                    <Label>ID</Label>
                    <Input
                      disabled
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      value={this.state.id}
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
                  <Item floatingLabel style={{ width: "90%", height: 60 }}>
                    <Icon type="MaterialIcons" name="person" />
                    <Label>Nombre cultivo</Label>
                    <Input
                      disabled
                      style={{
                        fontSize: 18,
                        alignSelf: "flex-start"
                      }}
                      value={"" + this.state.nombre}
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
                  <Item floatingLabel style={{ width: "90%", height: 60 }}>
                    <Icon type="MaterialIcons" name="people" />
                    <Label>Especie</Label>
                    <Input
                      disabled
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      value={this.state.especie}
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
                    error={this.state.eExistencia}
                    success={this.state.sExistencia}
                  >
                    <Icon type="MaterialIcons" name="accessibility" />
                    <Label>Cantidad de quintales</Label>
                    <Input
                      keyboardType="number-pad"
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      value={this.state.existencia.toString()}
                      onChangeText={existencia =>
                        this.validate(existencia, "existencia")
                      }
                    />
                    <Icon name={this.state.iExistencia} />
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
                    disabled={this.state.saveState}
                    onPress={this.saveWorker}
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
  titleStyle: {
    color: "#fff"
  },
  container: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column"
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
  },
  errorValitation: {
    borderColor: "red"
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
