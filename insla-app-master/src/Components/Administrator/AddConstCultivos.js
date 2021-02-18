import React, { Component } from "react";
import { ScrollView, StyleSheet, Alert, View } from "react-native";
import {
  Container,
  Header,
  Form,
  Item,
  Input,
  Icon,
  Label,
  Text,
  Left,
  Right,
  Body,
  Button,
  Title,
  Spinner
} from "native-base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { fs, firebase, db } from "../Firebase/config";
import { Dropdown } from "react-native-material-dropdown";

export default class AddConstCultivos extends Component {
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
      id: "",
      counterId: 0,
      altitude: "",
      heightcultivo: "",
      cycle: "",
      distance: 0,
      species: "",
      ph: "",
      propagation: "",
      irrigation: "",
      groove: 0,
      typecultivo: "",
      variety: "",
      name: "",
      weightPlant: 0,
      estimatedPrice: 0,
      preloader: false,
      Loaded: false,
      save: false,

      //errors
      ealtitude: false,
      eheightcultivo: false,
      ecycle: false,
      edistance: false,
      especies: false,
      eph: false,
      epropagation: false,
      eirrigation: false,
      egroove: false,
      etypecultivo: false,
      evariety: false,
      ename: false,
      eweightPlant: false,
      eestimatedPrice: false,

      //icons
      ialtitude: "",
      iheightcultivo: "",
      icycle: "",
      idistance: "",
      ispecies: "",
      iph: "",
      ipropagation: "",
      iirrigation: "",
      igroove: "",
      itypecultivo: "",
      ivariety: "",
      iname: "",
      iweightPlant: "",
      iestimatedPrice: "",

