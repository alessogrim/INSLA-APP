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
  Title
} from "native-base";
import { fs, firebase, db } from "../../Firebase/config";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default class AdminUpdateConcentrate extends React.Component {
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
      id: this.props.navigation.state.params.item.data().codigo,
      nombre: this.props.navigation.state.params.item.data().nombre,
      cantidad: this.props.navigation.state.params.item.data().cantidad,
      descripcion: this.props.navigation.state.params.item.data().descripcion,
      index: this.props.navigation.state.params.index,
      item: this.props.navigation.state.params.item,
      //errors
      enombre: false,
      ecantidad: false,
      edescripcion: false,
      //icons
      inombre: "checkmark-circle",
      icantidad: "checkmark-circle",
      idescripcion: "checkmark-circle",
      //success
      snombre: true,
      scantidad: true,
      sdescripcion: true,
    };
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
    }
    else if (type === "cantidad") {
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

  async update() {
    const { id, nombre, descripcion, cantidad, estimation,
      snombre, sdescripcion, scantidad,
      item, index,
    } = this.state;
    if (snombre && sdescripcion && scantidad) {
      fs.collection("admin_concentrado")
        .doc(estimation.id)
        .update({
          codigo: id,
          nombre: nombre,
          descripcion: descripcion,
          cantidad: parseFloat(cantidad)
        })
        .then(() => {
          this.props.navigation.state.params.update(item.id, index);
          this.props.navigation.navigate("concentrateAdmin");
        });
    }
  }

  render() {
    const { id, nombre, descripcion, cantidad } = this.state;

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
              onPress={() => this.props.navigation.navigate("concentrateAdmin")}
            />
          </Left>
          <Body>
            <Title style={{ color: "#fff" }}>ACTUALIZAR</Title>
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
                <Item
                  floatingLabel
                  style={{ width: "90%", height: 60 }}
                >
                  <Icon type="MaterialIcons" name="priority-high" />
                  <Label>Código</Label>
                  <Input
                    maxLength={4}
                    disabled={true}
                    keyboardType="number-pad"
                    value={this.state.id}
                    style={{ fontSize: 18, alignSelf: "flex-start" }}
                  />
                  <Icon name={this.state.iId} />
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
                    maxLength={4}
                    keyboardType="decimal-pad"
                    value={this.state.cantidad.toString()}
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
                  style={{ width: "90%", height: 80, /*backgroundColor: '#7fff00'*/ }}
                  success={this.state.scantidad}
                  error={this.state.ecantidad}
                >
                  <Icon type="MaterialIcons" name="description" />
                  <Label>Descripción</Label>
                  <Input
                    value={this.state.descripcion}
                    multiline={true}
                    numberOfLines={3}
                    style={{ height: 60, textAlignVertical: 'top', /*backgroundColor: '#00ffff'*/ }}
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
                  onPress={this.update.bind(this)}
                >
                  <Text style={{ color: "white" }}>
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