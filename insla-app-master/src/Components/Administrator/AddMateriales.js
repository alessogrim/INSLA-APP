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
  Spinner,
  Button,
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
    this.props = props;
    this.state = {
      id: "",
      counterId: 0,
      nombre: "",
      precio: 0,
      existencia: 0,
      descripcion: "",

      //errors
      enombre: false,
      eprecio: false,
      eexistencia: false,
      edescripcion: false,
      //icons
      inombre: "",
      iprecio: "",
      iexistencia: "",
      idescripcion: "",
      //success
      snombre: false,
      sprecio: false,
      sexistencia: false,
      sdescripcion: false,

      Loaded: true,
      preloader: false,
      save: false
    };
  }
  componentDidMount() {
    fs.collection("materiales")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {

          let id = doc.data().Codigo.substr(6);
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
          id: "MTRLS-" + this.state.counterId,
          Loaded: true
        });
      });
  }

  validate = (data, type) => {
    const regexnombre = /^(?=.{3,15}$)[a-z]+(?:['_.\s][a-z]+)*$/i;
    const regexprecio = /^[0-9]+([.])?([0-9]+)?$/;
    const regexexistencia = /^[0-9]+([.])?([0-9]+)?$/;
    const regexdescripcion = /^(?=.{3,15}$)[a-z]+(?:['_.\s][a-z]+)*$/i;

    if (type === "nombre") {
      if (regexnombre.test(data)) {
        this.setState({
          nombre: data,
          snombre: true,
          enombre: false,
          inombre: "checkmark-circle"
        });
      } else {
        this.setState({
          nombre: data,
          snombre: false,
          enombre: true,
          inombre: "close-circle"
        });
      }
    }
    else if (type === "precio") {
      if (regexprecio.test(data)) {
        this.setState({
          precio: data,
          sprecio: true,
          eprecio: false,
          iprecio: "checkmark-circle"
        });
      } else {
        this.setState({
          precio: data,
          sprecio: false,
          eprecio: true,
          iprecio: "close-circle"
        });
      }
    }
    else if (type === "existencia") {
      if (regexexistencia.test(data)) {
        this.setState({
          existencia: data,
          sexistencia: true,
          eexistencia: false,
          iexistencia: "checkmark-circle"
        });
      } else {
        this.setState({
          existencia: data,
          sexistencia: false,
          eexistencia: true,
          iexistencia: "close-circle"
        });
      }
    }
    else if (type === "descripcion") {
      if (regexdescripcion.test(data)) {
        this.setState({
          descripcion: data,
          sdescripcion: true,
          edescripcion: false,
          idescripcion: "checkmark-circle"
        });
      } else {
        this.setState({
          descripcion: data,
          sdescripcion: false,
          edescripcion: true,
          idescripcion: "close-circle"
        });
      }
    }

  }
  async save() {
    const { id, nombre, descripcion, precio, existencia,
      snombre, sdescripcion, sprecio, sexistencia
    } = this.state;

    if (snombre && sdescripcion && sprecio && sexistencia) {
      this.setState({
        preloader: true,
        save: true
      });
      const query = await fs
        .collection("materiales")
        .where("id", "==", this.state.id)
        .get();
        if (query.size > 0) {
          Alert.alert(
            "Guardar Material",
            "Este meterial ya existe",
            [
              {
                text: "Aceptar",
                onPress: () => {
                  this.setState({
                    preloader: false,
                    save: false
                  });
                }
              }
            ]
          );
        } else {
          fs.collection("materiales")
            .add({
              Codigo: id,
              nombre: nombre,
              descripcion: descripcion,
              precio: parseFloat(precio),
              existencia: parseInt(existencia)
            })
            .then(material => {
              this.props.navigation.state.params.save(material.id);
              this.props.navigation.navigate("Material");
            });
        }
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
              <Title style={{ color: "#fff" }}>NUEVO</Title>
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
                    marginTop: "5%",
                    width: "100%",
                    alignItems: "center"
                  }}
                >
                  <Item
                    floatingLabel
                    success={this.state.sId}
                    error={this.state.eId}
                    style={{ width: "90%", height: 60 }}
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
                    <Icon name={this.state.iId} />
                  </Item>
                </View>

                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    width: "100%",
                    marginTop: "5%",
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
                    width: "100%",
                    marginTop: "5%",
                    alignItems: "center"
                  }}
                >
                  <Item
                    floatingLabel
                    style={{ width: "90%", height: 60 }}
                    error={this.state.eprecio}
                    success={this.state.sprecio}
                  >
                    <Icon type="MaterialIcons" name="attach-money" />
                    <Label>Precio</Label>
                    <Input
                      keyboardType="number-pad"
                      style={{
                        fontSize: 18
                      }}
                      onChangeText={precio => this.validate(precio, "precio")}
  
                    />
                    <Icon name={this.state.iprecio} />
                  </Item>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    width: "100%",
                    marginTop: "5%",
                    alignItems: "center"
                  }}
                >
                  <Item
                    floatingLabel
                    style={{ width: "90%", height: 60 }}
                    error={this.state.eexistencia}
                    success={this.state.sexistencia}
                  >
                    <Icon type="MaterialIcons" name="monetization-on" />
                    <Label>Existencia</Label>
                    <Input
                      maxLength={5}
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      keyboardType="number-pad"
                      onChangeText={existencia => this.validate(existencia, "existencia")}
                    />
                    <Icon name={this.state.iexistencia} />
                  </Item>
                </View>

                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    width: "100%",
                    alignItems: "center",
                    marginTop: "5%",
                  }}
                >
                  <Item
                    floatingLabel
                    style={{ width: "90%", height: 60 }}
                    error={this.state.edescripcion}
                    success={this.state.sdescripcion}
                  >
                    <Icon type="MaterialIcons" name="home" />
                    <Label>Descripción</Label>
                    <Input
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      onChangeText={descripcion  => this.validate(descripcion, "descripcion")}
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
                    disabled={this.state.save}
                    onPress={() => {
                      this.save();
                    }}
                  >
                    <Text style={{ color: "white" }}>GUARDAR</Text>
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