      //succes
      saltitude: false,
      sheightcultivo: false,
      scycle: false,
      sdistance: false,
      sspecies: false,
      sph: false,
      spropagation: false,
      sirrigation: false,
      sgroove: false,
      stypecultivo: false,
      svariety: false,
      sname: false,
      sweightPlant: false,
      sestimatedPrice: false
    };
  }
  componentDidMount() {
    fs.collection("const")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          let id = doc.data().Codigo.substr(4);
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
          id: "CLT-" + this.state.counterId,
          Loaded: true
        });
      });
  }

  validate = (data, type) => {
    const regextypecultivo =/^(?=.{3,15}$)[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g;
    const regexspecies = /^(?=.{3,15}$)[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g;
    const regexvariety = /^(?=.{3,15}$)[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g;
    const regexname = /^(?=.{3,15}$)[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g;
    const regexirrigation = /^(?=.{3,15}$)[a-z]+(?:['_.\s][a-z]+)*$/i;
    const regexaltitude = /^[0-9]+([.])?([0-9]+)?$/;
    const regexheightcultivo = /^[0-9]+([.])?([0-9]+)?$/;
    const regexcycle =/^(?=.{3,15}$)[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g;
    const regexpropagation = /^(?=.{3,15}$)[a-z]+(?:['_.\s][a-z]+)*$/;
    const regexph = /^(1[7-9][0-9][0-9]|20[0-9][0-9]|2100)$/;
    const regexdistance = /^[0-9]+([.])?([0-9]+)?$/;
    const regexgroove = /^[0-9]+([.])?([0-9]+)?$/;
    const regexweightPlant = /^[0-9]+([.])?([0-9]+)?$/;
    const regexestimatedPrice = /^[0-9]+([.])?([0-9]+)?$/;
    if (type === "typecultivo") {
      if (regextypecultivo.test(data)) {
        this.setState({
          typecultivo: data,
          stypecultivo: true,
          etypecultivo: false,
          itypecultivo: "checkmark-circle"
        });
      } else {
        this.setState({
          typecultivo: data,
          stypecultivo: false,
          etypecultivo: true,
          itypecultivo: "close-circle"
        });
      }
    } else if (type === "species") {
      if (regexspecies.test(data)) {
        this.setState({
          species: data,
          sspecies: true,
          especies: false,
          ispecies: "checkmark-circle"
        });
      } else {
        this.setState({
          species: data,
          sspecies: false,
          especies: true,
          ispecies: "close-circle"
        });
      }
    } else if (type === "variety") {
      if (regexvariety.test(data)) {
        this.setState({
          variety: data,
          svariety: true,
          evariety: false,
          ivariety: "checkmark-circle"
        });
      } else {
        this.setState({
          variety: data,
          svariety: false,
          evariety: true,
          ivariety: "close-circle"
        });
      }
    } else if (type === "name") {
      if (regexname.test(data)) {
        this.setState({
          name: data,
          sname: true,
          ename: false,
          iname: "checkmark-circle"
        });
      } else {
        this.setState({
          name: data,
          sname: false,
          ename: true,
          iname: "close-circle"
        });
      }
    } else if (type === "irrigation") {
      if (regexirrigation.test(data)) {
        this.setState({
          irrigation: data,
          sirrigation: true,
          eirrigation: false,
          iirrigation: "checkmark-circle"
        });
      } else {
        this.setState({
          irrigation: data,
          sirrigation: false,
          eirrigation: true,
          iirrigation: "close-circle"
        });
      }
    } else if (type === "altitude") {
      if (regexaltitude.test(data)) {
        this.setState({
          altitude: data,
          saltitude: true,
          ealtitude: false,
          ialtitude: "checkmark-circle"
        });
      } else {
        this.setState({
          altitude: data,
          saltitude: false,
          ealtitude: true,
          ialtitude: "close-circle"
        });
      }
    } else if (type === "heightcultivo") {
      if (regexheightcultivo.test(data)) {
        this.setState({
          heightcultivo: data,
          sheightcultivo: true,
          eheightcultivo: false,
          iheightcultivo: "checkmark-circle"
        });
      } else {
        this.setState({
          heightcultivo: data,
          sheightcultivo: false,
          eheightcultivo: true,
          iheightcultivo: "close-circle"
        });
      }
    } else if (type === "cycle") {
      if (regexcycle.test(data)) {
        this.setState({
          cycle: data,
          scycle: true,
          ecycle: false,
          icycle: "checkmark-circle"
        });
      } else {
        this.setState({
          cycle: data,
          scycle: true,
          ecycle: false,
          icycle: "checkmark-circle"
        });
      }
    } else if (type === "propagation") {
      if (regexpropagation.test(data)) {
        this.setState({
          propagation: data,
          spropagation: true,
          epropagation: false,
          ipropagation: "checkmark-circle"
        });
      } else {
        this.setState({
          propagation: data,
          spropagation: true,
          epropagation: false,
          ipropagation: "checkmark-circle"
        });
      }
    } else if (type === "ph") {
      if (regexph.test(data)) {
        this.setState({
          ph: data,
          sph: true,
          eph: false,
          iph: "checkmark-circle"
        });
      } else {
        this.setState({
          ph: data,
          sph: true,
          eph: false,
          iph: "checkmark-circle"
        });
      }
    } else if (type === "distance") {
      if (regexdistance.test(data)) {
        this.setState({
          distance: data,
          sdistance: true,
          edistance: false,
          idistance: "checkmark-circle"
        });
      } else {
        this.setState({
          distance: data,
          sdistance: false,
          edistance: true,
          idistance: "close-circle"
        });
      }
    } else if (type === "groove") {
      if (regexgroove.test(data)) {
        this.setState({
          groove: data,
          sgroove: true,
          egroove: false,
          igroove: "checkmark-circle"
        });
      } else {
        this.setState({
          groove: data,
          sgroove: false,
          egroove: true,
          igroove: "close-circle"
        });
      }
    } else if (type === "weightPlant") {
      if (regexweightPlant.test(data)) {
        this.setState({
          weightPlant: data,
          sweightPlant: true,
          eweightPlant: false,
          iweightPlant: "checkmark-circle"
        });
      } else {
        this.setState({
          weightPlant: data,
          sweightPlant: false,
          eweightPlant: true,
          iweightPlant: "close-circle"
        });
      }
    } else if (type === "estimatedPrice") {
      if (regexestimatedPrice.test(data)) {
        this.setState({
          estimatedPrice: data,
          sestimatedPrice: true,
          eestimatedPrice: false,
          iestimatedPrice: "checkmark-circle"
        });
      } else {
        this.setState({
          estimatedPrice: data,
          sestimatedPrice: false,
          eestimatedPrice: true,
          iestimatedPrice: "close-circle"
        });
      }
    }
  };
  save = () => {
    const {
      id,
      altitude,
      heightcultivo,
      cycle,
      distance,
      species,
      ph,
      propagation,
      irrigation,
      groove,
      typecultivo,
      variety,
      name,
      weightPlant,
      estimatedPrice,

      saltitude,
      sheightcultivo,
      scycle,
      sdistance,
      sspecies,
      sph,
      spropagation,
      sirrigation,
      sgroove,
      stypecultivo,
      svariety,
      sname,
      sweightPlant,
      sestimatedPrice
    } = this.state;
    if (
      stypecultivo &&
      svariety &&
      sspecies &&
      sirrigation &&
      sname &&
      saltitude &&
      sheightcultivo &&
      scycle &&
      spropagation &&
      sph &&
      sgroove &&
      sdistance &&
      sweightPlant &&
      sestimatedPrice
    ) {
      fs.collection("const")
        .add({
          Codigo: id,
          Altitud: altitude,
          Altura: heightcultivo,
          Ciclo: cycle,
          Distancia: parseFloat(distance),
          Especie: species,
          PH: ph,
          Riego: irrigation,
          Propagacion: propagation,
          Surco: parseFloat(groove),
          Tipo: typecultivo,
          Variedad: variety,
          nCientifico: name,
          weightPlant: parseFloat(weightPlant),
          estimatedPrice: parseFloat(estimatedPrice)
        })
        .then(cont => {
          this.props.navigation.state.params.save(cont.id);
          this.props.navigation.navigate("constcultivos");
        });
    } else {
      Alert.alert("", "Rellene todos los campos", [], {
        cancelable: true
      });
    }
  };
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
                style={{ fontSize: 40, color: "#fff", padding: 5 }}
                onPress={() => this.props.navigation.navigate("constcultivos")}
              />
            </Left>
            <Body>
              <Title style={{ color: "#fff" }}>NUEVA</Title>
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
                    <Label>ID</Label>
                    <Input
                      disabled={true}
                      keyboardType="number-pad"
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      value={"" + this.state.id}
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
                    error={this.state.etypecultivo}
                    success={this.state.stypecultivo}
                  >
                    <Icon type="MaterialIcons" name="spellcheck" />
                    <Label>Tipo Cultivo</Label>
                    <Input
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      onChangeText={typecultivo =>
                        this.validate(typecultivo, "typecultivo")
                      }
                    />
                    <Icon name={this.state.itypecultivo} />
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
                    error={this.state.especies}
                    success={this.state.sspecies}
                  >
                    <Icon type="MaterialIcons" name="swap-horiz" />
                    <Label>Especie</Label>
                    <Input
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      onChangeText={species =>
                        this.validate(species, "species")
                      }
                    />
                    <Icon name={this.state.ispecies} />
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
                    error={this.state.evariety}
                    success={this.state.svariety}
                  >
                    <Icon type="MaterialIcons" name="group-work" />
                    <Label>Variedad</Label>
                    <Input
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      onChangeText={variety =>
                        this.validate(variety, "variety")
                      }
                    />
                    <Icon name={this.state.ivariety} />
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
                    error={this.state.ename}
                    success={this.state.sname}
                  >
                    <Icon type="MaterialIcons" name="spellcheck" />
                    <Label>Nombre Cientifico</Label>
                    <Input
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      onChangeText={name => this.validate(name, "name")}
                    />
                    <Icon name={this.state.iname} />
                  </Item>
                </View>          
                    <Dropdown
                      containerStyle={{ width: "90%" }}
                      dropdownMargins={{ min: 5, max: 20 }}
                      label="Tipo de Riego"
                      data={[
                        { value: "Por Goteo" },
                        { value: "Automatico" },
                        { value: "Hidroponico" },
                        { value: "por Aspersion" },
                        { value: "por Microaspersion" },
                        { value: "por Nebulizacion" }
                      ]}
                      onChangeText={irrigation =>
                        this.validate(irrigation, "irrigation")
                      }
                    />
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
                    error={this.state.eheightcultivo}
                    success={this.state.sheightcultivo}
                  >
                    <Icon type="MaterialIcons" name="trending-up" />
                    <Label>Altura Planta(metros)</Label>
                    <Input
                      keyboardType="decimal-pad"
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      onChangeText={heightcultivo =>
                        this.validate(heightcultivo, "heightcultivo")
                      }
                    />
                    <Icon name={this.state.iheightcultivo} />
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
                    error={this.state.ealtitude}
                    success={this.state.saltitude}
                  >
                    <Icon type="MaterialIcons" name="trending-up" />
                    <Label>Altura Ideal Siembra(metros)</Label>
                    <Input
                      keyboardType="decimal-pad"
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      onChangeText={altitude =>
                        this.validate(altitude, "altitude")
                      }
                    />
                    <Icon name={this.state.ialtitude} />
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
                    error={this.state.ecycle}
                    success={this.state.scycle}
                  >
                    <Icon type="MaterialIcons" name="trending-up" />
                    <Label>Ciclo dias Produccion</Label>
                    <Input
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      onChangeText={cycle => this.validate(cycle, "cycle")}
                    />
                    <Icon name={this.state.icycle} />
                  </Item>
                </View>
                <Dropdown
                  containerStyle={{ width: "90%" }}
                  label="Propagacion"
                  dropdownMargins={{ min: 5, max: 20 }}
                  data={[
                    { value: "Semilla" },
                    { value: "Tallo" },
                    { value: "vegetativa- injerto" },
                    { value: "Asexual,por cangres" }
                  ]}
                  onChangeText={propagation =>
                    this.validate(propagation, "propagation")
                  }
                />
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
                    error={this.state.eph}
                    success={this.state.sph}
                  >
                    <Icon type="MaterialIcons" name="poll" />
                    <Label>PH Ideal del Suelo</Label>
                    <Input
                      keyboardType="number-pad"
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      onChangeText={ph => this.validate(ph, "ph")}
                    />
                    <Icon name={this.state.iph} />
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
                    error={this.state.edistance}
                    success={this.state.sdistance}
                  >
                    <Icon type="MaterialIcons" name="settings-ethernet" />
                    <Label>Distancia Ideal entre Plantas(metros)</Label>
                    <Input
                      keyboardType="numeric"
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      onChangeText={distance =>
                        this.validate(distance, "distance")
                      }
                    />
                    <Icon name={this.state.idistance} />
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
                    error={this.state.egroove}
                    success={this.state.sgroove}
                  >
                    <Icon type="MaterialIcons" name="settings-ethernet" />
                    <Label>Distancia Ideal entre Surco(metros)</Label>
                    <Input
                      keyboardType="numeric"
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      onChangeText={groove => this.validate(groove, "groove")}
                    />
                    <Icon name={this.state.igroove} />
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
                    error={this.state.eweightPlant}
                    success={this.state.sweightPlant}
                  >
                    <Icon type="MaterialIcons" name="settings-ethernet" />
                    <Label>Peso de la Planta(libras)</Label>
                    <Input
                      keyboardType="numeric"
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      onChangeText={weightPlant =>
                        this.validate(weightPlant, "weightPlant")
                      }
                    />
                    <Icon name={this.state.iweightPlant} />
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
                    error={this.state.eestimatedPrice}
                    success={this.state.sestimatedPrice}
                  >
                    <Icon type="MaterialIcons" name="settings-ethernet" />
                    <Label>Precio Estimado (Lps)</Label>
                    <Input
                      keyboardType="numeric"
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      onChangeText={estimatedPrice =>
                        this.validate(estimatedPrice, "estimatedPrice")
                      }
                    />
                    <Icon name={this.state.iestimatedPrice} />
                  </Item>
                </View>
                <View
                  style={{
                    marginTop: "10%",
                    marginBottom: "110%",
                    width: "60%"
                  }}
                >
                  <Button
                    style={style.addButton}
                    full
                    rounded
                    success
                    onPress={this.save}
                    disabled={this.state.save}
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
  errorValidation: {
    borderColor: "red"
  }
});
