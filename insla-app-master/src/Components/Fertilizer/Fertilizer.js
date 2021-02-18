import React, { Component } from "react";
import { Text, StyleSheet, Alert, ScrollView, View } from "react-native";
import {
  Header, Left, Right, Body, Icon, Container, Fab,
  ListItem, Thumbnail, Row, Title
} from "native-base";
import { fs } from "../Firebase/config";

export default class Fertilizer extends Component {
  
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
      active: false,
      Loaded: true,
      farm: this.props.navigation.state.params,
      fertilizer: [],
      stage : "1"
    };
  }

  state = {
    fertilizer: [],
    Loaded: false
  }

  componentDidMount() {
    this.getFertilizer()
  }

  async createFertilizer(newFertilizer) {
    await fs.collection('fertilizer').add(newFertilizer)
    await fs.collection("admin_abonos").doc(newFertilizer.abono).update({
      status: true
    });
  }

  async getFertilizer() {
    console.log(this.props.stage)
    const { farm } = this.props.navigation.state.params
    const querySnapshot = await fs.collection("fertilizer")
      .get();
    let fertilizer = [];
    querySnapshot.forEach(doc => {
      
      const document = {
        _id: doc.id,
        ...doc.data()
      };
      fertilizer.push(document);
    });
    const populateCW = fertilizer.map(async cw => {
      const abonoDoc = await fs.collection("admin_abonos")
        .doc(cw.abono)
        .get()
      cw.abonoData = abonoDoc.data();
      return cw;
    });
    fertilizer = await Promise.all(populateCW)
    this.setState({
      fertilizer,
      Loaded: true
    });
  }

  deleteFertilizer(fer) {
    Alert.alert(
      "Borrar Abono",
      "¿Esta seguro que desea borrar este Abono?",
      [
        {
          text: "Cancelar",

          style: "Cancelar"
        },
        {
          text: "Aceptar",
          onPress: async () => {
            await fs.collection("fertilizer")
              .doc(fer._id)
              .delete()
            this.setState({
              fertilizer: this.state.fertilizer.filter((cw) => {
                return cw._id !== fer._id;
              })
            });
            await fs.collection("admin_abonos").doc(fer.abono).update({
              status: false
            });
          }
        }
      ],
      { cancelable: false }
    );
  }

  render() {
    const { Loaded } = this.state;
    const { farm } = this.props.navigation.state.params
    if (!Loaded) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Spinner color="green" />
        </View>
      );
    } else {
    const showFertilizer = this.state.fertilizer.map((cw) => {
      return (
        <ListItem avatar>
          <Left>
            <Thumbnail
              source={require("../../../assets/seed.png")} 
            />
          </Left>
          <Body>
            <Text>ID: {cw.abonoData.id}</Text>
            <Text>Nombre: {cw.abonoData.name }</Text>
            <Text>Cantidad: {cw.abonoData.quantity }</Text>
          </Body>
          <Right>
            <Row >
              <Icon
                type="MaterialIcons"
                name="delete"
                style={{ color: "red", fontSize: 30 }}
                onPress={() => this.deleteFertilizer(cw)}
              />
            </Row>
          </Right>
        </ListItem>
      )
    });
    return (
      <View style={styles.container}>
          <Header style={{
            height: 80,
            width: "100%",
            borderBottomColor: "#fff",
            backgroundColor: "#077A65"
          }}>
            <Left>
              <Icon
                type="MaterialIcons"
                name="arrow-back"
                style={styles.iconStyle}
                onPress={() => this.props.navigation.goBack()}
              />
            </Left>
            <Body>
              <Title style={{ width: 220, color: "#fff", fontSize: 17 }}>ABONO</Title>
            </Body>
            <Right></Right>
          </Header>
        <Container
          style={{
            marginLeft: 3,
            marginRight: 3
          }}
        >
          <ScrollView>
            {showFertilizer}
          </ScrollView>
        </Container>
        <Fab
          direction="up"
          style={{
            backgroundColor: "#077A65",
            padding: 0,
            margin: 0,
            position: "absolute"
          }}
          position="bottomRight"
          onPress={() => {
            this.props.navigation.navigate("adminAbono", {
              farm,
              onClick: (abono) => {
                console.log(abono.data());
                this.props.navigation.navigate("addFertilizer", {
                  abono: abono.data(),
                  onCreate: async (fertilizer) => {
                    const newFertilizer = {
                      ...fertilizer,
                      abono: abono.id
                    };
                    await this.createFertilizer(newFertilizer);
                    this.props.navigation.navigate("fertilizer");
                    await this.getFertilizer();
                  }
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