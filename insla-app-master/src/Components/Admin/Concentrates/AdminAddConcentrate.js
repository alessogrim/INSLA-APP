import React from "react";
import {
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  Alert,
  View
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
  Picker,
  Text,
  Root,
  Left,
  Right,
  Body,
  Button,
  Title,
  Spinner
} from "native-base";
import { fs, firebase, db } from "../../Firebase/config";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default class AdminAddConcentrate extends React.Component {
  state = {};
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
      cantidad: 0,
      descripcion: "",

      //errors
      enombre: false,
      ecantidad: false,
      edescripcion: false,
      //icons
      inombre: "",
      icantidad: "",
      idescripcion: "",
      //success
      snombre: false,
      scantidad: false,
      sdescripcion: false,

      preloader: false,
      save: false
    };
  }
  componentDidMount() {
    fs.collection("admin_concentrado")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          let id = doc.data().codigo.substr(6);
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
          id: "CNTRD-" + this.state.counterId,
          Loaded: true
        });
      });
  }

  validate = (data, type) => {
    const regexnombre = /^(?=.{3,15}$)[a-z]+(?:['_.\s][a-z]+)*$/i;
    const regexcantidad = /\d+(\.\d{1,2})?/;
    const regexdescripcion = /([A-Z])\w+/i;

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
    } else if (type === "cantidad") {
      if (regexcantidad.test(data)) {
        this.setState({
          cantidad: data,
          scantidad: true,
          ecantidad: false,
          icantidad: "checkmark-circle"
        });
      } else {
        this.setState({
          cantidad: data,
          scantidad: false,
          ecantidad: true,
          icantidad: "close-circle"
        });
      }
    } else if (type === "descripcion") {
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
  };
  async save() {
    const {
      id,
      nombre,
      descripcion,
      cantidad,
      snombre,
      sdescripcion,
      scantidad
    } = this.state;

    if (snombre && sdescripcion && scantidad) {
      this.setState({
        preloader: true,
        save: true
      });
      const query = await fs
        .collection("admin_concentrado")
        .where("nombre", "==", this.state.nombre)
        .get();
      if (query.size > 0) {
        Alert.alert(
          "Guardar Concentrado",
          "Ya existe un concentrado con ese nombre.",
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
        fs.collection("admin_concentrado")
          .add({
            codigo: id,
            nombre: nombre,
            descripcion: descripcion,
            cantidad: parseFloat(cantidad)
          })
          .then(concentrado => {
            this.props.navigation.state.params.save(concentrado.id);
            this.props.navigation.navigate("concentrateAdmin");
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  }

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
              style={{
                fontSize: 40,
                color: "#fff",
                padding: 5
              }}
              onPress={() => this.props.navigation.navigate("concentrateAdmin")}
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
                    value={this.state.id.toString()}
                    keyboardType="number-pad"
                    style={{ fontSize: 18, alignSelf: "flex-start" }}
                    //onChangeText={id => this.validate(id, "id")}
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
                  <Label>Cantidad (por empaque)</Label>
                  <Input
                    maxLength={5}
                    keyboardType="decimal-pad"
                    style={{ fontSize: 18, alignSelf: "flex-start" }}
                    onChangeText={cantidad =>
                      this.validate(cantidad, "cantidad")
                    }
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
                  success={this.state.sdescripcion}
                  error={this.state.edescripcion}
                >
                  <Icon type="MaterialIcons" name="description" />
                  <Label>Descripción</Label>
                  <Input
                    multiline={true}
                    numberOfLines={3}
                    style={{
                      height: 60,
                      textAlignVertical:
                        "top" /*borderWidth: 1, borderColor: "black", backgroundColor: '#00ffff'*/
                    }}
                    onChangeText={descripcion =>
                      this.validate(descripcion, "descripcion")
                    }
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
                  onPress={this.save.bind(this)}
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
