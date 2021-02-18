import React, { Component } from "react";
import { View, StyleSheet, TextInput, ScrollView, Alert } from "react-native";
import {
  Container,
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
export default class updateHarvest extends Component {
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
      identidad: this.props.navigation.state.params.item.data().identidad,
      name: this.props.navigation.state.params.item.data().name,
      lastName: this.props.navigation.state.params.item.data().lastName,
      payDay: this.props.navigation.state.params.item.data().payDay,
      dayWorked: this.props.navigation.state.params.item.data().dayWorked,
      age: this.props.navigation.state.params.item.data().age,
      description: this.props.navigation.state.params.item.data().description,
      transport: this.props.navigation.state.params.item.data().transport,
      idEstimation:this.props.navigation.state.params.item.data().idEstimation,
      idlistempleado:this.props.navigation.state.params.item.data().idlistempleado,
      Loaded: true,
      index: this.props.navigation.state.params.index,
      item: this.props.navigation.state.params.item,
            //errors
            epayDay: false,
            edayWorked: false,
            edescription: false,
            eTransport: false,
            //icons
            idescription: "checkmark-circle",
            ipayDay: "checkmark-circle",
            idayWorked: "checkmark-circle",
            iTransport: "checkmark-circle",
            //succes
            spayDay: true,
            sdayWorked: true,
            sdescription: true,
            sTransport: true,
         
    };
  }


  validate = (data, type) => {
    const regexpayDay = /\d{1,4}/;
    const regexdayWorked = /\d{1,3}/;
    const regexdescription = /^(?=.{3,15}$)[a-z]+(?:['_.\s][a-z]+)*$/i;
    const regexTransport = /\d{1,3}/; 
   
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
    } else if (type === "transport") {
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
  }

  saveWorker = () => {
    const {
      empleado,
      identidad,
      name,
      lastName,
      dayWorked,
      sdayWorked,
      payDay,
      spayDay,
      age,
      description,
      transport,
      sTransport,
      sdescription,
      idlistempleado,
      idEstimation,
      item,
      index
    } = this.state;

    console.log(spayDay,sdayWorked,sdescription,sTransport);
    if(spayDay && sdayWorked && sdescription && sTransport){
    fs.collection("harvestWorkers")
      .doc(empleado.id)
      .update({
          idEstimation: idEstimation,
          identidad:identidad,
          name:name,
          lastName:lastName,
          payDay: parseFloat(payDay),
          dayWorked: parseInt(dayWorked),
          age: parseInt(age),
          description:description,
          transport:transport,
          idlistempleado:idlistempleado
        }) 
        .then(() => {
          this.props.navigation.state.params.update(item.id, index);
          this.props.navigation.navigate("expensesHome");
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
        <Container>
          <Header style={styles.headerStyle}>
            <Left>
              <Icon
                type="MaterialIcons"
                name="arrow-back"
                style={styles.iconStyle}
                onPress={() => this.props.navigation.navigate("expensesHome")}
              />
            </Left>
            <Body>
              <Title style={styles.titleStyle}>EMPLEADO</Title>
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
              <Form style={styles.container}>

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
                    error={this.state.eId}
                    success={this.state.sId}
                  >
                    <Icon type="MaterialIcons" name="accessibility" />
                    <Label>No. Identidad</Label>
                    <Input
                      disabled
                      maxLength={13}
                      keyboardType="number-pad"
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      value={"" + this.state.identidad}
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
                      value={"" + this.state.name}
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
                    success={this.state.sLastNameName}
                    error={this.state.eLastNameName}
                  >
                    <Icon type="MaterialIcons" name="people" />
                    <Label>Apellido</Label>
                    <Input
                      disabled
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      value={""+ this.state.lastName}
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
                    error={this.state.epayDay}
                    success={this.state.spayDay}
                  >
                    <Icon type="MaterialIcons" name="attach-money" />
                    <Label>Pago por día</Label>
                    <Input
                      maxLength={3}
                      keyboardType="number-pad"
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      onChangeText={payDay => this.validate(payDay, "payDay")}
                      value={"" + this.state.payDay}
                    />
                    <Icon name={this.state.ipayDay} />
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
                    error={this.state.edayWorked}
                    success={this.state.sdayWorked}
                  >
                    <Icon type="MaterialIcons" name="access-time" />
                    <Label>Dias trabajados</Label>
                    <Input
                      maxLength={2}
                      keyboardType="number-pad"
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      onChangeText={dayWorked => this.validate(dayWorked, "dayWorked")}
                      value={"" + this.state.dayWorked}
                    />
                    <Icon name={this.state.idayWorked} />
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
                      value={"" + this.state.transport}
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
                      marginTop: 15
                    }}
                  >
                    <Row                         
                        style={{
                        width: "90%",                      
                        }}>
                        <Icon type="MaterialIcons" name="description" style={{ fontSize: 20}} />
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
                    style={styles.addButton}
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

const styles = StyleSheet.create({
  titleStyle: {
    color: "#fff"
  },
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
