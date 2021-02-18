import React, { Component } from "react";
import {
  Container,
  Body,
  Header,
  Icon,
  Text,
  Button,
  Left,
  Title,
  Input,
  Form,
  Item,
  Label,
  Right,
  Spinner
} from "native-base";
import { StyleSheet, View, Alert, ScrollView } from "react-native";
import { fs, firebase } from "../Firebase/config";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default class AddMaterials extends Component {
  //navigation option
  static navigationOptions = () => {
    let headerLeft = null;
    let gesturesEnable = false;
    let header = null;
    return {
      headerLeft,
      header,
      gesturesEnable
    };
  };

  //constructor
  constructor(props) {
    super(props);
    this.state = {
      farm: this.props.navigation.state.params.farm,
      id: "",
      counterId: 0,
      quantity: "",
      nombre: this.props.navigation.state.params.insumo.data().nombre,
      cantidad: this.props.navigation.state.params.insumo.data().cantidad,
      descripcion: this.props.navigation.state.params.insumo.data().descripcion,

      taken: false,
      Loaded: true,
      preloader: false,
      save: false,

      //errors
      eId: false,
      eName: false,
      eQuantity: false,
      eDescription: false,

      //success
      sId: false,
      sName: false,
      sQuantity: false,
      sDescription: false,

      //Icons
      iId: "",
      iName: "",
      iQuantity: "",
      iDescription: ""
    };
  }
  componentDidMount() {
    fs.collection("concentrate")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          let id = doc.data().id.substr(6);
          if (parseInt(id) > this.state.counterId) {
            this.setState({
              counterId: parseInt(id)
            });
          }
        });
      })
      .then(() => {
        this.setState({
          counterId: this.state.counterId + 1
        });
      })
      .then(() => {
        this.setState({
          id: "CONTR-" + this.state.counterId,
          Loaded: true
        });
      });
  }

  //::::::::::::::::::::::::VALIDATIONS:::::::::::::::::::::::::
  validate = (data, type) => {
    const regexQuantity = /^[0-9]+([.])?([0-9]+)?$/;
    const regexDescription = /^[a-z ,.-]+$/i;
    if (type === "name") {
      if (regexName.test(data)) {
        this.setState({
          name: data,
          sName: true,
          eName: false,
          iName: "checkmark-circle"
        });
      } else {
        this.setState({
          sName: false,
          name: data,
          eName: true,
          iName: "close-circle"
        });
      }
    } else if (type === "quantity") {
      if (regexQuantity.test(data)) {
        this.setState({
          quantity: data,
          sQuantity: true,
          eQuantity: false,
          iQuantity: "checkmark-circle"
        });
      } else {
        this.setState({
          sQuantity: false,
          eQuantity: true,
          quantity: data,
          iQuantity: "close-circle"
        });
      }
    } else if (type === "description") {
      if (regexDescription.test(data)) {
        this.setState({
          description: data,
          sDescription: true,
          eDescription: false,
          iDescription: "checkmark-circle"
        });
      } else {
        this.setState({
          description: data,
          sDescription: false,
          eDescription: true,
          iDescription: "close-circle"
        });
      }
    }
  };
  ////////END VALIDATION

  save = () => {
    const {
      farm,
      id,
      name,
      quantity,
      description,
      sQuantity,
      nombre,
      cantidad,
      descripcion
    } = this.state;
    if (sQuantity) {
      this.setState({
        preloader: true,
        save: true
      });
      fs.collection("concentrate")
        .add({
          idFarm: farm.id,
          id: id,
          name: nombre,
          stock: parseFloat(quantity),
          description: descripcion,
          quantity: parseFloat(cantidad)
        })
        .then(concentrate => {
          this.props.navigation.state.params.save(concentrate.id);
          this.props.navigation.navigate("concentrate");
        });
    } else {
      Alert.alert("", "Rellene todos los campos", [], {
        cancelable: true
      });
    }
  };
  render() {
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
              style={{ fontSize: 40, color: "#fff", padding: 5 }}
              onPress={() => this.props.navigation.navigate("concentrate")}
            />
          </Left>
          <Body>
            <Title style={{ color: "#fff" }}>NUEVO</Title>
          </Body>
          <Right />
        </Header>
        <ScrollView style={{ flex: 1 }}>
          <KeyboardAwareScrollView
            resetScrollToCoords={{ x: 0, y: 0 }}
            keyboardOpeningTime={250}
            scrollEnabled={false}
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
                  <Label>Código</Label>
                  <Input
                    maxLength={4}
                    disabled={true}
                    keyboardType="number-pad"
                    value={this.state.id}
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
                  success={this.state.snombre}
                  error={this.state.enombre}
                >
                  <Icon type="MaterialIcons" name="person" />
                  <Label>Nombre</Label>
                  <Input
                    disabled={true}
                    value={this.state.nombre}
                    style={{ fontSize: 18, alignSelf: "flex-start" }}
                  />
                  <Icon name={this.state.inombre} />
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
                  success={this.state.scantidad}
                  error={this.state.ecantidad}
                >
                  <Icon type="MaterialIcons" name="all-inclusive" />
                  <Label>Cantidad ( libras por empaque) </Label>
                  <Input
                    disabled={true}
                    maxLength={3}
                    keyboardType="decimal-pad"
                    value={this.state.cantidad.toString()}
                    style={{ fontSize: 18, alignSelf: "flex-start" }}
                  />
                  <Icon name={this.state.icantidad} />
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
                  style={{
                    width: "90%",
                    height: 80 /*backgroundColor: '#7fff00'*/
                  }}
                  success={this.state.scantidad}
                  error={this.state.ecantidad}
                >
                  <Icon type="MaterialIcons" name="description" />
                  <Label>Descripción</Label>
                  <Input
                    disabled={true}
                    value={this.state.descripcion}
                    multiline={true}
                    numberOfLines={3}
                    style={{
                      height: 60,
                      textAlignVertical: "top" /*backgroundColor: '#00ffff'*/
                    }}
                  />

                  <Icon name={this.state.idescripcion} />
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
                  success={this.state.sQuantity}
                  error={this.state.eQuantity}
                >
                  <Icon type="MaterialIcons" name="event-available" />
                  <Label>Cantidad existencia (empaques)</Label>
                  <Input
                    keyboardType="decimal-pad"
                    style={{ fontSize: 18, alignSelf: "flex-start" }}
                    onChangeText={quantity =>
                      this.validate(quantity, "quantity")
                    }
                  />
                  <Icon name={this.state.iQuantity} />
                </Item>
              </View>

              <View
                style={{
                  marginTop: "10%",
                  marginBottom: "10%",
                  width: "60%"
                }}
              >
                <Button style={style.addButton} full rounded success>
                  <Text style={{ color: "white" }} onPress={this.save}>
                    GUARDAR
                  </Text>
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
