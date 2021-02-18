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
  Input,
  Form,
  Container
} from "native-base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { firebase, fs } from "../Firebase/config";

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


//:::::::::::::::::::::::::::: SHOW SWIPE AREA ::::::::::::::::::::::::
export default class AddEggs extends Component {
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
      id: '',
      counterId: 0,
      name: '',
      chickensHere: 0,
      male: 0,
      female: 0,
      totalChickens: 0,
      maxCapacity: 0,
      eggs:0,
      initialStage: false
    }
  }
  componentDidMount() {
    const { farm, corral, production } = this.props.navigation.state.params;
    if (production) {
      this.setState({
        id: production.id,
        name: production.name,
        male: production.male,
        female: production.female,
        chickensHere: production.male + production.female,
        eggs: production.eggs,
        initialStage: production.initialStage
      });
    }
    fs.collection('corrales')
      .doc(corral._id)
      .get()
      .then(doc => {
        this.setState({
          maxCapacity: doc.data().capacity
        });
      })
    fs.collection("eggsProductions")
      .where("farm", "==", farm.id)
      .where('corral', '==', corral._id)
      .get()
      .then(query => {
        query.forEach(doc => {
          const data = doc.data();
          this.setState({
            totalChickens: data.male + data.female + this.state.totalChickens
          });
          let id = doc.data().id.substr(4);
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
      }).then(() => {
        this.setState({
          id: "PRH-" + this.state.counterId,
          Loaded: true
        });
      });
  }

  validate = (data, type) => {
    const { id, name, lastName, location, age } = this.state;
    const regexId = /\d{13}/;
    const regexName = /^(?=.{3,15}$)[a-z]+(?:['_.\s][a-z]+)*$/i;
    const regexLastName = /^(?=.{3,15}$)[a-z]+(?:['_.\s][a-z]+)*$/i;
    const regexLocation = /^(?=.{3,15}$)[a-z]+(?:['_.\s][a-z]+)*$/i;
    const regexAge = /\d{2}/;

    if (type === "id") {
      if (regexId.test(data)) {
        this.setState({
          id: data,
          sId: true,
          eId: false,
          iId: "checkmark-circle"
        });
      } else {
        this.setState({
          sId: false,
          id: data,
          eId: true,
          iId: "close-circle"
        });
      }
    } else if (type === "name") {
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
    } else if (type === "lastName") {
      if (regexLastName.test(data)) {
        this.setState({
          sLastName: true,
          eLastName: false,
          lastName: data,
          iLastName: "checkmark-circle"
        });
      } else {
        this.setState({
          sLastName: false,
          lastName: data,
          eLastName: true,
          iLastName: "close-circle"
        });
      }
    } else if (type === "age") {
      if (regexAge.test(data)) {
        this.setState({
          age: data,
          sAge: true,
          eAge: false,
          iAge: "checkmark-circle"
        });
      } else {
        this.setState({
          age: data,
          sAge: false,
          eAge: true,
          iAge: "close-circle"
        });
      }
    } else if (type === "location") {
      if (regexLocation.test(data)) {
        this.setState({
          location: data,
          sLocation: true,
          eLocation: false,
          iLocation: "checkmark-circle"
        });
      } else {
        this.setState({
          location: data,
          sLocation: false,
          eLocation: true,
          iLocation: "close-circle"
        });
      }
    }
  };

  save = async () => {
    const {
      id,
      name,
      male,
      female
    } = this.state;
    const { farm, production, corral, onUpdate, onCreate } = this.props.navigation.state.params;
    const newProduction ={
      id,
      name,
      male,
      female,
      farm: farm.id,
      corral: corral._id,
      corralData: corral,
      eggs: 0,
      initialStage: false
    };
    let goBack = false;
    if(onUpdate) {
      goBack = await onUpdate(production._id, newProduction);
    }
    if(onCreate) {
      goBack = await onCreate(newProduction);
    }
    if(goBack){
      this.props.navigation.navigate('EggsProduction');
    }
  }

  
  render() {
    const animalCapacity = this.state.maxCapacity - this.state.totalChickens + this.state.chickensHere;
    const { male, female } = this.state;
    const remainingCapacity = animalCapacity - male - female;
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
                onPress={() => this.props.navigation.goBack()}
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
                    width: "100%",
                    alignItems: "center"
                  }}
                >
                  <Item floatingLabel style={{ width: "90%", height: 60 }}>
                    <Label
                      style={{
                        textAlign: "center"
                      }}
                    >
                      Espacio Disponibles
                    </Label>
                    <Input
                      disabled="true"
                      value={(
                        animalCapacity
                      ).toFixed(0) + ' Animales'}
                      style={{
                        fontSize: 18,
                        textAlign: "center",
                        alignSelf: "flex-start",
                        color: "red",
                        fontWeight: "500"
                      }}
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
                    error={false}
                    success={false}
                  >
                    <Icon type="MaterialIcons" name="priority-high" />
                    <Label>ID</Label>
                    <Input
                      value={this.state.id}
                      maxLength={13}
                      keyboardType="number-pad"
                      style={{
                        fontSize: 18,
                        alignSelf: "flex-start"
                      }}
                      onChangeText={id => this.setState({ id })}
                    />
                    <Icon name="" />
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
                    error={false}
                    success={false}
                  >
                    <Icon type="MaterialIcons" name="person" />
                    <Label>Nombre Produccion</Label>
                    <Input
                      value={this.state.name}
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      onChangeText={ name => this.setState({ name}) }
                    />
                    <Icon name="" />
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
                    error={false}
                    success={false}
                  >
                    <Icon type="MaterialIcons" name="all-inclusive" />
                    <Label>Cantidad de Pollos</Label>
                    <Input
                      maxLength={2}
                      value={this.state.male.toString()}
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      keyboardType="numeric"
                      onChangeText={male => this.setState({ male: Number(male) })}
                    />
                    <Icon name="" />
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
                    <Text style={{ color: "white" }} onPress={ () => {
                      if (remainingCapacity >= 0) {
                        this.save();
                      }
                      else {
                        Alert.alert(
                          "Limite Alcanzado",
                          "Revisa la capacidad de tu corral",
                          [
                            {
                              text: "Aceptar",
                            }
                          ],
                          { cancelable: false }
                        );
                      }
                    }}>
                      GUARDAR
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

const styles = StyleSheet.create({
  textStyle: {
    marginTop: 20,
    fontSize: 25,
    textAlign: "center"
  },
  container: {
    flex: 1
  },
  fab: {
    position: "absolute",
    width: 20,
    height: 20,
    backgroundColor: "red"
  },
  iconStyle: {
    fontSize: 40,
    color: "#fff"
  }
});
