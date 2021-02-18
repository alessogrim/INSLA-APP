import React, { Component } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
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
  Container,
  Content,
  List,
  ListItem,
  Thumbnail
} from "native-base";
import { firebase, fs } from "../Firebase/config";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TouchableOpacity } from "react-native-gesture-handler";
export default class Buy extends Component {
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
      Loaded: false,
      preloader: false,
      text: "",
      sale: []
    };
  }
  componentDidMount() {
    fs.collection("Mercado")
      .get()
      .then(query => {
        query.forEach(doc => {
          this.setState({
            sale: [...this.state.sale, doc]
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
      const productions = this.state.sale.map((doc, index) => {
        if (doc.data().id.substr(0, 3) === "PRS") {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => this.props.navigation.navigate("buyDetails", doc)}
            >
              <ListItem avatar>
                <Left>
                  <Thumbnail
                    source={require("../../../assets/productions.jpg")}
                  />
                </Left>
                <Body>
                  <Text>{"Produccion de carne de pollo "}</Text>
                  <Text note>{"Finca " + doc.data().farmName}</Text>
                  <Text note>
                    {doc.data().cantidadVender + " pollos disponibles"}
                  </Text>
                </Body>
              </ListItem>
            </TouchableOpacity>
          );
        } else if (doc.data().id.substr(0, 3) === "PRC") {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => this.props.navigation.navigate("buyDetails", doc)}
            >
              <ListItem avatar>
                <Left>
                  <Thumbnail
                    source={require("../../../assets/vegetables.png")}
                  />
                </Left>
                <Body>
                  <Text>{"Cultivo de " + doc.data().cultivo}</Text>
                  <Text note>
                    {doc.data().cantidadVender + " quintales disponibles"}
                  </Text>
                  <Text note>
                    {"Precio quintal: " +
                      doc.data().precioQuintal +
                      " Lempiras"}
                  </Text>
                </Body>
              </ListItem>
            </TouchableOpacity>
          );
        }
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
              <Title style={{ color: "#fff", fontSize: 18 }}>COMPRAR</Title>
            </Body>
            <Right />
          </Header>
          <Container>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                alignItems: "flex-start",
                justifyContent: "center",
                paddingTop: 15
              }}
            >
              <Item floatingLabel style={{ width: "100%", height: 60 }}>
                <Icon
                  type="MaterialIcons"
                  name="search"
                  style={{
                    fontSize: 45,
                    padding: 5
                  }}
                />
                <Label style={{ marginLeft: 30 }}>¿Que deseas Comprar?</Label>
                <Input
                  style={{
                    fontSize: 25,
                    alignSelf: "flex-start"
                  }}
                  onChangeText={text => {
                    this.setState({
                      text
                    });
                  }}
                />
              </Item>
            </View>
            <Content>
              <List>{productions}</List>
            </Content>
          </Container>
        </View>

        /*
         */
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
