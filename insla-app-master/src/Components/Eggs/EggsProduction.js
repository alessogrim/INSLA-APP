import React, { Component } from "react";
import { View, Text, Button, StyleSheet, Alert, Image } from "react-native";
import {
  Header,
  Left,
  Body,
  Icon,
  Fab,
  Spinner,
  Title,
  Right,
  List,
  ListItem,
  Thumbnail,
  Content,
  Container,
  Card,
  CheckBox,
  CardItem
} from "native-base";
import Swipeout from "react-native-swipeout";
import { fs, firebase } from "../Firebase/config";
import SvgUri from "react-native-svg-uri";
import { TouchableOpacity } from "react-native-gesture-handler";
import farmImage from "../../../assets/production/eggs.jpg";


export default class EggsProduction extends Component {
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
      eggsProductions: [],
      active: false,
      Loaded: false,
      farm: this.props.navigation.state.params
    };
  }
  async componentDidMount() {
    const { farm: farmDoc } = this.state;
    const querySnapshot = await fs.collection("eggsProductions")
      .where("farm", "==", farmDoc.id)
      .get();
    console.log('map query')
    let eggsProductions = [];
    querySnapshot.forEach(doc => {
      console.log('prod doc');
      const production = {
        _id: doc.id,
        ...doc.data()
      };
      eggsProductions.push(production);
    });
    const populateCorrales = eggsProductions.map(async production => {
      console.log("farm ID:")
      console.log(farmDoc.id)
      const corralDoc = await fs.collection("corrales")
        .doc(production.corral)
        .get()
      console.log('corralDoc');
      production.corralData = corralDoc.data();
      return production;
    });
    eggsProductions = await Promise.all(populateCorrales);
    this.setState({
      eggsProductions,
      Loaded: true
    });
    this.updateProduction = this.updateProduction.bind(this);
  }

  delete = (production, index) => {
    Alert.alert(
      "Borrar Producción",
      "¿Esta seguro que desea borrar esta producción?",
      [
        {
          text: "Cancelar",

          style: "Cancelar"
        },
        {
          text: "Aceptar",
          onPress: async () => {
            await fs.collection("eggsProductions")
              .doc(production._id)
              .delete()
            this.setState({
              eggsProductions: this.state.eggsProductions.filter((prod) => {
                return prod._id !== production._id;
              })
            });
            await fs.collection("corrales").doc(production.corral).update({
              taken: false
            });
          }
        }
      ],
      { cancelable: false }
    );
  };

  //update collectin
  async create(newProduction) {
    console.log("entra");
    if (await this.idExists(newProduction.id)) {
      Alert.alert(
        "ID ya existe",
        "Ingrese otro ID",
        [
          {
            text: "Cerrar",
          }
        ],
        { cancelable: false }
      );
      return false;
    }
    await fs.collection("eggsProductions").add(newProduction);
    await fs.collection("corrales").doc(newProduction.corral).update({
      taken: true
    });
    console.log("crea");
    this.setState({
      eggsProductions: [...this.state.eggsProductions, newProduction],
    });
    console.log("sale");
    return true
  }


  async idExists(id) {
    const doc = await fs.collection("eggsProductions").where('id', '==', id).get();
    console.log(doc.empty);
    return !doc.empty;
  }

  async update(id, production) {
    const newProduction = { ...production };
    delete newProduction['_id'];
    await fs.collection("eggsProductions")
      .doc(id)
      .update(newProduction);
    this.setState({
      eggsProductions: [
        ...this.state.eggsProductions.filter(prod => prod._id !== id),
        { _id: id, ...newProduction },
      ]
    });
    return true;
  };
  updateProduction(production) {
    this.props.navigation.navigate("AddEggs", {
      production,
      farm: { id: production.farm },
      corral: { _id: production.corral },
      onUpdate: this.update.bind(this),
    });
  }
  render() {
    const { Loaded, farm } = this.state;
    
    if (!Loaded ) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Spinner color="green" />
        </View>
      );
    } else {
      const eggsProductions = this.state.eggsProductions.map((production, index) => {
        return (
          <Card style={{ margin: 10 }} key={index}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("EggsStages", {
                farm,
                production,
                updateProduction: (newProduction) => {
                  this.update(production._id, newProduction)
                }
              })}
            >
              <CardItem header>
                <Left>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                    {" "}
                    {"Nombre: "}
                    <Text style={{ color: "red", fontSize: 18 }}>
                      {production.name}
                    </Text>
                  </Text>
                </Left>
              </CardItem>
              <CardItem cardBody style={{ flex: 1, height: 325 }}>
                <View style={{ flex: 60 }}>
                  <Text
                    style={{
                      color: "red",
                      marginLeft: 10,
                      fontWeight: "bold"
                    }}
                  >
                    ID:{"\n "}
                    <Text
                      style={{
                        fontSize: 25,
                        fontWeight: "500",
                        marginLeft: 20,
                        color: "black"
                      }}
                    >
                      {production.id}
                    </Text>
                  </Text>
                  <Text
                    style={{
                      color: "red",
                      marginLeft: 10,
                      fontWeight: "bold"
                    }}
                  >
                    Corral:{"\n "}
                    <Text
                      style={{
                        fontSize: 25,
                        fontWeight: "500",
                        marginLeft: 20,
                        color: "black"
                      }}
                    >
                      {production.corralData.name}
                    </Text>
                  </Text>

                  <Text
                    style={{
                      color: "red",
                      marginLeft: 10,
                      fontWeight: "bold"
                    }}
                  >
                    Total Animales: {"\n"}
                    <Text
                      style={{
                        fontSize: 25,
                        fontWeight: "600",
                        marginLeft: 20,
                        color: "black",
                      }}
                    >
                      {production.male}
                    </Text>
                  </Text>
                  <Text
                    style={{
                      color: "red",
                      marginLeft: 10,
                      fontWeight: "bold"
                    }}
                  >
                    Total Huevos: {"\n"}
                    <Text
                      style={{
                        fontSize: 25,
                        fontWeight: "600",
                        marginLeft: 20,
                        color: "black",
                      }}
                    >
                      {production.eggs}
                    </Text>
                  </Text>
                  <Text
                    style={{
                      marginLeft: 10,
                      fontSize: 20,
                      color: "red"
                    }}
                  >
                    Etapas:
                  </Text>
                  <ListItem style={{ width: "80%", margin: 0 }}>
                    <CheckBox checked={production.initialStage} /> 
                    <Body>
                      <Text style={{ color: "green" }}>Inicial</Text>
                    </Body>
                  </ListItem>

                  <ListItem style={{ width: "80%" }}>
                    <CheckBox checked={production.growthStage} />
                    <Body>
                      <Text style={{ color: "green" }}>Crecimiento</Text>
                    </Body>
                  </ListItem>

                  <ListItem style={{ width: "80%" }}>
                    <CheckBox checked= {production.finalStage} />
                    <Body>
                      <Text style={{ color: "green" }}>Final</Text>
                    </Body>
                  </ListItem>
                </View>
                <View
                  style={{
                    flex: 40,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Image
                    source={farmImage}
                    style={{
                      marginRight: 15,
                      borderRadius: 75,
                      width: 150,
                      height: 150
                    }}
                  />
                  
                </View>
              </CardItem>
            </TouchableOpacity>
            <CardItem footer>
              <Left>
                <Icon
                  type="MaterialIcons"
                  name="delete"
                  style={{ marginRight: 15, color: "red" }}
                  onPress={() => {
                    this.delete(production);
                  }}
                />
                <Icon
                  type="MaterialIcons"
                  name="edit"
                  onPress={() => this.updateProduction(production)}

                />
                <Icon
                  type="MaterialIcons"
                  name="library-books"
                  style={{ margin: 15 }}
                />
              </Left>
            </CardItem>
          </Card>
        );
      });
      return (
        <View style={styles.container}>
          <Header
            style={{
              height: 80,
              borderBottomColor: "#fff",
              backgroundColor: "#077A65"
            }}
          >
            <Left>
              <Icon
                type="MaterialIcons"
                name="arrow-back"
                style={styles.iconStyle}
                onPress={() => this.props.navigation.goBack()}
              />
            </Left>
            <Body>
              <Title style={{ width: 220, color: "#fff", fontSize: 18 }}>PRODUCCIÓN HUEVOS</Title>
            </Body>
            <Right />
          </Header>
          <Container>
            <Content>
              <List>{eggsProductions}</List>
            </Content>
          </Container>
          <Fab
            navigation={this.props.navigation}
            active={this.state.active}
            direction="up"
            style={{ backgroundColor: "#077A65", padding: 0, margin: 0 }}
            position="bottomRight"
            onPress={() => this.setState({ active: !this.state.active })}
            onPress={() => {
              const { navigation } = this.props;
              navigation.navigate("corrales", {
                farm,
                onClick: (corral) => {
                  navigation.navigate('AddEggs', {
                    farm,
                    corral,
                    onCreate: this.create.bind(this)
                  });
                }
              });
            }}
          >
            <Icon type="FontAwesome5" name="plus" />
          </Fab>
        </View>
      );
    }
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
