import React, { Component } from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import { fs, firebase } from "../Firebase/config";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  Header,
  Left,
  Body,
  Right,
  Title,
  Picker,
  Form,
  Icon,
  Button,
  Label,
  Item,
  Input
} from "native-base";

export default class UpdateSuelo extends Component {
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
      selected1: "",
      selected2: "",
      selected3: "",
      isLoading: false,
      propsJobsNavigation: [],
      personasArado: 0,
      personasMaleza: 0,
      personasEstabilizacion: 0,
      diasArado: 0,
      diasMaleza: 0,
      diasEstabilizacion: 0,
      pagoMaleza: 0,
      pagoArado: 0,
      pagoEstabilizacion: 0,
      cantidadEstabilizacion: 0,
      quimico: ""
    };
  }
  componentDidMount() {
    this.setState({
      propsJobsNavigation: [
        ...this.state.propsJobsNavigation,
        this.props.navigation.state.params
      ]
    });
  }
  updateSuelo = () => {
    if (
      this.state.selected1 == "" ||
      this.state.selected2 == "" ||
      this.state.selected3 == "" ||
      this.state.personasMaleza == 0 ||
      this.state.personasArado == 0 ||
      this.state.personasEstabilizacion == 0 ||
      this.state.pagoMaleza == 0 ||
      this.state.pagoArado == 0 ||
      this.state.pagoEstabilizacion == 0 ||
      this.state.diasMaleza == 0 ||
      this.state.diasArado == 0 ||
      this.state.diasEstabilizacion == 0 ||
      this.state.quimico == "" ||
      this.state.cantidadEstabilizacion == 0
    ) {
      Alert.alert("", "Favor ingrese todos los valores", [], {
        cancelable: true
      });
    } else if (this.state.personasMaleza > 500) {
      Alert.alert(
        "",
        "Favor ingrese una cantidad mas baja de personas trabajando en control de maleza",
        [],
        {
          cancelable: true
        }
      );
    } else if (this.state.personasArado > 500) {
      Alert.alert(
        "",
        "Favor ingrese una cantidad mas baja de personas trabajando en arado de suelo",
        [],
        {
          cancelable: true
        }
      );
    } else if (this.state.personasEstabilizacion > 500) {
      Alert.alert(
        "",
        "Favor ingrese una cantidad mas baja de personas trabajando en la establizacion del suelo",
        [],
        {
          cancelable: true
        }
      );
    } else if (this.state.pagoMaleza > 50000) {
      Alert.alert(
        "",
        "Favor ingrese una cantidad mas baja de pago para control de maleza",
        [],
        {
          cancelable: true
        }
      );
    } else if (this.state.pagoArado > 50000) {
      Alert.alert(
        "",
        "Favor ingrese una cantidad mas baja de pago para el arado del suelo",
        [],
        {
          cancelable: true
        }
      );
    } else if (this.state.pagoEstabilizacion > 50000) {
      Alert.alert(
        "",
        "Favor ingrese una cantidad mas baja de pago para la estabilizacion de suelo",
        [],
        {
          cancelable: true
        }
      );
    } else if (this.state.diasMaleza > 200) {
      Alert.alert(
        "",
        "Favor ingrese un valor mas bajo de cantidad de dias a trabajar en control de maleza",
        [],
        {
          cancelable: true
        }
      );
    } else if (this.state.diasArado > 200) {
      Alert.alert(
        "",
        "Favor ingrese un valor mas bajo de cantidad de dias a trabajar en arado de suelo",
        [],
        {
          cancelable: true
        }
      );
    } else if (this.state.diasEstabilizacion > 200) {
      Alert.alert(
        "",
        "Favor ingrese un valor mas bajo de cantidad de dias a trabajar en estabilizacion de suelo",
        [],
        {
          cancelable: true
        }
      );
    } else if (this.state.cantidadEstabilizacion > 30000) {
      Alert.alert(
        "",
        "Favor ingrese un valor mas bajo de cantidad de nutrientes",
        [],
        {
          cancelable: true
        }
      );
    } else {
      fs.collection("Labores")
        .doc(this.state.propsJobsNavigation[0].id)
        .update({
          Maleza: this.state.selected1,
          Arado: this.state.selected2,
          Estabilizacion: this.state.selected3,
          cantPersonasMaleza: parseInt(this.state.personasMaleza),
          cantPersonasArado: parseInt(this.state.personasArado),
          cantPersonasEstabilizacion: parseInt(
            this.state.personasEstabilizacion
          ),
          malezaPago: parseFloat(this.state.pagoMaleza),
          aradoPago: parseFloat(this.state.pagoArado),
          estabilizacionPago: parseFloat(this.state.pagoEstabilizacion),
          cantDiasMaleza: parseInt(this.state.diasMaleza),
          cantDiasArado: parseInt(this.state.diasArado),
          cantDiasEstabilizacion: parseInt(this.state.diasEstabilizacion),
          quimicoUtilizar: this.state.quimico,
          cantidadNutrientes: parseFloat(this.state.cantidadEstabilizacion)
        })
        .then(() => {
          this.props.navigation.navigate("App");
        });
    }
  };
  onValueChange1(value) {
    this.setState({
      selected1: value
    });
  }
  onValueChange2(value) {
    this.setState({
      selected2: value
    });
  }
  onValueChange3(value) {
    this.setState({
      selected3: value
    });
  }
  onValueChange4(value) {
    this.setState({
      quimico: value
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <Header style={styles.headerStyle}>
          <Left>
            <MaterialIcons
              name="arrow-back"
              style={styles.iconStyle}
              onPress={() => this.props.navigation.navigate("App")}
            />
          </Left>
          <Body>
            <Title style={styles.titleStyle}>Modificar Labor</Title>
          </Body>
          <Right></Right>
        </Header>
        <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
          keyboardOpeningTime={250}
          ScroolEnable={false}
        >
          <Form style={{}}>
            <Picker
              mode="dropdown"
              iosIcon={<Icon name="arrow-down" />}
              placeholder="Control de Maleza"
              style={styles.pickerStyle}
              placeholderIconColor="#007aff"
              selectedValue={this.state.selected1}
              onValueChange={this.onValueChange1.bind(this)}
            >
              <Picker.Item label="Mecánico" value="Mecánico" />
              <Picker.Item label="Químico" value="Químico" />
              <Picker.Item label="Ambos" value="Ambos" />
            </Picker>
            <View
              style={{ flexDirection: "row", justifyContent: "flex-start" }}
            >
              <Item
                style={{
                  fontSize: 5,
                  height: 50,
                  //marginLeft: 10,
                  //marginRight: 10,
                  top: -10,
                  borderWidth: 1,
                  borderColor: "#077A65",
                  //backgroundColor: "#7fff00",
                  width: "38%"
                }}
                floatingLabel
              >
                <Label>Cantidad Personas</Label>
                <Input
                  keyboardType="numeric"
                  onChangeText={personasMaleza => {
                    this.setState({ personasMaleza });
                  }}
                />
              </Item>
              <Item
                style={{
                  fontSize: 5,
                  height: 50,
                  //marginLeft: 10,
                  //marginRight: 10,
                  top: -10,
                  borderWidth: 1,
                  borderColor: "#077A65",
                  //backgroundColor: "#7fff00",
                  width: "18%"
                }}
                floatingLabel
              >
                <Label>Pago</Label>
                <Input
                  keyboardType="numeric"
                  onChangeText={pagoMaleza => {
                    this.setState({ pagoMaleza });
                  }}
                />
              </Item>
              <Item
                style={{
                  fontSize: 5,
                  height: 50,
                  //marginLeft: 10,
                  //marginRight: 10,
                  top: -10,
                  borderWidth: 1,
                  borderColor: "#077A65",
                  //backgroundColor: "#7fff00",
                  width: "30%"
                }}
                floatingLabel
              >
                <Label>Días a trabajar</Label>
                <Input
                  keyboardType="numeric"
                  onChangeText={diasMaleza => {
                    this.setState({ diasMaleza });
                  }}
                />
              </Item>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "flex-start" }}
            >
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                placeholder="Químico a utilizar"
                style={{
                  //borderStyle: "solid",
                  marginLeft: 10,
                  borderWidth: 1,
                  borderColor: "#077A65"
                  //backgroundColor: "#7fff00"
                }}
                //placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.quimico}
                onValueChange={this.onValueChange4.bind(this)}
              >
                <Picker.Item label="Herbicida" value="Herbicida" />
                <Picker.Item label="Fungicida" value="Fungicida" />
                <Picker.Item label="Fertilizante" value="Fertilizante" />
              </Picker>
            </View>
            <Picker
              mode="dropdown"
              iosIcon={<Icon name="arrow-down" />}
              placeholder="Arado"
              style={styles.pickerStyle}
              //placeholderStyle={{ color: "#bfc6ea" }}
              placeholderIconColor="#007aff"
              selectedValue={this.state.selected2}
              onValueChange={this.onValueChange2.bind(this)}
            >
              <Picker.Item label="Mecánico" value="Mecánico" />
              <Picker.Item label="Manual" value="Manual" />
            </Picker>
            <View
              style={{ flexDirection: "row", justifyContent: "flex-start" }}
            >
              <Item
                style={{
                  fontSize: 5,
                  height: 50,
                  //marginLeft: 10,
                  //marginRight: 10,
                  top: -10,
                  borderWidth: 1,
                  borderColor: "#077A65",
                  //backgroundColor: "#7fff00",
                  width: "38%"
                }}
                floatingLabel
              >
                <Label>Cantidad Personas</Label>
                <Input
                  keyboardType="numeric"
                  onChangeText={personasArado => {
                    this.setState({ personasArado });
                  }}
                />
              </Item>
              <Item
                style={{
                  fontSize: 5,
                  height: 50,
                  //marginLeft: 10,
                  //marginRight: 10,
                  top: -10,
                  borderWidth: 1,
                  borderColor: "#077A65",
                  //backgroundColor: "#7fff00",
                  width: "18%"
                }}
                floatingLabel
              >
                <Label>Pago</Label>
                <Input
                  keyboardType="numeric"
                  onChangeText={pagoArado => {
                    this.setState({ pagoArado });
                  }}
                />
              </Item>
              <Item
                style={{
                  fontSize: 5,
                  height: 50,
                  //marginLeft: 10,
                  //marginRight: 10,
                  top: -10,
                  borderWidth: 1,
                  borderColor: "#077A65",
                  //backgroundColor: "#7fff00",
                  width: "30%"
                }}
                floatingLabel
              >
                <Label>Días a trabajar</Label>
                <Input
                  keyboardType="numeric"
                  onChangeText={diasArado => {
                    this.setState({ diasArado });
                  }}
                />
              </Item>
            </View>
            <Picker
              mode="dropdown"
              iosIcon={<Icon name="arrow-down" />}
              placeholder="Estabilización de Nutrientes (Opcional)"
              style={styles.pickerStyle}
              //placeholderStyle={{ color: "#bfc6ea" }}
              placeholderIconColor="#007aff"
              selectedValue={this.state.selected3}
              onValueChange={this.onValueChange3.bind(this)}
            >
              <Picker.Item
                label="Alcalización (PH Alto)"
                value="Alcalización"
              />
              <Picker.Item
                label="Acidificación (PH Bajo)"
                value="Acidificación "
              />
              <Picker.Item label="Micro y Macro Nutrientes" value="Micro" />
            </Picker>
            <View
              style={{ flexDirection: "row", justifyContent: "flex-start" }}
            >
              <Item
                style={{
                  fontSize: 5,
                  height: 50,
                  //marginLeft: 10,
                  //marginRight: 10,
                  top: -10,
                  borderWidth: 1,
                  borderColor: "#077A65",
                  //backgroundColor: "#7fff00",
                  width: "38%"
                }}
                floatingLabel
              >
                <Label>Cantidad Personas</Label>
                <Input
                  keyboardType="numeric"
                  onChangeText={personasEstabilizacion => {
                    this.setState({ personasEstabilizacion });
                  }}
                />
              </Item>
              <Item
                style={{
                  fontSize: 5,
                  height: 50,
                  //marginLeft: 10,
                  //marginRight: 10,
                  top: -10,
                  borderWidth: 1,
                  borderColor: "#077A65",
                  //backgroundColor: "#7fff00",
                  width: "18%"
                }}
                floatingLabel
              >
                <Label>Pago</Label>
                <Input
                  keyboardType="numeric"
                  onChangeText={pagoEstabilizacion => {
                    this.setState({ pagoEstabilizacion });
                  }}
                />
              </Item>
              <Item
                style={{
                  fontSize: 5,
                  height: 50,
                  //marginLeft: 10,
                  //marginRight: 10,
                  top: -10,
                  borderWidth: 1,
                  borderColor: "#077A65",
                  //backgroundColor: "#7fff00",
                  width: "30%"
                }}
                floatingLabel
              >
                <Label>Días a trabajar</Label>
                <Input
                  keyboardType="numeric"
                  onChangeText={diasEstabilizacion => {
                    this.setState({ diasEstabilizacion });
                  }}
                />
              </Item>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "flex-start" }}
            >
              <Item
                style={{
                  fontSize: 5,
                  height: 50,
                  //marginLeft: 10,
                  //marginRight: 10,
                  top: -10,
                  borderWidth: 1,
                  borderColor: "#077A65",
                  //backgroundColor: "#7fff00",
                  width: "50%"
                }}
                floatingLabel
              >
                <Label>Cantidad de nutrientes</Label>
                <Input
                  keyboardType="numeric"
                  onChangeText={cantidadEstabilizacion => {
                    this.setState({ cantidadEstabilizacion });
                  }}
                />
              </Item>
            </View>
          </Form>
        </KeyboardAwareScrollView>
        <Button
          style={styles.buttonStyle}
          full
          rounded
          success
          onPress={() => this.updateSuelo()}
        >
          <Text style={{ color: "white" }}>Modificar</Text>
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  titleStyle: {
    color: "#fff"
  },
  container: {
    flexDirection: "column"
  },
  headerStyle: {
    borderBottomColor: "#fff",
    backgroundColor: "#077A65",
    marginTop: StatusBar.currentHeight
  },
  iconStyle: {
    fontSize: 40,
    color: "#fff"
  },
  pickerStyle: {
    //borderStyle: "solid",
    height: 40,
    marginTop: 3,
    marginRight: 10
    //borderWidth: 1,
    //borderColor: "#077A65",
    //backgroundColor: "#7fff00"
  },
  buttonStyle: {
    backgroundColor: "#077A65",
    marginTop: 30,
    marginLeft: 10,
    marginRight: 10
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
