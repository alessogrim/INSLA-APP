import React from "react";
import {
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  Alert
} from "react-native";
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
  Spinner,
  Title
} from "native-base";
import { fs, firebase, db } from "../Firebase/config";
import { Dropdown } from "react-native-material-dropdown";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default class AddMateriales extends React.Component {
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
      nombre: this.props.navigation.state.params.item.data().nombre,
      precio: this.props.navigation.state.params.item.data().precio,
      existencia: this.props.navigation.state.params.item.data().existencia,
      descripcion: this.props.navigation.state.params.item.data().descripcion,
      index: this.props.navigation.state.params.index,
      item: this.props.navigation.state.params.item,
      //errors
      enombre: false,
      eprecio: false,
      eexistencia: false,
      edescripcion: false,  
      //icons
      inombre: "checkmark-circle",
      iprecio: "checkmark-circle",
      iexistencia: "checkmark-circle",
      idescripcion: "checkmark-circle",     
      //success
      snombre: true,
      sprecio: true,
      sexistencia: true,
      sdescripcion: true,
      Loaded: true
    };
  }

  validate = (data, type) => {
    const regexnombre = /^(?=.{3,15}$)[a-z]+(?:['_.\s][a-z]+)*$/i;
    const regexprecio = /^[0-9]+([.])?([0-9]+)?$/;
    const regexexistencia = /^[0-9]+([.])?([0-9]+)?$/;
    const regexdescripcion = /^(?=.{3,15}$)[a-z]+(?:['_.\s][a-z]+)*$/i;

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
    else if (type === "descripcion") {
      if (regexdescripcion .test(data)) {
        this.setState({
          descripcion : data,
          sdescripcion : true,
          edescripcion : false,
          idescripcion : "checkmark-circle"
        });
      } else {
        this.setState({
          descripcion : data,
          sdescripcion : false,
          edescripcion : true,
          idescripcion : "close-circle"
        });
      }
    }

  }

  async update() {
    const {id, nombre, descripcion, precio, existencia, estimation,
      snombre, sdescripcion, sprecio, sexistencia,
      item,index,
    } = this.state;
    if(snombre && sdescripcion && sprecio && sexistencia){
    fs.collection("materiales")
      .doc(estimation.id)
      .update({
        Codigo:id,
        nombre:nombre,
        descripcion:descripcion,
        precio: parseFloat(precio),
        existencia: parseInt(existencia)
      })
      .then(() => {
        this.props.navigation.state.params.update(item.id, index);
        this.props.navigation.navigate("Material");
      });
    }
  }

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
                  padding: 5
                }}
                onPress={() => this.props.navigation.navigate("Material")}
              />
            </Left>
            <Body>
              <Title style={{ color: "#fff" }}>ACTUALIZAR</Title>
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
                    marginTop: "10%",
                    width: "100%",
                    alignItems: "center"
                  }}
                >
                  <Item
                    floatingLabel
                    success={this.state.sId}
                    error={this.state.eId}
                    style={{ width: "90%" }}
                  >
                    <Icon type="MaterialIcons" name="priority-high" />
                    <Label>ID Material</Label>
                    <Input
                      value={this.state.id}
                      disabled={true}
                      maxLength={13}
                      keyboardType="number-pad"
                      style={{
                        fontSize: 18,
                        alignSelf: "flex-start"
                      }}
                      onChangeText={id => {
                        this.validate(id, "id");
                      }}
                    />
                  </Item>
                </View>

                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    marginTop: "10%",
                    width: "100%",
                    alignItems: "center"
                  }}
                >
                  <Item
                    floatingLabel
                    style={{ width: "90%" }}
                    success={this.state.snombre}
                    error={this.state.enombre}
                  >
                    <Icon type="MaterialIcons" name="person" />
                    <Label>Nombre</Label>
                    <Input
                      value={this.state.nombre}
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      onChangeText={nombre => this.validate(nombre, "nombre")}
                    />
                    <Icon name={this.state.inombre} />
                  </Item>
                </View>

                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    marginTop: "10%",
                    width: "100%",
                    alignItems: "center"
                  }}
                >
                  <Item
                    floatingLabel
                    style={{ width: "90%" }}
                    error={this.state.eprecio}
                    success={this.state.sprecio}
                  >
                    <Icon type="MaterialIcons" name="attach-money" />
                    <Label>Precio</Label>
                    <Input
                      value={this.state.precio.toString()}
                      keyboardType="numeric"
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      onChangeText={precio =>
                        this.validate(precio, "precio")
                      }
                    />
                    <Icon name={this.state.iprecio} />
                  </Item>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    marginTop: "10%",
                    width: "100%",
                    alignItems: "center"
                  }}
                >
                  <Item
                    floatingLabel
                    style={{ width: "90%"}}
                    error={this.state.eexistencia}
                    success={this.state.sexistencia}
                  >
                    <Icon type="MaterialIcons" name="list" />
                    <Label>Existencia</Label>
                    <Input
                      value={this.state.existencia.toString()}
                      maxLength={5}
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      keyboardType="numeric"
                      onChangeText={existencia => this.validate(existencia, "existencia")}
                    />
                    <Icon name={this.state.iexistencia} />
                  </Item>
                </View>

                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    marginTop: "10%",
                    width: "100%",
                    alignItems: "center"
                  }}
                >
                  <Item
                    floatingLabel
                    style={{ width: "90%"}}
                    error={this.state.edescripcion}
                    success={this.state.sdescripcion}
                  >
                    <Icon type="MaterialIcons" name="home" />
                    <Label>Descripción</Label>
                    <Input
                      value={this.state.descripcion}
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      onChangeText={descripcion  => this.validate(descripcion , "descripcion ")}
                    />
                    <Icon name={this.state.idescripcion} />
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
                    onPress={() => this.update()}
                  >
                    <Text style={{ color: "white" }} onPress={this.save}>
                      ACTUALIZAR
                    </Text>
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
    height: "100%",
    flex: 1,
    alignItems: "center",
    flexDirection: "column"
  },
  addButton: {
    backgroundColor: "#077A65"
  },
  fields: {
    margin: "10%",
    width: "50%",
    flex: 50
  },
  errorValitation: {
    borderColor: "red"
  }
});
