import React, { Component } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import {
  Text,
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
  Container
} from "native-base";
import { firebase, fs } from "../../Firebase/config";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
export default class AddWorkers extends Component {
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
    const employee = this.props.navigation.state.params.employee;

    this.state = {
      id: employee.data().id,
      name: employee.data().name,
      lastName: employee.data().lastName,
      location: employee.data().location,
      age: employee.data().age,
      employee: employee,
      production: this.props.navigation.state.params.production,
      hours: 0,
      pay: 0,
      activity: "",

      Loaded: true,
      preloader: false,
      save: false,

      //errors
      eHours: false,
      ePay: false,
      eActivity: false,

      //success
      sHours: false,
      sPay: false,
      sActivity: false,

      //icons
      iHours: "",
      iPay: "",
      iActivity: ""
    };
  }

  //::::::::::::::::::::::::VALIDATIONS:::::::::::::::::::::::::
  validate = (data, type) => {
    const regexHours = /^[1-9]\d*$/; //recibe enteros y no permite que el primero sea un cero
    const regexPay = /^[+]?[1-9]{1,9}(?:.[0-9]{1,2})?$/; //numeros decimales que no comiencen con cero positivos y no permita mas de dos cifras significativsa
    const regexActivity = /^[A-Za-z]+[\s]*$/g; // solo letras

    if (type === "hours") {
      if (regexHours.test(data)) {
        this.setState({
          sHours: true,
          eHours: false,
          hours: data,
          iHours: "checkmark-circle"
        });
      } else {
        this.setState({
          sHours: false,
          eHours: true,
          hours: data,
          iHours: "close-circle"
        });
      }
    } else if (type === "pay") {
      if (regexPay.test(data)) {
        this.setState({
          sPay: true,
          ePay: false,
          pay: data,
          iPay: "checkmark-circle"
        });
      } else {
        this.setState({
          sPay: false,
          ePay: true,
          pay: data,
          iPay: "close-circle"
        });
      }
    } else if (type === "activity") {
      if (regexActivity.test(data)) {
        this.setState({
          sActivity: true,
          eActivity: false,
          activity: data,
          iActivity: "checkmark-circle"
        });
      } else {
        this.setState({
          sActivity: false,
          eActivity: true,
          activity: data,
          iActivity: "close-circle"
        });
      }
    }
  };

  ////////END VALIDATION

  //////// SAVE  LABOR
  save = async () => {
    const {
      sHours,
      sPay,
      sActivity,
      employee,
      production,
      hours,
      activity,
      pay,
      id,
      name,
      lastName,
      age,
      location
    } = this.state;
    if (sHours && sPay && sActivity) {
      this.setState({
        preloader: true,
        save: true
      });
      fs.collection("workforce_growthStage_chicken_breeding")
        .add({
          idEmployee: employee.id,
          idProduction: production.id,
          id,
          name,
          lastName,
          hours: parseInt(hours),
          activity,
          pay: parseFloat(pay),
          age: parseInt(age),
          location
        })
        .then(worker => {
          this.props.navigation.state.params.save(worker.id);
          this.props.navigation.navigate("GrowthStage");
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      console.log("al aprece no esta entrando en el save");
    }
  };
  /////// END SAVE

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
                  width: 50
                }}
                onPress={() => {
                  this.props.navigation.goBack();
                }}
              />
            </Left>
            <Body>
              <Title style={{ color: "#fff", fontSize: 14 }}>
                MANO DE OBRA
              </Title>
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
                      disabled={true}
                      value={this.state.id}
                      style={{
                        fontSize: 18,
                        alignSelf: "flex-start"
                      }}
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
                    <Label>Nombre</Label>
                    <Input
                      disabled={true}
                      value={this.state.name}
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
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
                    <Label>Apellido</Label>
                    <Input
                      disabled={true}
                      value={this.state.lastName}
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
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
                    <Icon type="MaterialIcons" name="all-inclusive" />
                    <Label>Edad</Label>
                    <Input
                      disabled={true}
                      value={this.state.age.toString()}
                      maxLength={2}
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
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
                    <Icon type="MaterialIcons" name="location-on" />
                    <Label>Dirección residencia</Label>
                    <Input
                      disabled={true}
                      value={this.state.location}
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
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
                    success={this.state.sHours}
                    error={this.state.eHours}
                  >
                    <Icon type="MaterialIcons" name="alarm" />
                    <Label>Horas trabajadas</Label>
                    <Input
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      keyboardType="number-pad"
                      onChangeText={hours => {
                        this.validate(hours, "hours");
                      }}
                    />
                    <Icon name={this.state.iHours} />
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
                    success={this.state.sPay}
                    error={this.state.ePay}
                  >
                    <Icon type="MaterialIcons" name="payment" />
                    <Label>Pago por hora</Label>
                    <Input
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      keyboardType="numeric"
                      onChangeText={pay => {
                        this.validate(pay, "pay");
                      }}
                    />
                    <Icon name={this.state.iPay} />
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
                    success={this.state.sActivity}
                    error={this.state.eActivity}
                  >
                    <Icon type="MaterialIcons" name="assistant" />
                    <Label>Actividad realizada</Label>
                    <Input
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      onChangeText={activity => {
                        this.validate(activity, "activity");
                      }}
                    />
                    <Icon name={this.state.iActivity} />
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
                    disabled={this.state.save}
                    onPress={() => {
                      this.save();
                    }}
                  >
                    <Text style={{ color: "white" }}>GUARDAR</Text>
                  </Button>
                </View>
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
