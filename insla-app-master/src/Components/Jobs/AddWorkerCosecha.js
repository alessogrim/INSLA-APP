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
      empleado:this.props.navigation.state.params.empleado, 
      identidad:this.props.navigation.state.params.empleado.data().id,
      name: this.props.navigation.state.params.empleado.data().name,
      lastName: this.props.navigation.state.params.empleado.data().lastName,
      payDay: 0,
      dayWorked: 0,
      age: this.props.navigation.state.params.empleado.data().age,
      description: " ",
      transport: 0,
      Loaded: true,
      idempleadolist:this.props.navigation.state.params.empleado.id,

      //errors inputs
      ePayDay: false,
      eDayWorked: false,
      eDescription: false,
      eTransport: false,

      //succes inputs
      sPayDay: false,
      sDayWorked: false,
      sDescription: false,
      sTransport: false,

      //icon inputs
      iPayDay: "close-circle",
      iDayWorked: "close-circle",
      iDescription: "close-circle",
      iTransport: "close-circle",

    };
  }

   // :::::::::::::::::::::: VALIDATIONS::::::::::::::::::::::
   validate = (data, type) => {
    const regexPayDay =  /\d{1,4}/;
    const regexDayWorked = /\d{1,3}/;
    const regexDescription = /^(?=.{3,15}$)[a-z]+(?:['_.\s][a-z]+)*$/i;
    const regexTransport = /\d{1,3}/;

    if (type === "description") {
      if (regexDescription.test(data)) {
        this.setState({
          description: data,
          eDescription: false,
          sDescription: true,
          iDescription: "ios-checkmark-circle"
        });
      } else {
        this.setState({
          description: data,
          eDescription: false,
          sDescription: true,
          iDescription : "ios-checkmark-circle"
        });
      }
    } else if (type === "payDay") {
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
    }  else if (type === "transport") {
      if (regexTransport.test(data)) {
        this.setState({
          transport: data,
          eTransport: false,
          sTransport: true,
          iTransport: "checkmark-circle"
        });
      } else {
        this.setState({
          transport: data,
          eTransport: true,
          sTransport: false,
          iTransport: "close-circle"
        });
      }
    }
  };

  //::::::::::::::::::::::::END VALIDATION ::::::::::::::::::::::
  componentDidMount() {
    let action;
    if (this.props && this.props.navigation && this.props.navigation.state && this.props.navigation.state.params.estimacion && this.props.navigation.state.params.estimacion.action) {
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
        age: "" + worker.age,
        transport: "" + worker.transport
      });
    } else {
      if (this.props.navigation && this.props.navigation.state && this.props.navigation.state.params.estimacion) {
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
      sDescription,
      transport,
      sTransport,
      idempleadolist,
    } = this.state;

    /*if (
      name != "" &&
      lastName != "" &&
      dayWorked != 0 &&
      payDay != 0 &&
      age != 0 &&
      description != "" &&
      transport != 0
    ) {
      if (age < 0 || age > 120) {
        Alert.alert("Guardar Empleado", "La edad es incorrecta", [
          {
            text: "Aceptar"
          }
        ]);
      } else if (payDay < 0 || payDay > 500) {
        Alert.alert("Guardar Empleado", "El pago por hora es incorrecto", [
          {
            text: "Aceptar"
          }
        ]);
      } else if (dayWorked > 30 || dayWorked < 0) {
        Alert.alert("Guardar Empleado", "Las horas trabajadas son inorrectas", [
          {
            text: "Aceptar"
          }
        ]);
      } else if (transport < 0 || transport > 300) {
        Alert.alert("Guardar Empleado", "El transporte es incorrecto", [
          {
            text: "Aceptar"
          }
        ]);
      } 
      else {
        this.setState({
          Loaded: false
        });*/
    console.log(sPayDay,sDayWorked,sDescription,sTransport);
    if (sPayDay && sDayWorked && sDescription && sTransport) {
      fs.collection("harvestWorkers")
        .add({
          idEstimation: estimation.id,
          identidad,
          name,
          lastName,
          payDay: parseFloat(payDay),
          dayWorked: parseInt(dayWorked),
          age: parseInt(age),
          description:description,
          transport: parseInt(transport),
          idlistempleado:idempleadolist
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
          this.props.navigation.navigate("expensesHome");
          
        });
      }  
  };

  render() {
    const {
      estimation,
      
      id,
     
      name,
      
      lastName,
      
      dayWorked,
      
      payDay,
     
      age,
     
      description,
      
      Loaded,
    } = this.state;
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
                onPress={() => this.props.navigation.navigate("expensesHome")}
              />
            </Left>
            <Body>
              <Title  style={{ color: "#fff"}}>EMPLEADO</Title>
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
                      value={""+this.state.name}
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
                      value={""+ this.state.lastName}
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
                      value={this.state.age+""}
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
                    error={this.state.sDayWorked}
                    success={this.state.sDayWorked}
                  >
                    <Icon type="MaterialIcons" name="access-time" />
                    <Label>Dias trabajados</Label>
                    <Input
                      maxLength={2}
                      keyboardType="number-pad"
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      onChangeText={dayWorked => this.validate(dayWorked, "dayWorked")}
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
                  <Item
                    floatingLabel
                    style={{ width: "90%", height: 60 }}
                    error={this.state.eTransport}
                    success={this.state.sTransport}
                  >
                    <Icon type="MaterialIcons" name="attach-money" />
                    <Label>Transporte</Label>
                    <Input
                      maxLength={3}
                      keyboardType="number-pad"
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      onChangeText={transport => this.validate(transport, "transport")}
                    />
                    <Icon name={this.state.iTransport} />
                  </Item>
                </View>

                <View
                    style={{
                      width: "100%",
                      display: "flex",
                      alignSelf: "flex-start",
                      alignItems: "center",
                      marginTop: 30
                    }}
                  >
                    <Row                         
                        style={{
                        width: "90%",                      
                        }}>
                        <Icon type="MaterialIcons" name="description" style={{ fontSize: 20, marginRight: 2}} />
                        <Label>Actividad</Label>
                    </Row>
                    <Content padder style={{width: "95%"}}>
                      <Form>
                        <Textarea rowSpan={3} bordered 
                           onChangeText={description => this.validate(description, "description")}
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
                    onPress={this.saveWorker}
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
