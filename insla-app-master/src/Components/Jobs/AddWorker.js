import React, { Component } from "react";
import {
  Container,
  Content,
  Row,
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
  Spinner,
  Textarea
} from "native-base";

import { StyleSheet, View, Alert, ScrollView } from "react-native";
import { fs, firebase } from "../Firebase/config";
import { Dropdown } from "react-native-material-dropdown";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { sienna } from "color-name";
//import console = require("console");

export default class AddWorker extends Component {
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

  constructor(props) {
    super(props);

    this.state = {
      estimation: this.props.navigation.state.params.estimacion,
      empleado:this.props.navigation.state.params.empleado,
      identidad: this.props.navigation.state.params.empleado.data().id,
      idTemp:"",
      counterId: 0,
      name: this.props.navigation.state.params.empleado.data().name,
      lastName: this.props.navigation.state.params.empleado.data().lastName,
      payDay: " ",
      dayWorked: " ",
      age: this.props.navigation.state.params.empleado.data().age,
      description: " ",
      status: this.props.navigation.state.params.empleado.data().status,
      Loaded: false,

      //errors inputs
      ePayDay: false,
      eDayWorked: false,
      eDescription: false,
      eIdentidad: false,
      eName: false,
      eAge: false,
      eLastName: false,

      //succes inputs
      sPayDay: false,
      sDayWorked: false,
      sDescription: false,
      sIdentidad: false,
      sName: false,
      sAge: false,
      sLastName: false,

      //icon inputs
      iPayDay: "",
      iDayWorked: "",
      iDescription: "",
      iIdentidad: "",
      iName: "",
      iAge: "",
      iLastName: "",

      Loaded: true,
      saveState: true
    };
  }
  componentDidMount() {
    fs.collection("soilChapulin")
    .where("idEstimation", "==", this.state.estimation.id)
    .get()
    .then(query => {
      query.forEach(doc => {
        let temp = doc.data().idTemp.substr(4);
            if (parseInt(temp) > this.state.counterId) {
              this.setState({
                counterId: parseInt(temp)
              });
            }
      });
    }).then(() => {
        this.setState({
          counterId: this.state.counterId + 1
        });
      })
      .then(() => {
        this.setState({
          idTemp: "MAL-" + this.state.counterId,
          Loaded: true
        });
      });
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
        name: "" + worker.name,
        payDay: "" + worker.payDay,
        lastName: "" + worker.lastName,
        dayWorked: "" + worker.dayWorked,
        description: "" + worker.description,
        age: "" + worker.age
      });
    } else {
      this.setState({
        estimation: this.props.navigation.state.params.estimacion,
        Loaded: true
      });
    }
  }

  evaluation = (text, type) => {
    const regexPayDay = /\d{1,3}/;
    const regexDayWorked = /\d{1,2}/;
    const regexDescription = /^(?=.{3,20}$)[a-z]+(?:['_.\s][a-z]+)*$/i;
    const regexIdentidad = /\d{13}/;
    const regexName = /^(?=.{3,8}$)[a-z]+(?:['_.\s][a-z]+)*$/i;
    const regexLastName = /^(?=.{3,20}$)[a-z]+(?:['_.\s][a-z]+)*$/i;
    const regexAge = /\d{1,2}/;

    let regexMap = {
      PayDay: regexPayDay,
      DayWorked: regexDayWorked,
      Description: regexDescription,
      Identidad: regexIdentidad,
      Name: regexName,
      LastName: regexLastName,
      Age: regexAge
    };

    return regexMap[type].test(text);
  };

  // :::::::::::::::::::::: VALIDATIONS::::::::::::::::::::::
  validate = (text, type) => {
    const regexPayDay = /\d{1,3}/;
    const regexDayWorked = /\d{1,2}/;
    const regexDescription = /^(?=.{0,20}$)[a-z]+(?:['_.\s][a-z]+)*$/i;
    const regexIdentidad = /\d{13}/;
    const regexName = /^(?=.{3,8}$)[a-z]+(?:['_.\s][a-z]+)*$/i;
    const regexLastName = /^(?=.{3,20}$)[a-z]+(?:['_.\s][a-z]+)*$/i;
    const regexAge = /\d{1,2}/;

    if (type === "PayDay") {
      if (regexPayDay.test(text)) {
        this.setState({
          payDay: text,
          ePayDay: false,
          sPayDay: true,
          iPayDay: "checkmark-circle"
        });
      } else {
        this.setState({
          payDay: text,
          ePayDay: true,
          sPayDay: false,
          iPayDay: "close-circle"
        });
      }
    } else if (type === "DayWorked") {
      if (regexDayWorked.test(text)) {
        this.setState({
          dayWorked: text,
          eDayWorked: false,
          sDayWorked: true,
          iDayWorked: "checkmark-circle"
        });
      } else {
        this.setState({
          dayWorked: text,
          eDayWorked: true,
          sDayWorked: false,
          iDayWorked: "close-circle"
        });
      }
    } else if (type === "Description") {
      if (regexDescription.test(text)) {
        this.setState({
          description: text,
          eDescription: false,
          sDescription: true,
          iDescription: "checkmark-circle"
        });
      } else {
        this.setState({
          description: text,
          eDescription: true,
          sDescription: false,
          iDescription: "close-circle"
        });
      }
    } else if (type === "Identidad") {
      if (regexIdentidad.test(text)) {
        this.setState({
          identidad: text,
          eIdentidad: false,
          sIdentidad: true,
          iIdentidad: "checkmark-circle"
        });
      } else {
        this.setState({
          identidad: text,
          eIdentidad: true,
          sIdentidad: false,
          iIdentidad: "close-circle"
        });
      }
    } else if (type === "Name") {
      if (regexName.test(text)) {
        this.setState({
          name: text,
          eName: false,
          sName: true,
          iName: "checkmark-circle"
        });
      } else {
        this.setState({
          name: text,
          eName: true,
          sName: false,
          iName: "close-circle"
        });
      }
    } else if (type === "LastName") {
      if (regexLastName.test(text)) {
        this.setState({
          lastName: text,
          eLastName: false,
          sLastName: true,
          iLastName: "checkmark-circle"
        });
      } else {
        this.setState({
          lastName: text,
          eLastName: true,
          sLastName: false,
          iLastName: "close-circle"
        });
      }
    } else if (type === "Age") {
      if (regexAge.test(text)) {
        this.setState({
          age: text,
          eAge: false,
          sAge: true,
          iAge: "checkmark-circle"
        });
      } else {
        this.setState({
          age: text,
          eAge: true,
          sAge: false,
          iAge: "close-circle"
        });
      }
    }
  };
  //::::::::::::::::::::::::END VALIDATION ::::::::::::::::::::::

  // -------------------------Save User -----------------
  saveUser = () => {
    const {
      estimation,
      empleado,
      name,
      lastName,
      dayWorked,
      payDay,
      age,
      counterId,
      idTemp,
      description,
      Loaded,
      status,
      identidad
    } = this.state;

    if (
      name != "" &&
      lastName != "" &&
      dayWorked != 0 &&
      payDay != 0 &&
      age != 0 &&
      description != ""
    ) {
      if (age < 0 || age > 120) {
        Alert.alert("Guardar Empleado", "La edad es incorrecta", [
          {
            text: "Aceptar"
          }
        ]);
      }else if (payDay < 0 || payDay > 500) {
        Alert.alert("Guardar Empleado", "El pago por hora es incorrecto", [
          {
            text: "Aceptar"
          }
        ]);
      } else if (dayWorked > 30 || dayWorked < 0) {
        Alert.alert(
          "Guardar Empleado",
          "Un empleado no puede excederse más de 30 dias en esta labor",
          [
            {
              text: "Aceptar"
            }
          ]
        );
      } else {
        this.setState({
          Loaded: false
        });
        let worker = this.props.navigation.state.params.empleado.doc;
        fs.collection("employees")
          .where("id", "==", this.state.identidad)
          .get()
          .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              fs.collection("employees")
                .doc(doc.id)
                .update({ status: true });
            });
          });

        fs.collection("soilWorkers")
          .add({
            idEstimation: estimation.id,
            name,
            lastName,
            payDay: parseFloat(payDay),
            dayWorked: parseInt(dayWorked),
            age: parseInt(age),
            id: this.state.identidad,
            status: true,
            description,
            counterId:counterId,
            idTemp:idTemp
          })
          .then(trabajador => {
            fs.collection("employees")
            .doc(empleado.id)
            .update({
              status:true
            })
            this.setState({
              Loaded: true
            });
  
            this.props.navigation.state.params.save(trabajador.id);
            this.props.navigation.navigate("addSuelo");
          });
      }
    } else {
      Alert.alert("Guardar Empleado", "Complete todos los campos", [
        {
          text: "Aceptar"
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
                onPress={() => this.props.navigation.navigate("addSuelo")}
              />
            </Left>
            <Body>
              <Title style={{ color: "#fff", fontSize: 13 }}>EMPLEADO</Title>
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
                      onChangeText={identidad =>
                        this.validate(identidad, "identidad")
                      }
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
                      onChangeText={lastName =>
                        this.validate(lastName, "lastName")
                      }
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
                      onChangeText={Age => this.validate(Age, "Age")}
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
                      maxLength={3}
                      keyboardType="number-pad"
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      onChangeText={payDay => this.validate(payDay, "PayDay")}
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
                      maxLength={2}
                      keyboardType="number-pad"
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      onChangeText={dayWorked =>
                        this.validate(dayWorked, "DayWorked")
                      }
                    />
                    <Icon name={this.state.iDayWorked} />
                  </Item>
                </View>

                <View
                  style={{
                    width: "80%",
                    display: "flex",
                    alignItems: "center",
                    marginTop: 8
                  }}
                >
                  <Content padder style={{ width: "100%" }}>
                    <Form>
                      <Row
                        style={{
                          width: "100%",
                          alignSelf: "flex-start"
                        }}
                      >
                        <Icon type="MaterialIcons" name="description" />
                        <Text style={{ color: "gray" }}>
                          Actividad Realizada{" "}
                        </Text>
                      </Row>
                      <Textarea
                        rowSpan={3}
                        bordered
                        onChangeText={description =>
                          this.validate(description, "Description")
                        }
                        value={"" + this.state.description}
                      />
                    </Form>
                  </Content>
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
                    onPress={this.saveUser}
                  >
                    <Text style={{ color: "white" }}>GUARDAR</Text>
                  </Button>
                </View>
              </Form>
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
