import React, { Component } from "react";
import {
  Container,
  Card,
  CardItem,
  Text,
  Icon,
  Left,
  Spinner
} from "native-base";
import { StyleSheet, View, Image, ScrollView, Alert } from "react-native";
import farmImage from "../../../assets/production/farm.jpg";
import { NavigationActions } from "react-navigation";
import { fs, firebase } from "../Firebase/config";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class TabsExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dbFarms: [],
      Loaded: false
    };
  }

  componentDidMount() {
    fs.collection("farms")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          if (doc.data().user === firebase.auth().currentUser.uid) {
            this.setState({
              dbFarms: [...this.state.dbFarms, doc]
            });
          }
        });
      })
      .then(() => {
        this.setState({
          Loaded: true
        });
      });
  }

  goToEachCard(doc) {
    const navigateAction = NavigationActions.navigate({
      routeName: "cardDetails",
      params: doc
    });
    this.props.navigation.dispatch(navigateAction);
  }

  goToRubro(doc) {
    const navigateAction = NavigationActions.navigate({
      routeName: "rubro",
      params: doc
    });
    this.props.navigation.dispatch(navigateAction);
  }

  removeFarm = (doc, index) => {
    Alert.alert(
      "Borrar Finca",
      "¿Esta seguro que desea borrar esta Finca?",
      [
        {
          text: "Cancelar",
          style: "Cancelar"
        },
        {
          text: "Aceptar",
          onPress: () => {
            fs.collection("farms")
              .doc(doc.id)
              .delete()
              .then(() =>
                this.setState({
                  dbFarms: this.state.dbFarms.filter((e, i) => {
                    return i !== index;
                  })
                })
              );
          }
        }
      ],
      { cancelable: false }
    );
  };
  render() {
    const { Loaded } = this.state;
    if (!Loaded) {
      return (
        <View
          style={{
            color: "#fff",
            height: "100%"
          }}
        >
          <View>
            <ScrollView
              style={{
                height: "100%"
              }}
              scrollEnabled="false"
            >
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  height: "350%",
                  marginRight: "7%",
                  marginLeft: "7%"
                }}
              >
                <Spinner style={{ marginTop: "20%", color: "green" }} />
              </View>
            </ScrollView>
          </View>
        </View>
      );
    } else {
      const addEspecificationOnTab = this.state.dbFarms.map((doc, index) => {
        return (
          <Card style={{ margin: 10 }} key={index}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("rubro", doc)}
            >
              <CardItem header>
                <Left>
                  <Text
                    style={{
                      color: "red",
                      marginLeft: 10,
                      fontWeight: "bold"
                    }}
                  >
                    Nombre:{"\n "}
                    <Text
                      style={{
                        fontSize: 32,
                        fontWeight: "500",
                        marginLeft: 20,
                        fontWeight: "bold"
                      }}
                    >
                      {doc.data().name}
                    </Text>
                  </Text>
                </Left>
              </CardItem>
              <CardItem cardBody style={{ flex: 1, height: 150 }}>
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
                        marginLeft: 20
                      }}
                    >
                      {doc.data().id}
                    </Text>
                  </Text>
                  <Text
                    style={{
                      color: "red",
                      marginLeft: 10,
                      fontWeight: "bold"
                    }}
                  >
                    Ubicación:{"\n "}
                    <Text
                      style={{
                        fontSize: 25,
                        fontWeight: "500",
                        marginLeft: 20
                      }}
                    >
                      {doc.data().location}
                    </Text>
                  </Text>
                  <Text
                    style={{
                      color: "red",
                      marginLeft: 10,
                      fontWeight: "bold"
                    }}
                  >
                    Área:{"\n"}
                    <Text
                      style={{
                        fontSize: 25,
                        fontWeight: "500",
                        marginLeft: 20
                      }}
                    >
                      {doc.data().groundSize} {" " + "m2"}
                    </Text>
                  </Text>
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
                  onPress={() => this.removeFarm(doc, index)}
                />
                <Icon
                  type="MaterialIcons"
                  name="edit"
                  onPress={() =>
                    this.props.navigation.navigate("updateFarm", doc)
                  }
                />
                <Icon
                  type="MaterialIcons"
                  name="library-books"
                  style={{ margin: 15 }}
                  onPress={()=> this.props.navigation.navigate("Estimaciones", doc)}
                />
              </Left>
            </CardItem>
          </Card>
        );
      });
      return (
        <Container>
          <ScrollView>{addEspecificationOnTab}</ScrollView>
        </Container>
      );
    }
  }
}

const styles = StyleSheet.create({
  colores: {
    color: "#077A65"
  },
  iconStyle: {
    fontSize: 40,
    color: "#fff"
  },
  container: {
    marginLeft: "2%",
    marginRight: "2%",
    marginTop: "10%",
    flex: 1
  },
  cardStyle: {},
  especie: {
    fontWeight: "600",
    fontSize: 20,
    textAlign: "center",
    color: "#721A98",
    width: "100%"
  },
  data: {
    fontWeight: "500",
    fontSize: 18,
    color: "#11B000",
    width: "100%"
  },
  labels: {
    fontWeight: "600",
    fontSize: 18,
    color: "#000",
    width: "100%"
  },
  area: {
    fontWeight: "600",
    fontSize: 25,
    color: "#000",
    width: "100%"
  },
  dataArea: {
    fontWeight: "600",
    fontSize: 25,
    color: "red",
    width: "100%"
  }
});
