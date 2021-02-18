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
import home from "./PlowHome";
export default class UpdateWorkerNutrients extends Component {
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
      empleado:this.props.navigation.state.params.item, 
      identidad:this.props.navigation.state.params.item.data().id,
      name: this.props.navigation.state.params.item.data().name,
      lastName: this.props.navigation.state.params.item.data().lastName,
      payDay: this.props.navigation.state.params.empleado.data().payDay,
      dayWorked: this.props.navigation.state.params.empleado.data().dayWorked,
      age: this.props.navigation.state.params.item.data().age,
      description: this.props.navigation.state.params.item.data().description,
      status:this.props.navigation.state.params.empleado.data().status,
      idEstimation:this.props.navigation.state.params.item.data().idEstimation,
      idlistempleado:this.props.navigation.state.params.item.data().idlistempleado,
      Loaded: true,
      index: this.props.navigation.state.params.index,
      item: this.props.navigation.state.params.item,
      
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
  validate = (text, type) => {
    const regexPayDay = /\d{1,3}/;
    const regexDayWorked = /\d{1,2}/;
    const regexDescription = /^(?=.{0,20}$)[a-z]+(?:['_.\s][a-z]+)*$/i;
    const regexIdentidad= /\d{13}/;
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
          iDescription : "close-circle"
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
          iIdentidad : "close-circle"
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
          iName : "close-circle"
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
          iLastName : "close-circle"
        });
      }
    }else if (type === "Age") {
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
          iAge : "close-circle"
        });
      }
    }
  }

  saveWorker = () => {
    const {
      empleado,
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
      idlistempleado,
      idEstimation,
      item,
      index
    } = this.state;

    fs.collection("soilNutrients")
      .doc(empleado.id)
      .update({
          idEstimation: idEstimation,
          id:identidad,
          name:name,
          lastName:lastName,
          payDay: parseFloat(payDay),
          dayWorked: parseInt(dayWorked),
          age: parseInt(age),
          description:description,
          status: true
        }) 
        .then(() => {
          this.props.navigation.state.params.update(item.id, index);
          this.props.navigation.navigate("nutrientsHome");
        });
  }

  render() {
    const {
      idEstimation,
      
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
              onPress={() => this.props.navigation.navigate("nutrientsHome",this.state.empleado)}
            />
          </Left>
          <Body>
            <Title style={{ color: "#fff", fontSize: 13 }}>
              EMPLEADO
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
                    onChangeText={identidad => this.validate(identidad, "identidad")}
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
                    onChangeText={lastName =>
                      this.validate(lastName, "lastName")
                    }
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
                    maxLength={10}
                    keyboardType="number-pad"
                    style={{ fontSize: 18, alignSelf: "flex-start" }}
                    value={this.state.payDay.toString()}
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
                    maxLength={10}
                    keyboardType="number-pad"
                    style={{ fontSize: 18, alignSelf: "flex-start" }}
                    value={this.state.dayWorked.toString()}
                    onChangeText={dayWorked => this.validate(dayWorked, "DayWorked")}
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
                  <Content padder style={{width: "100%"}}>
                    <Form>
                    <Row                         
                        style={{
                        width: "100%",                      
                        alignSelf: "flex-start"
                         }}>
                        <Icon type="MaterialIcons" name="description" />
                        <Text style={{color:"gray"}}>Actividad Realizada{" "}</Text>

                    </Row>
                      <Textarea rowSpan={3} bordered 
                         onChangeText={description => this.validate(description, "Description")}
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