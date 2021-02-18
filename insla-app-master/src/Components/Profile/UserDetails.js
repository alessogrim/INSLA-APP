import React, { Component } from "react";
import { firebase, fs } from "../Firebase/config";
import {
  Spinner,
  Header,
  Left,
  Icon,
  Right,
  Body,
  Title,
  Text
} from "native-base";
import { ScrollView, View, Image, Button } from "react-native";

export default class UserDetails extends Component {
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
      current: {},
      Loaded: false
    };
  }

  componentDidMount() {
    fs.collection("users")
      .where("email", "==", firebase.auth().currentUser.email)
      .get()
      .then(query => {
        query.forEach(doc => {
          this.setState({
            current: doc
          });
        });
      })
      .then(() => {
        this.setState({
          Loaded: true
        });
      });
  }

  render() {
    const { current, Loaded } = this.state;
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
                <Spinner style={{ marginTop: "20%" }} />
              </View>
            </ScrollView>
          </View>
        </View>
      );
    } else {
      return (
        <View>
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
                name="menu"
                style={{
                  fontSize: 50,
                  marginLeft: 10,
                  color: "#fff"
                }}
                onPress={() => this.props.navigation.openDrawer()}
              />
            </Left>
            <Body>
              <Title style={{ color: "#fff" }}>USUARIO</Title>
            </Body>
            <Right />
          </Header>
          <View
            style={{
              display: "flex",
              height: "100%",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <ScrollView style={{ width: "100%" }}>
              <View
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Image
                  style={{
                    marginTop: "8%",
                    borderRadius: 75,
                    height: 150,
                    width: 150
                  }}
                  source={require("../../../assets/perfil.png")}
                />

                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    marginTop: "8%",
                    textAlign: "center"
                  }}
                >
                  {current.data().name + " " + current.data().lastName}
                </Text>
                <Text
                  style={{
                    fontSize: 21,
                    fontWeight: "bold",
                    textAlign: "center",
                    color: "red"
                  }}
                >
                  {current.data().role == 2 ? "Adminitrador" : "Estandar"}
                </Text>
                <Text
                  style={{
                    fontSize: 21,
                    fontWeight: "bold",
                    marginTop: "2%",
                    textAlign: "center"
                  }}
                >
                  Telefono:{" "}
                  <Text style={{ color: "#077A65", fontSize: 21 }}>
                    {" "}
                    {current.data().telephone}
                  </Text>
                </Text>
                <Text
                  style={{
                    fontSize: 21,
                    fontWeight: "bold",
                    marginTop: "2%",
                    textAlign: "center"
                  }}
                >
                  Email :{" "}
                  <Text style={{ color: "#077A65", fontSize: 21 }}>
                    {" "}
                    {current.data().email}
                  </Text>
                </Text>
                <Text
                  style={{
                    fontSize: 21,
                    fontWeight: "bold",
                    marginTop: "2%",
                    textAlign: "center"
                  }}
                >
                  Sector :{" "}
                  <Text style={{ color: "#077A65", fontSize: 21 }}>
                    {" "}
                    {current.data().sector}
                  </Text>
                </Text>

                <Text
                  style={{
                    fontSize: 21,
                    fontWeight: "bold",
                    marginTop: "2%",
                    textAlign: "center"
                  }}
                >
                  Rubro :{" "}
                  <Text
                    style={{
                      color: "#077A65",
                      fontSize: 21,
                      marginBottom: "5%"
                    }}
                  >
                    {" "}
                    {current.data().type}
                  </Text>
                </Text>
                <View style={{ marginTop: 12 }}>
                  <Button
                    title="Editar"
                    fontSize="5"
                    onPress={() =>
                      this.props.navigation.navigate("profile", current)
                    }
                  />
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      );
    }
  }
}
