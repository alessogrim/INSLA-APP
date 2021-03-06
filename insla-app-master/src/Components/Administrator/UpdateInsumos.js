import React from "react";
import {
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  Alert
} from "react-native";

import { NavigationActions } from "react-navigation";
import {
  Container,
  Header,
  Content,
  Form,
  Item,
  Input,
  Colors,
  Icon,
  Textarea,
  Label,
  View,
  Picker,
  Text,
  Root,
  Left,
  Right,
  Body,
  Button,
  Title
} from "native-base";
import { fs, firebase, db } from "../Firebase/config";
import { Dropdown } from "react-native-material-dropdown";

export default class AddInsumos extends React.Component {
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
      estimation: this.props.navigation.state.params.item,
      id:this.props.navigation.state.params.item.data().Codigo,
      nombre: this.props.navigation.state.params.item.data().Nombre,
      presentacion: this.props.navigation.state.params.item.data().Presentacion,
      precio: this.props.navigation.state.params.item.data().Precio,
      cantidad: this.props.navigation.state.params.item.data().Cantidad,
      Medida: this.props.navigation.state.params.item.data().Medida,
      tipo: this.props.navigation.state.params.item.data().tipo,
      existencia: this.props.navigation.state.params.item.data().existencia,
      index: this.props.navigation.state.params.index,
      item: this.props.navigation.state.params.item,
       //errors
       enombre: false,
       epresentacion: false,
       eprecio: false,
       ecantidad: false,
       emedida: false,
       etipo: false,
       eexistencia: false,
       //icons
       inombre: "checkmark-circle",
       ipresentacion: "checkmark-circle",
       iprecio: "checkmark-circle",
       icantidad: "checkmark-circle",
       imedida: "checkmark-circle",
       itipo: "checkmark-circle",
       iexistencia: "checkmark-circle",
       //success
       snombre: true,
       spresentacion: true,
       sprecio: true,
       scantidad: true,
       smedida: true,
       stipo: true,
       sexistencia: true,     
    };
  }
  validate = (data, type) => {
    const regexnombre = /^(?=.{3,15}$)[a-z]+(?:['_.\s][a-z]+)*$/i;
    const regexprecio = /^[0-9]+([.])?([0-9]+)?$/;
    const regexcantidad = /^[0-9]+([.])?([0-9]+)?$/;
    const regexexistencia = /^[0-9]+([.])?([0-9]+)?$/;
    const regexpresentacion = /^(?=.{3,15}$)[a-z]+(?:['_.\s][a-z]+)*$/;
    const regexmedida = /^(?=.{3,15}$)[a-z]+(?:['_.\s][a-z]+)*$/;
    const regextipo = /^(?=.{3,15}$)[a-z]+(?:['_.\s][a-z]+)*$/;
    if (type === "nombre") {
      if (regexnombre .test(data)) {
        this.setState({
          nombre : data,
          snombre : true,
          enombre : false,
          inombre : "checkmark-circle"
        });
      } else {
        this.setState({
          nombre : data,
          snombre : false,
          enombre : true,
          inombre : "close-circle"
        });
      }
    }
    else if (type === "precio") {
      if (regexprecio .test(data)) {
        this.setState({
          precio : data,
          sprecio : true,
          eprecio : false,
          iprecio : "checkmark-circle"
        });
      } else {
        this.setState({
          precio : data,
          sprecio : false,
          eprecio : true,
          iprecio : "close-circle"
        });
      }
    }
  
    else if (type === "cantidad") {
      if (regexcantidad .test(data)) {
        this.setState({
          cantidad : data,
          scantidad : true,
          ecantidad : false,
          icantidad : "checkmark-circle"
        });
      } else {
        this.setState({
          cantidad : data,
          scantidad : false,
          ecantidad : true,
          icantidad : "close-circle"
        });
      }
    }
  
    else if (type === "existencia") {
      if (regexexistencia .test(data)) {
        this.setState({
          existencia : data,
          sexistencia : true,
          eexistencia : false,
          iexistencia : "checkmark-circle"
        });
      } else {
        this.setState({
          existencia : data,
          sexistencia : false,
          eexistencia : true,
          iexistencia : "close-circle"
        });
      }
    }
    else if (type === "presentacion") {
      if (regexpresentacion.test(data)) {
        this.setState({
          presentacion  : data,
          spresentacion  : true,
          epresentacion  : false,
          ipresentacion  : "checkmark-circle"
        });
      } else {
        this.setState({
          presentacion  : data,
          spresentacion  : true,
          epresentacion  : false,
          ipresentacion  : "checkmark-circle"
        });
      }
    }
  
    else if (type === "tipo") {
      if (regextipo.test(data)) {
        this.setState({
          tipo  : data,
          stipo  : true,
          etipo  : false,
          itipo  : "checkmark-circle"
        });
      } else {
        this.setState({
          tipo  : data,
          stipo  : true,
          etipo  : false,
          itipo  : "checkmark-circle"
        });
      }
    }
    else if (type === "medida") {
      if (regexmedida.test(data)) {
        this.setState({
          medida  : data,
          smedida  : true,
          emedida  : false,
          imedida  : "checkmark-circle"
        });
      } else {
        this.setState({
          medida  : data,
          smedida  : true,
          emedida  : false,
          imedida  : "checkmark-circle"
        });
      }
    }
  
   }

  update = () => {
    const {
      id,
      nombre,
      presentacion,
      precio,
      cantidad,
      tipo,
      existencia,
      Medida,
      estimation,
      snombre,
      spresentacion,
      sprecio,
      scantidad,
      smedida,
      stipo,
      sexistencia,
      item,index,
    } = this.state; 

    if(snombre && scantidad && sprecio && sexistencia
      && spresentacion && smedida && stipo){
    fs.collection("insumos")
      .doc(estimation.id)
      .update({
        Codigo:id,
        Nombre: nombre,
        Presentacion: presentacion,
        Precio: parseFloat(precio),
        Cantidad: parseInt(cantidad),
        Medida:Medida,
        tipo:tipo,
        existencia: parseInt(existencia)
      })
      .then(() => {
        this.props.navigation.state.params.update(item.id, index);
        this.props.navigation.navigate("insumos");
      });
    }
  };
  render() {
    const {
      nombre,
      presentacion,
      precio,
      cantidad,
      tipo,
      existencia,
      Medida
    } = this.state;

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
              onPress={() =>
                this.props.navigation.navigate("insumos")
              }
            />
          </Left>
          <Body>
            <Title style={styles.titleStyle}>NUEVO</Title>
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
          <ScrollView style={{ width: "100%" }}>
            <View
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center"
              }}
            >
            <View
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  marginTop: "10%"
                }}
              >
                <Item floatingLabel style={{ width: "80%", height: 45 }}>
                  <Icon type="MaterialIcons" name="people" />
                  <Label>Código</Label>
                  <Input
                    style={{ fontSize: 18, alignSelf: "flex-start" }}
                    value={"" + this.state.id}
                  />
                </Item>
              </View>

              <View
                style={{
                  width: "80%",
                  display: "flex"
                }}
              >
                <Dropdown
                  label="Tipo de Insumo"
                  dropdownMargins={{ min: 5, max: 20 }}
                  dropdownPosition={-4}
                  data={[
                    { value: "Insecticida" },
                    { value: "Bactericida" },
                    { value: "Nematicida" },
                    { value: "Fungicida" }
                  ]}
                  value={tipo}
                  onChangeText={tipo => this.validate(tipo, "tipo")}
                />
              </View>
              <View
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <Item floatingLabel style={{ width: "80%", height: 45 }}
                  error={this.state.snombre}
                  success={this.state.snombre}
                >
                  <Icon type="MaterialIcons" name="spellcheck" />
                  <Label>Nombre</Label>
                  <Input
                    style={{ fontSize: 18, alignSelf: "flex-start" }}
                    onChangeText={nombre => this.validate(nombre, "nombre")}
                    value={nombre}
                  />
                  <Icon name={this.state.inombre} />
                </Item>
              </View>

              <View
                style={{
                  width: "80%",
                  display: "flex"
                }}
              >
                <Dropdown
                  label="Presentación"
                  dropdownMargins={{ min: 5, max: 20 }}
                  data={[{ value: "Solido" }, { value: "Liquido" }]}
                  onChangeText={presentacion => this.validate(presentacion, "presentacion")}
                  value={presentacion}
                />
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

                  error={this.state.sprecio}
                  success={this.state.sprecio}
                >
                  <Icon type="MaterialIcons" name="attach-money" />
                  <Label>Precio</Label>
                  <Input
                    keyboardType="numeric"
                    style={{
                      fontSize: 18
                    }}
                    onChangeText={precio => this.validate(precio, "precio")}
                    value={precio.toString()}
                  />
                  <Icon name={this.state.iprecio} />
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
                    width: "80%",
                    height: 45,
                    alignSelf: "flex-start"
                  }}
                  error={this.state.scantidad}
                  success={this.state.scantidad}
                >
                  <Icon type="MaterialIcons" name="view-headline" />
                  <Label>Cantidad (por empaque)</Label>
                  <Input
                    keyboardType="number-pad"
                    style={{ fontSize: 18 }}
                    onChangeText={cantidad => this.validate(cantidad, "cantidad")}
                    value={cantidad.toString()}
                  />
                  <Icon name={this.state.icantidad} />
                </Item>
              </View>

              <View
                style={{
                  width: "80%",
                  display: "flex"
                }}
              >
                <Dropdown
                  label="Medidas"
                  dropdownMargins={{ min: 5, max: 20 }}
                  data={[{ value: "Litro" }, { value: "Kilogramos" }]}
                  onChangeText={medida => this.validate(medida, "medida")}
                  value={Medida}
                />
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
                    width: "80%",
                    height: 45,
                    alignSelf: "flex-start"
                  }}
                  error={this.state.sexistencia}
                  success={this.state.sexistencia}
                >
                  <Icon type="MaterialIcons" name="list" />
                  <Label>Existencia</Label>
                  <Input
                    keyboardType="number-pad"
                    style={{ fontSize: 18 }}
                    onChangeText={existencia => this.validate(existencia, "existencia")}
                    value={existencia.toString()}
                  />
                  <Icon name={this.state.iexistencia} />
                </Item>
              </View>

              <View
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  marginTop: 40,
                  marginBottom: 40
                }}
              >
                <Button success     onPress={() => {
                    this.update();
                  }}>
                  <Text>ACTUALIZAR</Text>
                </Button>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
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
  }
});
