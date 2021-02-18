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

export default class AddChapulinSeed extends Component {
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
      payForHour: 0,
      totalHours: 0,
      age: this.props.navigation.state.params.empleado.data().age,
      description: " ",
      Loaded: true,
      idempleadolist:this.props.navigation.state.params.empleado.id,

      //errors inputs
      ePayForHour: false,
      eTotalHours: false,
      eDescription: false,

      //succes inputs
      sPayForHour: false,
      sTotalHours: false,
      sDescription: false,

      //icon inputs
      iPayForHour: "",
      iTotalHours: "",
      iDescription: "",

    };
  }

   // :::::::::::::::::::::: VALIDATIONS::::::::::::::::::::::
   validate = (data, type) => {
    const regexPayForHour =  /\d{1,4}/
    const regexTotalHours = /\d{1,2}/;;
    const regexDescription = /([A-Z])\w+/i;

    if (type === "description") {
      if (regexDescription.test(data)) {
        this.setState({
          description: data,
          eDescription: false,
          sDescription: true,
          iDescription: "checkmark-circle"
        });
      } else {
        this.setState({
          description: data,
          eDescription: true,
          sDescription: false,
          iDescription : "close-circle"
        });
      }
    } else if (type === "payForHour") {
      if (regexPayForHour.test(data)) {
        this.setState({
          payForHour: data,
          ePayForHour: false,
          sPayForHour: true,
          iPayForHour: "checkmark-circle"
        });
      } else {
        this.setState({
          payForHour: data,
          ePayForHour: true,
          sPayForHour: false,
          iPayForHour: "close-circle"
        });
      }
    } else if (type === "totalHours") {
      if (regexTotalHours.test(data)) {
        this.setState({
          totalHours: data,
          eTotalHours: false,
          sTotalHours: true,
          iTotalHours: "checkmark-circle"
        });
      } else {
        this.setState({
          totalHours: data,
          eTotalHours: true,
          sTotalHours: false,
          iTotalHours: "close-circle"
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
        payForHour: "" + worker.payForHour,
        lastName: "" + worker.lastName,
        totalHours: "" + worker.totalHours,
        description: "" + worker.description,
        age: "" + worker.age
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
      totalHours,
      sTotalHours,
      payForHour,
      sPayForHour,
      age,
      description,
      sDescription,
      idempleadolist,
    } = this.state;

    
    console.log(sPayForHour,sTotalHours,sDescription);
    if (sPayForHour && sTotalHours && sDescription) {
      fs.collection("seedChapulin")
        .add({
          idEstimation: estimation.id,
          identidad,
          name,
          lastName,
          payForHour: parseFloat(payForHour),
          totalHours: parseInt(totalHours),
          age: parseInt(age),
          description:description,
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
          this.props.navigation.navigate("seedContainer");
          
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
              <Title  style={{ color: "#fff"}}>CHAPULÍN</Title>
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
                    <Label>Nombre Conductor</Label>
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
                    error={this.state.ePayForHour}
                    success={this.state.sPayForHour}
                  >
                    <Icon type="MaterialIcons" name="attach-money" />
                    <Label>Pago por hora</Label>
                    <Input
                      maxLength={4}
                      keyboardType="number-pad"
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      onChangeText={payForHour => {
                        this.validate(payForHour, "payForHour");
                      }}
                    />
                    <Icon name={this.state.iPayForHour} />
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
                    error={this.state.eTotalHours}
                    success={this.state.sTotalHours}
                  >
                    <Icon type="MaterialIcons" name="access-time" />
                    <Label>Horas trabajadas</Label>
                    <Input
                      keyboardType="number-pad"
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      onChangeText={totalHours => {
                        this.validate(totalHours, "totalHours");
                      }}
                    />
                    <Icon name={this.state.iTotalHours} />
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
                    style={{ width: "90%", height: 50 }}
                    error={this.state.eDescription}
                    success={this.state.sDescription}
                  >
                    <Icon type="MaterialIcons" name="description" />
                    <Label>Actividad</Label>
                    <Input
                      disabled={true}
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      value={""}
                    />
                    <Icon name={this.state.iDescription} />
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
                  <Content padder style={{width: "100%"}}>
                      <Form>
                        <Textarea rowSpan={3} bordered 
                                            onChangeText={description =>
                                              this.validate(description, "description")
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
