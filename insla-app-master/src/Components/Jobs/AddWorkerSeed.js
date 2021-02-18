import React, { Component } from "react";
import { View, StyleSheet, TextInput, ScrollView, Alert } from "react-native";
import {
  Container,
  Text,
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
  Form,
  Row,
  Content
} from "native-base";
import { firebase, fs } from "../Firebase/config";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class AddWorkerCosecha extends Component {
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
      estimation: {},
      empleado: this.props.navigation.state.params.empleado,
      identidad: this.props.navigation.state.params.empleado.data().id,
      name: this.props.navigation.state.params.empleado.data().name,
      lastName: this.props.navigation.state.params.empleado.data().lastName,
      payDay: 0,
      dayWorked: 0,
      age: this.props.navigation.state.params.empleado.data().age,
      description: " ",
      Loaded: true,
      preloader: false,
      idempleadolist: this.props.navigation.state.params.empleado.id,

      //errors inputs
      ePayDay: false,
      eDayWorked: false,

      //succes inputs
      sPayDay: false,
      sDayWorked: false,

      //icon inputs
      iPayDay: "",
      iDayWorked: ""
    };
  }

  // :::::::::::::::::::::: VALIDATIONS::::::::::::::::::::::
  validate = (data, type) => {
    const regexPayDay = /\d{1,4}/;
    const regexDayWorked = /\d{1,3}/;

    if (type === "payDay") {
      if (regexPayDay.test(data)) {
        this.setState({
          payDay: data,
          ePayDay: false,
          sPayDay: true,
          iPayDay: "checkmark-circle"
        });
      } else {
        this.setState({
          payDay: data,
          ePayDay: true,
          sPayDay: false,
          iPayDay: "close-circle"
        });
      }
    } else if (type === "dayWorked") {
      if (regexDayWorked.test(data)) {
        this.setState({
          dayWorked: data,
          eDayWorked: false,
          sDayWorked: true,
          iDayWorked: "checkmark-circle"
        });
      } else {
        this.setState({
          dayWorked: data,
          eDayWorked: true,
          sDayWorked: false,
          iDayWorked: "close-circle"
        });
      }
    }
  };

  //::::::::::::::::::::::::END VALIDATION ::::::::::::::::::::::
  componentDidMount() {
    let action;
    if (
      this.props &&
      this.props.navigation &&
      this.props.navigation.state &&
      this.props.navigation.state.params.estimacion &&
      this.props.navigation.state.params.estimacion.action
    ) {
      action = this.props.navigation.state.params.estimacion.action;
    }
    if (action === "edit") {
      let worker = this.props.navigation.state.params.estimacion.doc.data();
      this.setState({
        estimation: this.props.navigation.state.params.estimacion.estimation,
        Loaded: true,
        identidad: "" + worker.id,
        name: "" + worker.name,
        payDay: "" + worker.payDay,
        lastName: "" + worker.lastName,
        dayWorked: "" + worker.dayWorked,
        description: "" + worker.description,
        age: "" + worker.age
      });
    } else {
      if (
        this.props.navigation &&
        this.props.navigation.state &&
        this.props.navigation.state.params.estimacion
      ) {
        this.setState({
          estimation: this.props.navigation.state.params.estimacion,
          Loaded: true
        });
      }
    }
  }

  saveWorker = () => {
    const {
      empleado,
      estimation,
      identidad,
      name,
      lastName,
      dayWorked,
      sDayWorked,
      payDay,
      sPayDay,
      age,
      description,
      idempleadolist
    } = this.state;

    if (sPayDay && sDayWorked && description != "") {
      this.setState({
        preloader: true
      });
      fs.collection("seedWorkers")
        .add({
          idEstimation: estimation.id,
          identidad,
          name,
          lastName,
          payDay: parseFloat(payDay),
          dayWorked: parseInt(dayWorked),
          age: parseInt(age),
          description: description,
          idlistempleado: idempleadolist
        })
        .then(trabajador => {
          fs.collection("employees")
            .doc(empleado.id)
            .update({
              status: true
            });
          this.setState({
            Loaded: true
          });
          this.props.navigation.state.params.save(trabajador.id);
          this.props.navigation.navigate("seedContainer");
        });
    } else {
      Alert.alert("Guardar Empleado", "Revise que los datos esten correctos!", [
        {
          text: "Aceptar",
          onPress: () => {
            this.setState({
              preloader: false,
              save: false
            });
          }
        }
      ]);
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
              borderBottomColor: "#fff",
              backgroundColor: "#077A65",
              height: 80
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
                onPress={() => this.props.navigation.navigate("seedContainer")}
              />
            </Left>
            <Body>
              <Title style={{ color: "#fff" }}>MANO OBRA</Title>
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
                  <Item
                    floatingLabel
                    style={{ width: "90%", height: 60 }}
                    error={this.state.eIdentidad}
                    success={this.state.sIdentidad}
                  >
                    <Icon type="MaterialIcons" name="accessibility" />
                    <Label>No. Identidad</Label>
                    <Input
                      disabled
                      maxLength={13}
                      keyboardType="number-pad"
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      value={this.state.identidad + ""}
                    />
                    <Icon name={this.state.iIdentidad} />
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
                    success={this.state.sName}
                    error={this.state.eName}
                    style={{ width: "90%", height: 60 }}
                  >
                    <Icon type="MaterialIcons" name="person" />
                    <Label>Nombre</Label>
                    <Input
                      disabled
                      style={{
                        fontSize: 18,
                        alignSelf: "flex-start"
                      }}
                      onChangeText={name => this.validate(name, "name")}
                      value={"" + this.state.name}
                    />
                    <Icon name={this.state.iName} />
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
                    success={this.state.sLastName}
                    error={this.state.eLastName}
                  >
                    <Icon type="MaterialIcons" name="people" />
                    <Label>Apellido</Label>
                    <Input
                      disabled
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      value={"" + this.state.lastName}
                    />
                    <Icon name={this.state.iLastName} />
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
                    error={this.state.eAge}
                    success={this.state.sAge}
                  >
                    <Icon type="MaterialIcons" name="accessibility" />
                    <Label>Edad</Label>
                    <Input
                      disabled
                      maxLength={2}
                      keyboardType="number-pad"
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      value={this.state.age + ""}
                    />
                    <Icon name={this.state.iAge} />
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
                    error={this.state.ePayDay}
                    success={this.state.sPayDay}
                  >
                    <Icon type="MaterialIcons" name="attach-money" />
                    <Label>Pago por día</Label>
                    <Input
                      maxLength={4}
                      keyboardType="number-pad"
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      onChangeText={payDay => this.validate(payDay, "payDay")}
                    />
                    <Icon name={this.state.iPayDay} />
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
                    error={this.state.eDayWorked}
                    success={this.state.sDayWorked}
                  >
                    <Icon type="MaterialIcons" name="access-time" />
                    <Label>Dias trabajados</Label>
                    <Input
                      keyboardType="number-pad"
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      onChangeText={dayWorked =>
                        this.validate(dayWorked, "dayWorked")
                      }
                    />
                    <Icon name={this.state.iDayWorked} />
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
                  <Row>
                    <Content padder style={{ width: "100%" }}>
                      <Form>
                        <Label>Actividad</Label>
                        <Textarea
                          rowSpan={3}
                          bordered
                          onChangeText={description =>
                            this.setState({
                              description
                            })
                          }
                        />
                      </Form>
                    </Content>
                  </Row>
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
                    onPress={this.saveWorker}
                  >
                    <Text style={{ color: "white" }}>GUARDAR</Text>
                  </Button>
                </View>
              </Form>
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
            </KeyboardAwareScrollView>
          </ScrollView>
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
