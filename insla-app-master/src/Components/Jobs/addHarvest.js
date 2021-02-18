import React, { Component } from "react";
import { View, StyleSheet, TextInput, ScrollView, Alert } from "react-native";
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
  Input
} from "native-base";
import { firebase, fs } from "../Firebase/config";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
export default class addHarvest extends Component {
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
      transport: 0,
      payDay: 0,
      numDays: 0,
      numPeople: 0,
      Loaded: false
    };
  }
  componentDidMount() {
    let action = this.props.navigation.state.params.action;
    if (action === "edit") {
      let labor = this.props.navigation.state.params.doc.data();
      this.setState({
        estimation: this.props.navigation.state.params.estimation,
        Loaded: true,
        transport: "" + labor.transport,
        payDay: "" + labor.payDay,
        numDays: "" + labor.numDays,
        numPeople: "" + labor.numPeople
      });
    } else {
      this.setState({
        estimation: this.props.navigation.state.params,
        Loaded: true
      });
    }
  }
  saveLabor = () => {
    const {
      estimation,
      transport,
      payDay,
      numDays,
      numPeople,
      Loaded
    } = this.state;

    if (
      transport != 0 &&
      payDay != 0 &&
      numDays != 0 &&
      numPeople != 0 
    ) {
      if (transport < 0 ) {
        Alert.alert("Guardar Cosecha", "El coste de transporte es incorrecto", [
          {
            text: "Aceptar"
          }
        ]);
      } else if (payDay < 0 || payDay > 500) {
        Alert.alert("Guardar Cosecha", "El pago por dia es incorrecto", [
          {
            text: "Aceptar"
          }
        ]);
      } else if (numDays > 30 || numDays < 0) {
        Alert.alert("Guardar Cosecha", "Las horas trabajadas son incorrectas", [
          {
            text: "Aceptar"
          }
        ]);
      } else {
        this.setState({
          Loaded: false
        });

        let action = this.props.navigation.state.params.action;

        if (action === "edit") {
          let labor = this.props.navigation.state.params.doc;
          let reference = this.props.navigation.state.params.estimation;

          fs.collection("Labores")
            .doc(labor.id)
            .update({
              idEstimation: reference.id,
              transport: parseFloat(transport),
              numDays: parseFloat(numDays),
              payDay: parseInt(payDay),
              numPeople: parseInt(numPeople)
            })
            .then(response => {
              this.setState({
                Loaded: true
              });
              this.props.navigation.navigate("App");
            });
        } else {
          fs.collection("Labores")
            .add({
              idEstimation: estimation.id,
              transport: parseFloat(transport),
              numDays: parseFloat(numDays),
              payDay: parseInt(payDay),
              numPeople: parseInt(numPeople)
            })
            .then(() => {
              this.setState({
                Loaded: true
              });
              this.props.navigation.navigate("App");
            });
        }
      }
    } else {
      Alert.alert("Guardar Cosecha", "Complete todos los campos", [
        {
          text: "Aceptar"
        }
      ]);
    }
  };

  render() {
    let action = this.props.navigation.state.params.action;

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
                onPress={() => this.props.navigation.navigate("expensesHome")}
              />
            </Left>
            <Body>
              <Title style={styles.titleStyle}>COSECHA</Title>
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
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <View
                  style={{
                    marginTop: "10%",
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  <Item floatingLabel style={{ width: "80%", height: 60 }}>
                    <Icon type="MaterialIcons" name="person" />
                    <Label>Costo Transporte:</Label>
                    <Input
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      keyboardType={"number-pad"}
                      onChangeText={transport => 
                        this.setState({ transport })
                      }
                      value={"" + this.state.transport}
                    />
                  </Item>
                </View>

                <View
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: 8
                  }}
                >
                  <Item floatingLabel style={{ width: "80%", height: 60 }}>
                    <Icon type="MaterialIcons" name="people" />
                    <Label>Numero de trabajadores:</Label>
                    <Input
                      style={{ fontSize: 18 }}
                      keyboardType={"number-pad"}
                      onChangeText={numPeople => this.setState({ numPeople })}
                      value={"" + this.state.numPeople}
                    />
                  </Item>
                </View>
                <View
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: 8
                  }}
                >
                  <Item
                    floatingLabel
                    style={{
                      width: "80%",
                      height: 60,
                      alignSelf: "flex-start"
                    }}
                  >
                    <Icon type="MaterialIcons" name="fingerprint" />
                    <Label>Pago diario:</Label>
                    <Input
                      keyboardType="number-pad"
                      style={{
                        fontSize: 18
                      }}
                      onChangeText={payDay => this.setState({ payDay })}
                      value={"" + this.state.payDay}
                    />
                  </Item>
                </View>
                <View
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: 8
                  }}
                >
                  <Item
                    floatingLabel
                    style={{
                      width: "80%",
                      height: 60,
                      alignSelf: "flex-start"
                    }}
                  >
                    <Icon type="MaterialIcons" name="access-time" />
                    <Label>Dias trabajados:</Label>
                    <Input
                      keyboardType="number-pad"
                      style={{ fontSize: 18 }}
                      onChangeText={numDays => this.setState({ numDays })}
                      value={"" + this.state.numDays}
                    />
                  </Item>
                </View>
                <View
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: 8
                  }}
                >
                </View>
                <View
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: 8
                  }}
                >
                </View>
                <View
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: 40,
                    backgroundColor:"#077A65"
                  }}
                >
                  <Button buttonStyle style={{width:"80%"}}onPress={this.saveLabor}>
                    <Text>{action == "edit" ? "ACTUALIZAR" : "AÑADIR"}</Text>
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

  buttonStyle1: {
    backgroundColor: "#0000EE",
    marginTop: 30,
    marginLeft: 10,
    marginRight: 10,
    width: "70%"
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
  }
});

