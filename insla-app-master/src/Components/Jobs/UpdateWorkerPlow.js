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
  Row
} from "native-base";
import { firebase, fs } from "../Firebase/config";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import home from "./PlowHome";
export default class UpdateWorkerPlow extends Component {
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
      id:this.props.navigation.state.params.item.data().id,
      name: this.props.navigation.state.params.item.data().name,
      lastName: this.props.navigation.state.params.item.data().lastName,
      payDay: this.props.navigation.state.params.item.data().payDay,
      dayWorked: this.props.navigation.state.params.item.data().dayWorked,
      age: this.props.navigation.state.params.item.data().age,
      description: this.props.navigation.state.params.item.data().description,
      idEstimation:this.props.navigation.state.params.item.data().idEstimation,
      idlistempleado:this.props.navigation.state.params.item.data().idlistempleado,
      Loaded: true,
      index: this.props.navigation.state.params.index,
      item: this.props.navigation.state.params.item,
            //errors
            epayDay: false,
            edayWorked: false,
            edescription: false,
            //icons
            idescription: "checkmark-circle",
            ipayDay: "checkmark-circle",
            idayWorked: "checkmark-circle",
            //succes
            spayDay: true,
            sdayWorked: true,
            sdescription: true,
         
    };
  }


  validate = (data, type) => {
    const regexpayDay = /\d{1,4}/;
    const regexdayWorked = /\d{1,3}/;
    const regexdescription = /^(?=.{3,15}$)[a-z]+(?:['_.\s][a-z]+)*$/i;
   
    if (type === "description") {
      if (regexdescription.test(data)) {
        this.setState({
          description: data,
          sdescription: true,
          edescription: false,
          idescription: "ios-checkmark-circle"
        });
      } else {
        this.setState({
          description: data,
          sdescription: true,
          edescription: false,
          idescription: "ios-checkmark-circle"
        });
      } 
    }else if (type === "payDay") {
      if (regexpayDay.test(data)) {
        this.setState({
          payDay: data,
          spayDay: true,
          epayDay: false,
          ipayDay: "checkmark-circle"
        });
      } else {
        this.setState({
          payDay: data,
          spayDay: false,
          epayDay: true,
          ipayDay: "close-circle"
        });
      } 
    }else if (type === "dayWorked") {
      if (regexdayWorked.test(data)) {
        this.setState({
          dayWorked: data,
          sdayWorked: true,
          edayWorked: false,
          idayWorked: "checkmark-circle"
        });
      } else {
        this.setState({
          dayWorked: data,
          sdayWorked: false,
          edayWorked: true,
          idayWorked: "close-circle"
        });
      }
    }
  }

  saveWorker = () => {
    const {
      empleado,
      id,
      name,
      lastName,
      dayWorked,
      sdayWorked,
      payDay,
      spayDay,
      age,
      description,
      sdescription,
      idlistempleado,
      idEstimation,
      item,
      index
    } = this.state;

    console.log(spayDay,sdayWorked,sdescription);
    if(spayDay && sdayWorked && sdescription){
    fs.collection("plowWorkers")
      .doc(empleado.id)
      .update({
          idEstimation: idEstimation,
          id:id,
          name:name,
          lastName:lastName,
          payDay: parseFloat(payDay),
          dayWorked: parseInt(dayWorked),
          age: parseInt(age),
          description:description,
          idlistempleado:idlistempleado
        }) 
        .then(() => {
          this.props.navigation.state.params.update(item.id, index);
          this.props.navigation.navigate("plowHome");
        });
      }
  }

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
        <View
          style={{
            display: "flex",
            flexDirection: "column"
          }}
        >
          <Header style={styles.headerStyle}>
            <Left>
              <Icon
                type="MaterialIcons"
                name="arrow-back"
                style={styles.iconStyle}
                onPress={() => this.props.navigation.navigate("plowHome")}
              />
            </Left>
            <Body>
              <Title style={styles.titleStyle}>EMPLEADO</Title>
            </Body>
            <Right />
          </Header>
          <View
            style={{
              display: "flex",
              height: "100%",
              alignItems: "center"
            }}
          >
            <ScrollView scrollEnabled="false" style={{ width: "100%" }}>
              <KeyboardAwareScrollView
                resetScrollToCoords={{ x: 0, y: 0 }}
                keyboardOpeningTime={250}
                ScroolEnable={false}
              >
                <View
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  <View
                    style={{
                      marginTop: "10%",
                      width: "100%",
                      display: "flex",
                      alignItems: "center"
                    }}
                  >
                    <Item
                      floatingLabel
                      style={{ width: "80%", height: 45 }}
                      success={this.state.sId}
                      error={this.state.eId}
                    >
                      <Icon type="MaterialIcons" name="accessibility" />
                      <Label>No. identidad</Label>
                      <Input
                        keyboardType="numeric"
                        style={{ fontSize: 18, alignSelf: "flex-start" }}
                        value={this.state.id}
                      //value={"" + this.state.identidad}
                      />
                  
                    </Item>
                  </View>
                  <View
                    style={{
                      marginTop: "10%",
                      width: "100%",
                      display: "flex",
                      alignItems: "center"
                    }}
                  >
                    <Item
                      floatingLabel
                      style={{ width: "80%", height: 45 }}
                      success={this.state.sName}
                      error={this.state.eName}
                    >
                      <Icon type="MaterialIcons" name="person" />
                      <Label>Nombre</Label>
                      <Input
                        style={{ fontSize: 18, alignSelf: "flex-start" }}

                      value={"" + this.state.name}
                      />
                     
                    </Item>
                  </View>

                  <View
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      marginTop: 8
                    }}
                  >
                    <Item
                      floatingLabel
                      style={{ width: "80%", height: 45 }}
                      success={this.state.sLastNameName}
                      error={this.state.eLastNameName}
                    >
                      <Icon type="MaterialIcons" name="people" />
                      <Label>Apellido</Label>
                      <Input
                        style={{ fontSize: 18 }}

                      value={"" + this.state.lastName}
                      />
                      
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
                    <Item
                      floatingLabel
                      style={{
                        width: "40%",
                        height: 45,
                        alignSelf: "flex-start"
                      }}
                     
                    >
                      <Icon type="MaterialIcons" name="fingerprint" />
                      <Label>Edad</Label>
                      <Input
                        keyboardType="number-pad"
                        style={{
                          fontSize: 18
                        }}
                       
                      value={"" + this.state.age}
                      />
                   
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
                    <Item
                      floatingLabel
                      style={{
                        width: "60%",
                        height: 45,
                        alignSelf: "flex-start"
                      }}
                      error={this.state.sdayWorked}
                      success={this.state.sdayWorked}
                    >
                      <Icon type="MaterialIcons" name="access-time" />
                      <Label>Dias trabajados</Label>
                      <Input
                        maxLength={4}
                        keyboardType="number-pad"
                        style={{ fontSize: 18 }}
                        onChangeText={dayWorked => this.validate(dayWorked, "dayWorked")}
                      value={"" + this.state.dayWorked}
                      />
                       <Icon name={this.state.idayWorked} />
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
                    <Item
                      floatingLabel
                      style={{
                        width: "60%",
                        height: 60,
                        alignSelf: "flex-start"
                      }}
                      error={this.state.epayDay}
                      success={this.state.spayDay}
                    >
                      <Icon type="MaterialIcons" name="attach-money" />
                      <Label>Pago por día</Label>
                      <Input
                        keyboardType="numeric"
                        style={{ fontSize: 18 }}
                        onChangeText={payDay => this.validate(payDay, "payDay")}
                      value={"" + this.state.payDay}
                      />
                       <Icon name={this.state.ipayDay} />
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
                    <Row                         
                        style={{
                        width: "80%",                      
                        alignSelf: "flex-start"
                        }}>
                        <Icon type="MaterialIcons" name="description" />
                        <Text style={{color:"gray"}}>Actividad realizada</Text>
                        <Icon name={this.state.idescription} />
                    </Row>
                    <Content padder style={{width: "100%"}}>
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
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      marginTop: 8
                    }}
                  >
                    <Button success onPress={this.saveWorker}>
                      <Text>Guardar</Text>
                    </Button>
                  </View>
                </View>
              </KeyboardAwareScrollView>
            </ScrollView>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
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
  },
  errorValitation: {
    borderColor: "red"
  }
});
